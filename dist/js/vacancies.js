let url = new URL(window.location.href);
let dataSearch = {
  special: JSON.parse(url.searchParams.get("special")) || [],
  typeWork: JSON.parse(url.searchParams.get("typeWork")) || [],
  skills: JSON.parse(url.searchParams.get("skills")) || [],
  city: JSON.parse(url.searchParams.get("city")) || [],
  experience: JSON.parse(url.searchParams.get("experience")) || [],
  price: {
    minPrice: url.searchParams.get("price_min") || 0,
    maxPrice: url.searchParams.get("price_max") || 0,
  },
};

let limitVacancy = 4;
const step = 2;
let isStop = false;
let getVacancyByLimit = async () => {
  try {
    if (isStop) {
      isStop = true;
      return { success: false };
    }
    let vacancy = await fetch(`/api/vacancies?limit=${limitVacancy}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "augwod89h1h9awdh9py0y82hjd",
      },
      body: JSON.stringify(dataSearch),
    }).then((obj) => obj.json());
    console.log(vacancy);
    limitVacancy += step;
    if (!vacancy.success) {
      isStop = true;
      return { success: false, message: "Ошибка при получении" };
    }
    if (vacancy.vacancies.length <= 0) {
      isStop = true;
      return { success: false, message: "Больше вакансий нет!" };
    }
    return { ...vacancy };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Ошибка при получении" };
  }
};
const link_url = document.getElementById("send");

const listSearchCity = document.getElementById("ListSearchCity");
const input_special = document.getElementById("special");
const input_city = document.getElementById("searchCity");
const input_skill = document.getElementById("skillInput");
const input_max = document.getElementById("max");
const input_min = document.getElementById("min");
const listFindSkills = document.querySelector(".listFindSkills");
const listFindSelected = document.querySelector(".listAddadSkills");
const selectedCity = document.getElementById("selectedCity");
const selectedSpecialList = document.getElementById("selectedSpecialList");
document.addEventListener("DOMContentLoaded", () => {
  let lastElement = document.querySelectorAll('[data-last="true"]');
  lastElement = lastElement[lastElement.length - 1];
  if (lastElement) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach(async (entry) => {
          console.log(entry);
          if (entry.isIntersecting) {
            let data = await getVacancyByLimit(limitVacancy);
            console.log(data);
            if (!data.success) return false;
            insertVacansy(data);
            console.log(data);
            observerInstance.unobserve(lastElement);
            lastElement = document.querySelectorAll('[data-last="true"]');
            lastElement = lastElement[lastElement.length - 1];
            observer.observe(lastElement);
          }
        });
      },
      {
        root: null, // Отслеживание относительно viewport
        rootMargin: "100px", // Без отступов
        threshold: 1.0, // Полностью в области видимости
      }
    );

    // Добавляем наблюдение за последним элементом
    observer.observe(lastElement);
  }
});
const insertVacansy = (vacancyList) => {
  vacancyList.vacancies.forEach((vacancy, index) => {
    const userItem = vacancyList.users.find(
      (user) => user.id === vacancy.userID
    );
    console.log(userItem);
    console.log(vacancyList.company);
    const companyItem = vacancyList.company.find((item) =>
      item.userList.some((userListItem) => userListItem.userID === userItem.id)
    );
    console.log(companyItem);

    const article = document.createElement("article");
    article.setAttribute(
      "data-last",
      index === vacancyList.vacancies.length - 1 ? "true" : "false"
    );
    article.className = "vakansiaItem";

    const topInfo = document.createElement("div");
    topInfo.className = "topInfoPriceAndTitle";

    const titleAndTypeJob = document.createElement("div");
    titleAndTypeJob.className = "titleAndTypeJob";

    const title = document.createElement("h2");
    const titleLink = document.createElement("a");
    titleLink.href = `/vacancia/${vacancy.id}`;
    titleLink.className = "titleJob";
    titleLink.textContent = vacancy.special;
    title.appendChild(titleLink);
    titleAndTypeJob.appendChild(title);

    const jobType = document.createElement("h4");
    jobType.style.marginTop = "5px";
    jobType.style.display = "flex";
    jobType.style.alignItems = "center";

    const svgIcon = document.createElement("svg");
    svgIcon.className = "methodJob";
    svgIcon.setAttribute("width", "14");
    svgIcon.setAttribute("height", "19");
    svgIcon.innerHTML = `
      <path fill-rule="evenodd" clip-rule="evenodd" d="M7 0C10.866 0 14 2.87926 14 6.43125C14 12.2311 7 18.375 7 18.375C7 18.375 0 12.2827 0 6.43125C0 2.87926 3.134 0 7 0Z" fill="#5412E0" />
      <path d="M7 10.5C8.933 10.5 10.5 8.93303 10.5 7.00003C10.5 5.06703 8.933 3.50003 7 3.50003C5.067 3.50003 3.5 5.06703 3.5 7.00003C3.5 8.93303 5.067 10.5 7 10.5Z" fill="white" />
    `;
    jobType.appendChild(svgIcon);

    const methodJob = document.createElement("span");
    methodJob.className = "methodJob";
    methodJob.style.marginLeft = "5px";
    methodJob.textContent = vacancy.typeWork
      .map((type) => type.title)
      .join(", ");
    jobType.appendChild(methodJob);
    titleAndTypeJob.appendChild(jobType);

    topInfo.appendChild(titleAndTypeJob);

    const priceJob = document.createElement("div");
    priceJob.className = "priceJob";

    const price = document.createElement("h3");
    if (vacancy.price.agreement) {
      price.textContent = "Договорная";
    } else if (vacancy.price.maxPrice) {
      price.innerHTML = `до ${vacancy.price.maxPrice.toLocaleString(
        "no-NO"
      )} Ꝑ`;
    } else if (vacancy.price.minPrice) {
      price.innerHTML = `от ${vacancy.price.minPrice.toLocaleString(
        "no-NO"
      )} Ꝑ`;
    }
    priceJob.appendChild(price);
    topInfo.appendChild(priceJob);

    article.appendChild(topInfo);

    if (vacancy.description?.length) {
      const middleInfo = document.createElement("div");
      middleInfo.className = "middleInfoVacansya";

      const description = document.createElement("p");
      description.className = "descriptionVacansyText";
      description.textContent = vacancy.description;

      const showFull = document.createElement("div");
      showFull.className = "showFull";
      showFull.innerHTML =
        '<span class="showFullText">Показать полностью</span>';

      middleInfo.appendChild(description);
      middleInfo.appendChild(showFull);
      article.appendChild(middleInfo);
    }

    if (vacancy.skills?.length) {
      const stack = document.createElement("div");
      stack.className = "stackForJob";

      const list = document.createElement("ul");
      list.className = "listStacks";

      vacancy.skills.forEach((skill) => {
        const skillItem = document.createElement("li");
        skillItem.className = "abilityItem";

        const skillTitle = document.createElement("h5");
        skillTitle.className = "ability";
        skillTitle.textContent = skill.title;

        skillItem.appendChild(skillTitle);
        list.appendChild(skillItem);
      });

      stack.appendChild(list);
      article.appendChild(stack);
    }

    const bottomInfo = document.createElement("div");
    bottomInfo.className = "bottomInfo";

    const link = document.createElement("a");
    link.href = companyItem
      ? `/company/${companyItem.INN}`
      : `/${userItem.id}`;

    const companyInfo = document.createElement("div");
    companyInfo.className = "companyInfo";

    const imgDiv = document.createElement("div");
    imgDiv.className = "img";

    const img = document.createElement("img");
    img.width = 40;
    img.height = 40;
    img.alt = "Логотип компании";
    img.src = companyItem
      ? companyItem.avatar
      : userItem.avatar || "/assets/pictures/ДефолтРаботодатель.jpg";

    imgDiv.appendChild(img);
    companyInfo.appendChild(imgDiv);

    const titleCompanyAndDate = document.createElement("div");
    titleCompanyAndDate.className = "titleCompanyAndDate";

    const companyName = document.createElement("span");
    companyName.className = "styleTitleCompany";
    companyName.textContent = companyItem
      ? companyItem.title
      : `${userItem.name} ${userItem.surname}`;

    titleCompanyAndDate.appendChild(companyName);

    const timeCompany = document.createElement("span");
    timeCompany.className = "styleTimeCompany";
    timeCompany.textContent = "35 часов назад";

    titleCompanyAndDate.appendChild(timeCompany);
    companyInfo.appendChild(titleCompanyAndDate);
    link.appendChild(companyInfo);
    bottomInfo.appendChild(link);

    const buttons = document.createElement("div");
    buttons.className = "buttonsElements";

    const favoriteButton = document.createElement("button");
    favoriteButton.className = `Infavorites ${
      vacancyList.favorites.some((item) => item.id === vacancy.id)
        ? "addingFavorite"
        : ""
    }`;
    favoriteButton.textContent = "В избранное";

    const respondButton = document.createElement("button");
    respondButton.className = "Respond";

    const respondLink = document.createElement("a");
    respondLink.href = `/vacancia/${vacancy.id}`;
    respondLink.textContent = "Откликнуться";

    respondButton.appendChild(respondLink);
    buttons.appendChild(favoriteButton);
    buttons.appendChild(respondButton);
    bottomInfo.appendChild(buttons);

    article.appendChild(bottomInfo);
    document.querySelector(".listVacas").appendChild(article);
  });
};

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

  // Способ работы

  if (dataSearch.typeWork.length > 0) {
    document
      .querySelectorAll("input[name='workWay']")
      .forEach((item) =>
        dataSearch.typeWork.includes(item.value) ? (item.checked = true) : false
      );
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

  // Город
  if (dataSearch.city.length > 0) {
    dataSearch.city.forEach((city) => {
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
        changeURL("city", JSON.stringify(dataSearch.city));

        removeButton.closest(".selectedCity").remove();

        // Если массив пуст, скрываем блок с выбранными городами
        if (dataSearch.city.length === 0) {
          selectedCity.style.display = "none";
        }
      });
    });
  }
  // Опыт работы
  if (dataSearch.experience.length) {
    document
      .querySelectorAll("input[name='exp']")
      .forEach((item) =>
        dataSearch.experience.includes(item.value)
          ? (item.checked = true)
          : false
      );
  }
  // Зарплата
  if (dataSearch.price.minPrice || dataSearch.price.maxPrice) {
    input_max.value = dataSearch.price.maxPrice || "";
    input_min.value = dataSearch.price.minPrice || "";
  }
};
Load();
const changeURL = (name, value) => {
  console.log("Уладение", value);

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
input_max.addEventListener("input", function (e) {
  dataSearch.price.maxPrice = parseInt(e.target.value) || 0;
  changeURL("price_max", dataSearch.price.maxPrice);
});
input_min.addEventListener("input", function (e) {
  dataSearch.price.minPrice = parseInt(e.target.value) || 0;
  changeURL("price_min", dataSearch.price.minPrice);
});
function selectTime(e) {
  if (!dataSearch.experience.includes(e.value)) {
    dataSearch.experience.push(e.value);
    dataSearch.experience = [...new Set(dataSearch.experience)];
  } else {
    dataSearch.experience = dataSearch.experience.filter(
      (item) => item != e.value
    );
  }
  changeURL("experience", JSON.stringify(dataSearch.experience));
}

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

const removeSpecial = (title) => {
  dataSearch.special = dataSearch.special.filter((item) => item != title);
  document.querySelector(".forRemove[data-title=" + title + "]").remove();
  if (dataSearch.special.length <= 0) {
    selectedSpecialList.style.display = "none";
  }
  changeURL("special", JSON.stringify(dataSearch.special));
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
      changeURL("city", JSON.stringify(dataSearch.city));

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
        changeURL("city", JSON.stringify(dataSearch.city));

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
document.querySelectorAll("input[name='workWay']").forEach((item) => {
  item.addEventListener("click", function (e) {
    if (e.target.checked) {
      dataSearch.typeWork.push(e.target.value);
    } else {
      dataSearch.typeWork = dataSearch.typeWork.filter(
        (elem) => elem != e.target.value
      );
    }
    changeURL("typeWork", JSON.stringify(dataSearch.typeWork));
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
      renderCityList(data.path);
    } catch (error) {
      console.error("Ошибка сети:", error);
    }
  }, 500) // Задержка 500 мс
);
