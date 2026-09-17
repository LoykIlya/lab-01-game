import { createLoop } from "./loop.js";
import { createInput } from "./input.js";
import { createShip, copyShip, integrate } from "./sim/ship.js";
import { wrapShip } from "./sim/arena.js";
import { setupCanvas } from "./render/canvas.js";
import { drawBackground, drawShip, drawHud, lerpShip } from "./render/draw.js";

// ── Canvas ──────────────────────────────────────────────────────────
const canvas = document.getElementById("game");
const { ctx, getSize } = setupCanvas(canvas);

// ── Input (замикання) ───────────────────────────────────────────────
const input = createInput(window);

// ── Стан гри ────────────────────────────────────────────────────────
const { width, height } = getSize();
const current = createShip(width / 2, height / 2);
const previous = copyShip(current);

// ── Ігровий цикл ────────────────────────────────────────────────────
const loop = createLoop({
  step: 1 / 60,

  simulate(_dt) {
    // Зберігаємо попередній стан для інтерполяції
    Object.assign(previous, current);

    integrate(current, input, _dt);

    const size = getSize();
    wrapShip(current, size.width, size.height);

    input.endFrame();
  },

  render(alpha) {
    const size = getSize();
    const display = lerpShip(previous, current, alpha);

    drawBackground(ctx, size.width, size.height);
    drawShip(ctx, display);
    drawHud(ctx, loop.getStats(), size.width, size.height);
  },
});

loop.start();
