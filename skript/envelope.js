const REQUIRED_HITS = 4;
let hits = 0;
let opened = false;
let isReturningFromAlbum = false; // Флаг возврата из альбома

const envelope    = document.getElementById("envelope");
const envelopeHit = document.getElementById("envelope-hit");
const letterFlip  = document.getElementById("letter-flip");
const scene       = document.querySelector(".envelope-scene");
const hint        = document.getElementById("prize-hint");

export function initEnvelope() {
  if (envelope) {
    envelope.addEventListener("click", () => {
      if (opened) return;
      hits++;
      playHitEffect();
      shakeEnvelope();
      if (hits >= REQUIRED_HITS) openEnvelope();
    });
  }

  if (letterFlip) {
    letterFlip.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!opened) return;
      letterFlip.classList.toggle("flipped");
    });
  }

  // Кнопка перехода в альбом
  const goToAlbumBtn = document.getElementById("go-to-album-btn");
  if (goToAlbumBtn) {
    goToAlbumBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      isReturningFromAlbum = true; // Запоминаем, что уходим в альбом
      import("./screens.js").then(module => {
        module.showScreen("album");
      });
    });
  }

  // Кнопка возврата из альбома
  const backToPrizeBtn = document.getElementById("back-to-prize-btn");
  if (backToPrizeBtn) {
    backToPrizeBtn.addEventListener("click", () => {
      import("./screens.js").then(module => {
        module.showScreen("prize");
        // Если возвращаемся из альбома — показываем открытую записку
        if (isReturningFromAlbum) {
          openEnvelope(true);
        }
      });
    });
  }
}

export function resetEnvelope() {
  hits = 0;
  opened = false;
  isReturningFromAlbum = false;
  if (envelope) envelope.classList.remove("open", "hit");
  if (letterFlip) letterFlip.classList.remove("flipped");
  if (scene) scene.classList.remove("letter-visible");
  if (hint) hint.style.display = "";
}

function shakeEnvelope() {
  if (!envelope) return;
  envelope.classList.remove("hit");
  void envelope.offsetWidth;
  envelope.classList.add("hit");
  setTimeout(() => envelope.classList.remove("hit"), 400);
}

function playHitEffect() {
  if (!envelopeHit) return;
  const n = 7;
  for (let i = 0; i < n; i++) {
    const spark = document.createElement("img");
    spark.src = "assets/sparkle.svg";
    spark.className = "hit-spark";
    spark.alt = "";
    const angle = (Math.PI * 2 / n) * i;
    const dist = (i === 0 ? 0 : 50 + Math.random() * 30);
    spark.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    spark.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    envelopeHit.appendChild(spark);
    setTimeout(() => spark.remove(), 650);
  }
}

// Если isInstant = true, записка появляется сразу без задержек
function openEnvelope(isInstant = false) {
  opened = true;
  if (envelope) envelope.classList.add("open");
  if (hint) hint.style.display = "none";

  const delay = isInstant ? 0 : 200; // Если возврат из альбома — показываем сразу
  
  setTimeout(() => {
    if (scene) scene.classList.add("letter-visible");
    if (!isInstant) burstSparks(); // Искры только при первом открытии
  }, delay);
}

function burstSparks() {
  if (!scene) return;
  const n = 20;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("img");
    s.src = "assets/sparkle.svg";
    s.className = "letter-spark";
    s.alt = "";
    const angle = (Math.PI * 2 / n) * i;
    const dist = 200 + Math.random() * 200;
    s.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    s.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    s.style.animationDelay = (i * 0.04) + "s";
    scene.appendChild(s);
    setTimeout(() => s.remove(), 1200);
  }
}