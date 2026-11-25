/* ============================================================
   BACKGROUND.JS — фоновый снег (SVG) и звёзды.
   ============================================================ */

export function initBackground() {
  initSnow();
  initStars();
}

function initSnow() {
  const container = document.getElementById("snow-container");
  if (!container) return;

  for (let i = 0; i < 50; i++) {
    const flake = document.createElement("img");
    flake.src = "assets/snowflake.svg";
    flake.className = "snowflake";
    flake.alt = "";
    flake.draggable = false;
    flake.style.left = Math.random() * 100 + "vw";
    const size = Math.random() * 18 + 10;
    flake.style.width  = size + "px";
    flake.style.height = size + "px";
    flake.style.animationDuration = (Math.random() * 5 + 5) + "s";
    flake.style.animationDelay = (Math.random() * 5) + "s";
    flake.style.opacity = Math.random() * 0.6 + 0.4;
    container.appendChild(flake);
  }
}

function initStars() {
  const container = document.getElementById("stars-container");
  if (!container) return;

  for (let i = 0; i < 120; i++) {
    const star = document.createElement("div");
    star.className = "star";
    const size = Math.random() * 2.5 + 1;
    star.style.width  = size + "px";
    star.style.height = size + "px";
    star.style.left = Math.random() * 100 + "vw";
    star.style.top  = Math.random() * 100 + "vh";
    star.style.animationDelay    = Math.random() * 3 + "s";
    star.style.animationDuration = (Math.random() * 2 + 2) + "s";
    container.appendChild(star);
  }
}