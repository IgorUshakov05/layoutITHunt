let dataSearch = {
  special: [],
  typeWork: [],
  skills: [],
  city: [],
  experience: "",
  price: {
    minPrice: 0,
    maxPrice: 0,
  },
};
const listSearchCity = document.getElementById("ListSearchCity");
const input_special = document.getElementById("special");
const input_city = document.getElementById("searchCity");

const selectedCity = document.getElementById("selectedCity");
const selectedSpecialList = document.getElementById("selectedSpecialList");
input_special.addEventListener("input", function (e) {
  let searchValue = e.target.value;
  if (!searchValue) return;
  document.querySelector(".specialList").style.display = "";
  const allItems = document.querySelectorAll(".optionsSelectSpecItem");
  if (allItems.length <= 0) {
    document.querySelector(".specialList").style.display = "none";
    return;
  }
  const regex = new RegExp(searchValue, "i");
  for (const item of allItems) {
    let dataTitle = item.getAttribute("data-title");
    if (regex.test(dataTitle)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  }
});
const removeSpecial = (title) => {
  dataSearch.special = dataSearch.special.filter((item) => item != title);
  document.querySelector(".forRemove[data-title=" + title + "]").remove();
  if (dataSearch.special.length <= 0) {
    selectedSpecialList.style.display = "none";
  }
};
function renderCityList(cities) {
  // Очищаем старый список
  listSearchCity.innerHTML = "";

  // Если массив пустой, показываем сообщение
  if (cities.length === 0) {
    listSearchCity.innerHTML = `
      <li class="optionsSelectSpecItem">
        <p class="titleSearch">Города не найдены</p>
      </li>
    `;
    return;
  }

  listSearchCity.style.display = "block";

  cities.forEach((city) => {
    // Разделяем строку и получаем последний элемент
    city = city.split(",").reverse()[0];

    const li = document.createElement("li");
    li.classList.add("optionsSelectSpecItem");
    li.innerHTML = `
      <p class="titleSearch">${city}</p>
      <p class="selectSearch" data-title="${city}">Выбрать</p>
    `;

    // Добавляем обработчик клика на элемент "Выбрать"
    li.querySelector(".selectSearch").addEventListener("click", () => {
      // Добавляем город в массив и очищаем поле ввода
      dataSearch.city.push(city);
      input_city.value = "";
      listSearchCity.style.display = "none";
      listSearchCity.innerHTML = "";

      // Убираем повторы в массиве городов
      dataSearch.city = [...new Set(dataSearch.city)];

      // Отображаем выбранный город в списке
      let appendItem = `
        <div class="selectedSpecial selectedCity">
          <p id="title">${city}</p>
          <div id="removeSpecial" data-title="${city}" class="removeSpecial removeCity">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L16 16" stroke="white" stroke-linecap="round" />
              <path d="M16 1L8.5 8.5L1 16" stroke="white" stroke-linecap="round" />
            </svg>
          </div>
        </div>
      `;
      selectedCity.style.display = "flex";
      selectedCity.insertAdjacentHTML("afterbegin", appendItem);

      // Добавляем обработчик клика для удаления выбранного города
      const removeButton = document.querySelector(
        `.removeCity[data-title="${city}"]`
      );
      removeButton.addEventListener("click", () => {
        // Удаляем город из массива
        dataSearch.city = dataSearch.city.filter((item) => item !== city);

        // Удаляем элемент из DOM
        removeButton.closest(".selectedCity").remove();

        // Если массив пуст, скрываем блок с выбранными городами
        if (dataSearch.city.length === 0) {
          selectedCity.style.display = "none";
        }
      });
    });

    listSearchCity.appendChild(li);
  });
}

document.querySelectorAll(".specialItem").forEach((item) => {
  item.addEventListener("click", function (e) {
    input_special.value = "";
    if (dataSearch.special.includes(item.getAttribute("data-title")))
      return false;
    dataSearch.special.push(item.getAttribute("data-title"));
    document.querySelector(".specialList").style.display = "none";
    selectedSpecialList.style.display = "flex";
    let appendItem = `    <div class="selectedSpecial forRemove" onClick="removeSpecial('${item.getAttribute(
      "data-title"
    )}')" data-title="${item.getAttribute("data-title")}">
                    <p>${item.getAttribute("data-title")}</p>
                    <div class="removeSpecial">
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1L16 16"
                          stroke="white"
                          stroke-linecap="round"
                        />
                        <path
                          d="M16 1L8.5 8.5L1 16"
                          stroke="white"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                  </div>`;
    selectedSpecialList.insertAdjacentHTML("afterbegin", appendItem);
  });
});
document.querySelectorAll("input[name='workWay']").forEach((item) => {
  item.addEventListener("click", function (e) {
    if (e.target.checked) {
      dataSearch.typeWork.push(e.target.value);
    } else {
      dataSearch.typeWork = dataSearch.typeWork.filter(
        (elem) => elem != e.target.value
      );
    }
  });
});
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

input_city.addEventListener(
  "input",
  debounce(async function (e) {
    let city = e.target.value.trim();
    if (!city || city.length <= 3) return; // Пропуск пустого ввода
    try {
      let response = await fetch("/api/areas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "augwod89h1h9awdh9py0y82hjd",
        },
        body: JSON.stringify({ city }),
      });

      if (!response.ok) {
        console.error("Ошибка:", await response.json());
        return;
      }

      let data = await response.json();
      console.log(data);
      renderCityList(data.path);
    } catch (error) {
      console.error("Ошибка сети:", error);
    }
  }, 500) // Задержка 500 мс
);
