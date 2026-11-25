import * as THREE from "three";
window.THREE = THREE;

import { showScreen } from "./screens.js";
import { initName } from "./name.js";
import { initBackground } from "./background.js";
import { initGame, startGame } from "./game.js";
import { initEnvelope } from "./envelope.js"; // <-- Вернули старый конверт
import { initHeart3D } from "./heart3d.js";
import { initJar3D } from "./jar3d.js";

window.addEventListener("DOMContentLoaded", () => {
  initBackground();

  const heartMount = document.getElementById("heart-3d");
  if (heartMount) initHeart3D(heartMount);

  const jarMount = document.getElementById("jar-3d");
  if (jarMount) initJar3D(jarMount);

  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      showScreen("name");
      const input = document.getElementById("name-input");
      if (input) input.focus();
    });
  }

  initName({ showScreen, startGame, herName: "Сонечка" });
  initGame({ showScreen });
  
  // Запускаем старый добрый конверт
  initEnvelope();
});