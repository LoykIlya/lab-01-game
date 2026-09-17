/** Лінійна інтерполяція між двома числами */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** Інтерполяція кута з урахуванням "загортання" (-π..π) */
function lerpAngle(a, b, t) {
  let diff = b - a;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  return a + diff * t;
}

/** Проміжний стан корабля між previous і current для плавного рендеру */
export function lerpShip(previous, current, alpha) {
  return {
    x: lerp(previous.x, current.x, alpha),
    y: lerp(previous.y, current.y, alpha),
    vx: lerp(previous.vx, current.vx, alpha),
    vy: lerp(previous.vy, current.vy, alpha),
    angle: lerpAngle(previous.angle, current.angle, alpha),
    thrust: current.thrust,
  };
}

/** Зоряне поле, щоб було видно рух */
export function drawBackground(ctx, width, height) {
  ctx.fillStyle = "#0a0a1a";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  for (let i = 0; i < 80; i++) {
    const x = ((i * 137) % width) + ((i * 53) % 7);
    const y = ((i * 97) % height) + ((i * 31) % 11);
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Сітка для орієнтації
  ctx.strokeStyle = "rgba(100, 120, 180, 0.15)";
  ctx.lineWidth = 1;
  const gridSize = 50;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

/** Малюємо космічний корабель (трикутник + полум'я при thrust) */
export function drawShip(ctx, ship) {
  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.angle);

  // Корпус
  ctx.beginPath();
  ctx.moveTo(18, 0);
  ctx.lineTo(-12, -10);
  ctx.lineTo(-8, 0);
  ctx.lineTo(-12, 10);
  ctx.closePath();
  ctx.fillStyle = "#6ec6ff";
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Полум'я двигуна
  if (ship.thrust) {
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(-22 - Math.random() * 8, 0);
    ctx.strokeStyle = "#ff8844";
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  ctx.restore();
}

/** HUD: steps/s, frames/s, frame time */
export function drawHud(ctx, stats, width, height) {
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  ctx.fillRect(10, 10, 220, 72);
  ctx.fillStyle = "#00ff88";
  ctx.font = "14px monospace";
  ctx.fillText(`steps/s:  ${stats.stepsPerSecond}`, 20, 32);
  ctx.fillText(`frames/s: ${stats.framesPerSecond}`, 20, 52);
  ctx.fillText(`frame:    ${stats.frameTimeMs.toFixed(1)} ms`, 20, 72);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "13px sans-serif";
  ctx.fillText("W/↑ — thrust   A/← D/→ — rotate", 10, height - 16);
  ctx.restore();
}
