/**
 * Налаштування canvas з урахуванням devicePixelRatio (Retina-екрани).
 *
 * Без DPR: на Retina canvas маленький (напр. 800×600 px),
 * але CSS розтягує його — картинка розмита.
 * Рішення: canvas.width = cssWidth * dpr, потім ctx.scale(dpr, dpr).
 */
export function setupCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  let cssWidth = 0;
  let cssHeight = 0;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    cssWidth = window.innerWidth;
    cssHeight = window.innerHeight;

    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  resize();
  window.addEventListener("resize", resize);

  return {
    ctx,
    getSize: () => ({ width: cssWidth, height: cssHeight }),
  };
}
