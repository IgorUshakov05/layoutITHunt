// Универсальная функция для обработки кликов
$(document).on(
  "click",
  ".InfavoritesFastWork, .InfavoritesVacancy",
  async function () {
    // Определяем класс элемента и соответствующий URL
    const isFastWork = $(this).hasClass("InfavoritesFastWork");
    const url = isFastWork ? "/api/favorite-fastWork" : "/api/favorite-vacancy";

    // Получаем значение data-id текущего элемента
    const clickedValue = $(this).attr("data-id");

    // Отключаем кнопки
    setButtonState(false);

    try {
      // Выполняем запрос к серверу
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "augwod89h1h9awdh9py0y82hjd",
        },
        body: JSON.stringify({
          vacancyId: clickedValue,
        }),
      });

      const data = await response.json();

      // Находим все элементы с соответствующим классом
      const targetClass = isFastWork
        ? ".InfavoritesFastWork"
        : ".InfavoritesVacancy";

      $(targetClass).each(function () {
        const dataId = $(this).attr("data-id");
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
  }
);

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
  $(".InfavoritesFastWork, .InfavoritesVacancy").prop("disabled", !enabled);
};
