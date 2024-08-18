const addToFavorites = document.getElementById("addToFavorites");

function makeInFuture() {
  addToFavorites.className = "Infavorites addingFavorite";
}

function removeFuture() {
  addToFavorites.className = "Infavorites";
}

$(".titleCompanyAndPhoto").on("click", () => {
  $(".descriptionCompanyInVacansy").toggle();
});

const setButtonState = (enabled) => {
  addToFavorites.disabled = !enabled;
};

// Обработчик клика на кнопку
addToFavorites.addEventListener("click", async () => {
  setButtonState(false);
  try {
    let value = window.location.pathname.split("/").pop();
    let response = await fetch("/api/favorite-vacancy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "augwod89h1h9awdh9py0y82hjd",
      },
      body: JSON.stringify({
        vacancyId: value,
      }),
    });

    let data = await response.json();

    if (!data.result) {
      removeFuture();
    } else {
      makeInFuture();
    }
  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    setTimeout(() => setButtonState(true), 3000);
  }
});
