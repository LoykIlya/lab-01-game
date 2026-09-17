/**
 * Обробка клавіатури через замикання (closure).
 *
 * Замикання — це коли функція "пам'ятає" змінні з місця, де її створили.
 * Тут `down` і `pressed` — приватні: ззовні до них не дістатися,
 * але повернуті функції isDown / justPressed мають до них доступ.
 */
export function createInput(target) {
  const down = new Set();
  const pressed = new Set();

  target.addEventListener("keydown", (e) => {
    // Не повторювати, якщо клавіша вже затиснута (keydown "авторепіт")
    if (!down.has(e.code)) {
      pressed.add(e.code);
    }
    down.add(e.code);
    // Запобігаємо прокрутці стрілками
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
      e.preventDefault();
    }
  });

  target.addEventListener("keyup", (e) => {
    down.delete(e.code);
  });

  // Втрата фокусу — скидаємо всі клавіші
  window.addEventListener("blur", () => {
    down.clear();
    pressed.clear();
  });

  return {
    /** Чи затиснута клавіша зараз? (тримаємо W — завжди true) */
    isDown: (code) => down.has(code),

    /** Чи натиснули клавішу саме в цьому кадрі? (один раз на натиск) */
    justPressed: (code) => pressed.has(code),

    /** Викликати наприкінці кожного кроку симуляції */
    endFrame: () => pressed.clear(),
  };
}
