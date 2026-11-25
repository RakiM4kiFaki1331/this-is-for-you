/* ============================================================
   SCREENS.JS — переключение экранов.
   ============================================================ */

export const screens = {
  start: document.getElementById("screen-start"),
  name:  document.getElementById("screen-name"),
  game:  document.getElementById("screen-game"),
  prize: document.getElementById("screen-prize"),
  album: document.getElementById("screen-album")
};

export function showScreen(name) {
  for (const key in screens) {
    if (screens[key]) screens[key].classList.remove("active");
  }
  
  if (screens[name]) screens[name].classList.add("active");

  if (name === "game") {
    document.body.classList.add("playing");
  } else {
    document.body.classList.remove("playing");
  }
}