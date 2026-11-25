/* ============================================================
   GAME.JS — игра: снежинки, счёт, комбо, победа.
   ============================================================ */

import { dropFlakeIntoHeart } from "./heart.js";
import { updateHeart3D, pulseHeart3D, boostHeart3D } from "./heart3d.js";
import { addFlakeToJar } from "./jar3d.js";

const TOTAL       = 100;
const COMBO_EVERY = 3;

// 🎲 МАССИВЫ С РАЗНЫМИ КАРТИНКАМИ
const SNOWFLAKE_IMAGES = [
  "assets/snowflake.svg",
  "assets/snowflake2.svg",
  "assets/snowflake3.svg",
  "assets/snowflake4.svg"
];

const SPARKLE_IMAGES = [
  "assets/sparkle.svg",
  "assets/sparkle2.svg",
  "assets/sparkle3.svg",
  "assets/sparkle4.svg"
];

const gameArea       = document.getElementById("game-area");
const scoreEl        = document.getElementById("score");
const comboPopup     = document.getElementById("combo-popup");
const comboIndicator = document.getElementById("combo-indicator");

let score = 0;
let streak = 0;
let spawnInterval = null;
let showScreenFn = null;

const COMBO_LEVELS = [
  null, null,
  { text: "Комбо +2",     bonus: 2 },
  { text: "Комбо +3",     bonus: 3 },
  { text: "Комбо +4",     bonus: 4 },
  { text: "Комбо!!!! +5", bonus: 5 },
  { text: "ВАААУ!! +6",   bonus: 6 }
];

export function initGame({ showScreen }) {
  showScreenFn = showScreen;

  if (gameArea) {
    gameArea.addEventListener("click", (e) => {
      if (e.target === gameArea) onMiss();
    });
  }
}

export function startGame() {
  if (!gameArea) return;
  score = 0;
  streak = 0;
  updateUI();
  updateHeart3D(0);

  gameArea.innerHTML = "";
  if (comboPopup) gameArea.appendChild(comboPopup);

  if (spawnInterval) clearInterval(spawnInterval);
  spawnInterval = setInterval(spawnSnowflake, 300);
}

function updateUI() {
  if (scoreEl) scoreEl.textContent = Math.min(score, TOTAL) + " / " + TOTAL;
  if (comboIndicator) {
    comboIndicator.textContent = "Комбо: " + streak;
    if (streak >= COMBO_EVERY) comboIndicator.classList.add("hot");
    else comboIndicator.classList.remove("hot");
  }
}

function showComboPopup(level) {
  if (!comboPopup) return;
  const cfg = COMBO_LEVELS[level];
  if (!cfg) return;

  comboPopup.innerHTML = "";
  comboPopup.classList.remove("show");

  const burst = document.createElement("div");
  burst.className = "combo-burst";
  comboPopup.appendChild(burst);

  const sparksCount = 12 + level * 2;
  for (let s = 0; s < sparksCount; s++) {
    const spark = document.createElement("img");
    // Случайная искра для комбо
    spark.src = SPARKLE_IMAGES[Math.floor(Math.random() * SPARKLE_IMAGES.length)];
    spark.className = "combo-spark";
    spark.alt = "";
    const angle = (Math.PI * 2 / sparksCount) * s;
    const dist = 90 + Math.random() * 60;
    spark.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    spark.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    spark.style.animationDelay = (s * 0.03) + "s";
    comboPopup.appendChild(spark);
  }

  const text = document.createElement("div");
  text.className = "combo-text combo-lvl-" + level;
  text.textContent = cfg.text;
  comboPopup.appendChild(text);

  const sub = document.createElement("div");
  sub.className = "combo-sub";
  sub.textContent = "+" + (cfg.bonus + 1);
  comboPopup.appendChild(sub);

  void comboPopup.offsetWidth;
  comboPopup.classList.add("show");

  setTimeout(() => {
    comboPopup.classList.remove("show");
    comboPopup.innerHTML = "";
  }, 2200);
}

