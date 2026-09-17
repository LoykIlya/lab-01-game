/** Створити початковий стан корабля */
export function createShip(x, y) {
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    angle: 0, // радіани, 0 = вправо
    thrust: false,
  };
}

/** Скопіювати стан корабля (для інтерполяції між кадрами) */
export function copyShip(ship) {
  return { ...ship };
}

/**
 * Чиста функція фізики — без DOM, без canvas.
 * Отримує стан + ввід + dt, змінює ship на місці.
 */
export function integrate(ship, input, dt) {
  const ROT_SPEED = 4; // радіан/сек
  const THRUST_POWER = 280;
  const DRAG = 0.992;
  const MAX_SPEED = 450;

  // Обертання
  if (input.isDown("ArrowLeft") || input.isDown("KeyA")) {
    ship.angle -= ROT_SPEED * dt;
  }
  if (input.isDown("ArrowRight") || input.isDown("KeyD")) {
    ship.angle += ROT_SPEED * dt;
  }

  // Прискорення в напрямку носа корабля
  ship.thrust = input.isDown("ArrowUp") || input.isDown("KeyW");
  if (ship.thrust) {
    ship.vx += Math.cos(ship.angle) * THRUST_POWER * dt;
    ship.vy += Math.sin(ship.angle) * THRUST_POWER * dt;
  }

  // Опір (повільне гальмування)
  ship.vx *= DRAG;
  ship.vy *= DRAG;

  // Обмеження максимальної швидкості
  const speed = Math.hypot(ship.vx, ship.vy);
  if (speed > MAX_SPEED) {
    ship.vx = (ship.vx / speed) * MAX_SPEED;
    ship.vy = (ship.vy / speed) * MAX_SPEED;
  }

  // Рух
  ship.x += ship.vx * dt;
  ship.y += ship.vy * dt;
}
