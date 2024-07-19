let button = document.getElementById('inFavorite');
let isCooldown = false;

button.addEventListener('click', () => {
  if (isCooldown) return; // Если кнопка на cooldown'е, выходим из функции

  fetch("/api/favorite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "augwod89h1h9awdh9py0y82hjd",
    },
  })
  .then((obj) => obj.json())
  .then((obj) => {
    if (obj.result) {
      button.children[0].children[0].setAttribute('fill', 'yellow');
    } else {
      button.children[0].children[0].setAttribute('fill', '#D9D9D9');
    }
  });

  // Устанавливаем cooldown
  isCooldown = true;
  button.disabled = true;

  // Снимаем cooldown через 2 секунды
  setTimeout(() => {
    isCooldown = false;
    button.disabled = false;
  }, 2000);
});