function addPoints(amount) {
  score += amount;
  if (score > TOTAL) score = TOTAL;
  updateUI();
  updateHeart3D(score / TOTAL * 100);

  if (score >= TOTAL) {
    if (spawnInterval) clearInterval(spawnInterval);
    setTimeout(() => {
      if (typeof showScreenFn === "function") showScreenFn("prize");
    }, 900);
  }
}

function onCatch() {
  streak++;
  let gained = 1;

  if (streak % COMBO_EVERY === 0) {
    const level = Math.min(Math.floor(streak / COMBO_EVERY) + 1, 6);
    const cfg = COMBO_LEVELS[level];
    if (cfg) {
      showComboPopup(level);
      gained = 1 + cfg.bonus;
    }
  }

  addPoints(gained);
  
  addFlakeToJar();
  addFlakeToJar();
  addFlakeToJar();

  if (gained >= 4) {
    addFlakeToJar();
    addFlakeToJar();
    addFlakeToJar();
  }
  
  pulseHeart3D();
  if (gained >= 4) boostHeart3D();
}

function onMiss() {
  if (streak > 0) {
    streak = 0;
    updateUI();
  }
}

function spawnSnowflake() {
  if (!gameArea) return;
  if (score >= TOTAL) return;

  const flake = document.createElement("img");
  
  // 🎲 Случайная снежинка
  flake.src = SNOWFLAKE_IMAGES[Math.floor(Math.random() * SNOWFLAKE_IMAGES.length)];
  
  flake.className = "snowflake-game";
  flake.alt = "";
  flake.draggable = false;

  const areaWidth  = gameArea.clientWidth;
  const areaHeight = gameArea.clientHeight;

  const size = Math.random() * 40 + 20;
  flake.style.width = size + "px";
  flake.style.height = size + "px";

  let posX = Math.random() * (areaWidth - size);
  let posY = -50;
  flake.style.left = posX + "px";
  flake.style.top  = posY + "px";

  let rotation = Math.random() * 360;
  flake.style.transform = `rotate(${rotation}deg)`;

  gameArea.appendChild(flake);

  const speed = Math.random() * 2.2 + 0.8;
  const swayAmount = Math.random() * 2 + 1;
  const swaySpeed = Math.random() * 0.05 + 0.02;
  let time = Math.random() * 100;

  const fallInterval = setInterval(() => {
    posY += speed;
    time += swaySpeed;
    
    const swayX = Math.sin(time) * swayAmount;
    flake.style.left = (posX + swayX) + "px";
    flake.style.top = posY + "px";
    
    rotation += 2;
    flake.style.transform = `rotate(${rotation}deg)`;

    if (posY > areaHeight) {
      clearInterval(fallInterval);
      flake.remove();
    }
  }, 20);

  flake.addEventListener("click", (e) => {
    e.stopPropagation();
    if (score >= TOTAL) return;

    createHitEffect(flake);
    clearInterval(fallInterval);
    flake.remove();
    onCatch();
  });
}

function createHitEffect(flake) {
  if (!gameArea) return;
  const left = flake.style.left;
  const top  = flake.style.top;

  // 🎲 Случайная искра для вспышки
  const pop = document.createElement("img");
  pop.src = SPARKLE_IMAGES[Math.floor(Math.random() * SPARKLE_IMAGES.length)];
  pop.className = "pop";
  pop.alt = "";
  pop.style.left = left;
  pop.style.top  = top;
  gameArea.appendChild(pop);
  setTimeout(() => pop.remove(), 700);

  // 🎲 Случайные искры для разлетающихся частиц
  const particlesCount = 4 + Math.floor(Math.random() * 3);
  for (let i = 0; i < particlesCount; i++) {
    const p = document.createElement("img");
    p.src = SPARKLE_IMAGES[Math.floor(Math.random() * SPARKLE_IMAGES.length)];
    p.className = "hit-particle";
    p.alt = "";
    p.style.left = left;
    p.style.top  = top;
    const angle = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * 40;
    p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    p.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    gameArea.appendChild(p);
    setTimeout(() => p.remove(), 700);
  }
}