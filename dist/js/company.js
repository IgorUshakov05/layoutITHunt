let url = new URL(window.location.href);
const link_url = document.getElementById("send");

const changeURL = (name, value) => {
  if (
    value === null ||
    value === undefined ||
    value === 0 ||
    value == "[]" ||
    value == []
  ) {
    console.log(dataSearch);

    url.searchParams.delete(name);
    link_url.search = url.search;
    return;
  }
  url.searchParams.delete(name);
  url.searchParams.append(name, value);
  link_url.search = url.search;
};
let dataSearch = {
  find: url.searchParams.get("find") || "Вакансии",
  special: JSON.parse(url.searchParams.get("special")) || [],
  skills: JSON.parse(url.searchParams.get("skills")) || [],
  price: {
    minPrice: url.searchParams.get("price_min") || 0,
    maxPrice: url.searchParams.get("price_max") || 0,
  },
};
const input_max = document.getElementById("max");
const input_min = document.getElementById("min");
const input_skill = document.getElementById("skillInput");
const listFindSkills = document.querySelector(".listFindSkills");
const listFindSelected = document.querySelector(".listAddadSkills");
const removeSpecial = (title) => {
  dataSearch.special = dataSearch.special.filter((item) => item != title);
  document.querySelector(".forRemove[data-title=" + title + "]").remove();
  if (dataSearch.special.length <= 0) {
    selectedSpecialList.style.display = "none";
  }
  changeURL("special", JSON.stringify(dataSearch.special));
};

input_skill.addEventListener("input", async function (e) {
  let searchValue = e.target.value.trim();
  listFindSkills.innerHTML = "";
  if (searchValue.length <= 0) {
    listFindSkills.style.display = "none";

    return;
  }

  clearTimeout(this.timeoutId);

  this.timeoutId = setTimeout(async () => {
    // Создание нового таймера
    let response = await fetch(`/api/setSkills?title=${searchValue}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "augwod89h1h9awdh9py0y82hjd",
      },
    });
    let result = await response.json();
    if (result.items?.length > 0) {
      listFindSkills.style.display = "block";
    }

    result.items.forEach((item) => {
      let appendChild = `  <li class="optionsSelectSpecItem">
                    <p class="titleSearch">${item.text}</p>
                    <p class="selectSearch selectSKill" data-title="${item.text}">
                      Выбрать
                    </p>
                  </li>`;
      listFindSkills.insertAdjacentHTML("afterbegin", appendChild);
      let selectSkillElement = listFindSkills.querySelector(
        `[data-title="${item.text}"]`
      );

      selectSkillElement.addEventListener("click", function () {
        let selectedTitle = selectSkillElement.getAttribute("data-title");
        if (dataSearch.skills.includes(selectedTitle)) return;
        listFindSkills.innerHTML = "";
        listFindSkills.style.display = "none";
        input_skill.value = "";
        let appendElem = document.createElement("div");
        appendElem.classList.add("skill");
        appendElem.setAttribute("data-title", selectedTitle);
        appendElem.innerHTML = `
  <p class="titleSkill">${selectedTitle}</p>
  <div class="removeSpecial removeSkill" data-title="${selectedTitle}">
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L16 16" stroke="white" stroke-linecap="round" />
      <path d="M16 1L8.5 8.5L1 16" stroke="white" stroke-linecap="round" />
    </svg>
  </div>
`;
        appendElem.addEventListener("click", function () {
          dataSearch.skills = dataSearch.skills.filter(
            (skill) => skill != this.getAttribute("data-title")
          );
          this.remove();
          changeURL("skills", JSON.stringify(dataSearch.skills));
        });
        listFindSelected.appendChild(appendElem);
        dataSearch.skills.push(selectedTitle);
        dataSearch.skills = [...new Set(dataSearch.skills)];
        changeURL("skills", JSON.stringify(dataSearch.skills));
      });
    });
  }, 500);
});
const Load = () => {
  // Специалисты
  link_url.setAttribute("href", url.search);
  if (dataSearch.special.length > 0) {
    selectedSpecialList.style.display = "flex";
    dataSearch.special.forEach((item) => {
      let appendItem = `<div class="selectedSpecial forRemove" onClick="removeSpecial('${item}')" data-title="${item}">
                    <p>${item}</p>
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
  }

  // Навыки
  if (dataSearch.skills.length > 0) {
    dataSearch.skills.forEach((item) => {
      let appendElem = document.createElement("div");
      appendElem.classList.add("skill");
      appendElem.setAttribute("data-title", item);
      appendElem.innerHTML = `
  <p class="titleSkill">${item}</p>
  <div class="removeSpecial removeSkill" data-title="${item}">
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L16 16" stroke="white" stroke-linecap="round" />
      <path d="M16 1L8.5 8.5L1 16" stroke="white" stroke-linecap="round" />
    </svg>
  </div>
`;
      appendElem.addEventListener("click", function () {
        dataSearch.skills = dataSearch.skills.filter(
          (skill) => skill != this.getAttribute("data-title")
        );
        this.remove();
        changeURL("skills", JSON.stringify(dataSearch.skills));
      });
      listFindSelected.appendChild(appendElem);
    });
  }

  // Вакансии || Фаст-Ворк
  if (dataSearch.find.length > 0) {
    document.querySelector(`input[value="${dataSearch.find}"]`).checked = true;
  }
  // Зарплата
  if (dataSearch.price.minPrice || dataSearch.price.maxPrice) {
    input_max.value = dataSearch.price.maxPrice || "";
    input_min.value = dataSearch.price.minPrice || "";
  }

  const vacancyList = document.querySelectorAll(".Infavorites");
  vacancyList.forEach(function (item) {
    item.addEventListener("click", async function () {
      const url = "/api/favorite-vacancy";
      const clickedValue = item.getAttribute("data-id");

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

        console.log(data);
        console.log(item);
        if (data.result) {
          makeInFuture(item);
        } else {
          removeFuture(item);
        }
      } catch (error) {
        console.error("Ошибка:", error);
      } finally {
        setTimeout(() => setButtonState(true), 1000);
      }
    });
  });
};
const input_special = document.getElementById("special");

Load();
input_max.addEventListener("input", function (e) {
  dataSearch.price.maxPrice = parseInt(e.target.value) || 0;
  changeURL("price_max", dataSearch.price.maxPrice);
});

const selectWork = (title) => {
  dataSearch.find = title;
  changeURL("find", dataSearch.find);
};

input_min.addEventListener("input", function (e) {
  dataSearch.price.minPrice = parseInt(e.target.value) || 0;
  changeURL("price_min", dataSearch.price.minPrice);
});
input_special.addEventListener("input", function (e) {
  let searchValue = e.target.value;
  if (!searchValue || searchValue.length <= 1) {
    document.querySelector(".specialList").style.display = "none";
    return;
  }
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

document.querySelectorAll(".specialItem").forEach((item) => {
  item.addEventListener("click", function (e) {
    input_special.value = "";
    if (dataSearch.special.includes(item.getAttribute("data-title")))
      return false;
    dataSearch.special.push(item.getAttribute("data-title"));
    document.querySelector(".specialList").style.display = "none";
    selectedSpecialList.style.display = "flex";
    let appendItem = `<div class="selectedSpecial forRemove" onClick="removeSpecial('${item.getAttribute(
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
    changeURL("special", JSON.stringify(dataSearch.special));
  });
});
