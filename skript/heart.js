/* ============================================================
   HEART.JS — снежинки, падающие в сердце.
   ============================================================ */

const heartFallingZone = document.getElementById("heart-falling-zone");

export function dropFlakeIntoHeart(count) {
  if (!heartFallingZone) return;

  const n = Math.min(count, 3);
  for (let k = 0; k < n; k++) {
    setTimeout(() => {
      const f = document.createElement("img");
      f.src = "assets/snowflake.svg";
      f.className = "falling-flake";
      f.alt = "";
      f.style.left = (Math.random() * 30 + 10) + "px";
      heartFallingZone.appendChild(f);
      setTimeout(() => f.remove(), 1000);
    }, k * 120);
  }
}