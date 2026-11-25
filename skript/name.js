/* ============================================================
   NAME.JS — проверка имени на экране ввода.
   Экспортирует: initName({ showScreen, startGame, herName })
   ============================================================ */

export function initName({ showScreen, startGame, herName }) {
  const HER_NAME = "Сонечка"; // правильное имя для проверки

  const input = document.getElementById("name-input");
  const error = document.getElementById("name-error");
  const btn   = document.getElementById("name-btn");
  const herNameEl = document.getElementById("her-name");

  // Подставляем имя на заставку
  if (herNameEl) herNameEl.textContent = herName || HER_NAME;

  function checkName() {
    if (!input || !error) return;

    const value = input.value.trim().toLowerCase();

    if (value === HER_NAME.toLowerCase()) {
      error.textContent = "";
      showScreen("game");
      if (typeof startGame === "function") startGame();
    } else {
      error.textContent = "Ой! это не моё Солнышко=(";
      // Перезапуск тряски
      error.style.animation = "none";
      void error.offsetWidth;
      error.style.animation = "shake 0.4s";
    }
  }

  if (btn) btn.addEventListener("click", checkName);
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") checkName();
    });
  }

  // Сброс при возврате на заставку (кнопка «Ещё раз»)
  const restartBtn = document.getElementById("restart-btn");
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      if (input) input.value = "";
      if (error) error.textContent = "";
      showScreen("start");
    });
  }
}