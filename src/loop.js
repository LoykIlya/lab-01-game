/**
 * Ігровий цикл з фіксованим кроком симуляції (Fix Your Timestep).
 *
 * Як це працює:
 * 1. requestAnimationFrame викликає frame() перед кожним малюванням екрана
 * 2. Ми рахуємо, скільки реального часу минуло (dt)
 * 3. Додаємо dt до "акумулятора"
 * 4. Поки в акумуляторі >= STEP (1/60 сек) — викликаємо simulate() рівно один раз
 * 5. render(alpha) малює проміжний стан між двома симуляційними кадрами
 */
export function createLoop({ step = 1 / 60, simulate, render }) {
  let running = false;
  let rafId = null;
  let last = performance.now();
  let accumulator = 0;

  // Статистика для HUD
  let stepsThisSecond = 0;
  let framesThisSecond = 0;
  let stepsPerSecond = 0;
  let framesPerSecond = 0;
  let lastFrameDurationMs = 0;
  let statsLast = performance.now();

  function frame(now) {
    if (!running) return;

    // Скільки секунд минуло з минулого кадру
    let dt = (now - last) / 1000;
    // Обмежуємо dt: якщо вкладка "зависла" на 5 сек — не симулюємо 300 кроків одразу
    dt = Math.min(dt, 0.25);
    last = now;
    lastFrameDurationMs = dt * 1000;

    accumulator += dt;

    // Фіксований крок: симуляція ЗАВЖДИ 60 разів на секунду
    while (accumulator >= step) {
      simulate(step);
      accumulator -= step;
      stepsThisSecond++;
    }

    // alpha = наскільки ми "між" двома симуляційними станами (0..1)
    const alpha = accumulator / step;
    render(alpha);
    framesThisSecond++;

    // Оновлюємо stats раз на секунду
    if (now - statsLast >= 1000) {
      stepsPerSecond = stepsThisSecond;
      framesPerSecond = framesThisSecond;
      stepsThisSecond = 0;
      framesThisSecond = 0;
      statsLast = now;
    }

    rafId = requestAnimationFrame(frame);
  }

  return {
    start() {
      if (running) return;
      running = true;
      last = performance.now();
      statsLast = last;
      accumulator = 0;
      rafId = requestAnimationFrame(frame);
    },

    stop() {
      running = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },

    getStats() {
      return {
        stepsPerSecond,
        framesPerSecond,
        frameTimeMs: lastFrameDurationMs,
      };
    },
  };
}
