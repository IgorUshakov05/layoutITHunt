$(document).on("click", ".InfavoritesVacancy", async function () {
  // Получаем значение data-id текущего элемента
  let clickedValue = $(this).attr("data-id");

  // Отключаем кнопки (если необходимо)
  setButtonState(false);

  try {
    // Выполняем запрос к серверу
    let response = await fetch("/api/favorite-vacancy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "augwod89h1h9awdh9py0y82hjd",
      },
      body: JSON.stringify({
        vacancyId: clickedValue,
      }),
    });

    let data = await response.json();

    // Находим все элементы с классом .InfavoritesVacancy
    $(".InfavoritesVacancy").each(function () {
      let dataId = $(this).attr("data-id");
      if (dataId === clickedValue) {
        if (data.result) {
          makeInFuture(this);
        } else {
          removeFuture(this);
        }
      }
    });
  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    setTimeout(() => setButtonState(true), 1000);
  }
});

// Функция для добавления класса
function makeInFuture(element) {
  $(element).addClass("addingFavorite");
}

// Функция для удаления класса
function removeFuture(element) {
  $(element).removeClass("addingFavorite");
}

// Функция для управления состоянием кнопок
const setButtonState = (enabled) => {
  $(".InfavoritesVacancy").prop("disabled", !enabled);
};
