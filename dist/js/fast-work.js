let url = new URL(window.location.href);
let dataSearch = {
  special: JSON.parse(url.searchParams.get("special")) || [],
  hard: JSON.parse(url.searchParams.get("hard")) || 0,
  skills: JSON.parse(url.searchParams.get("skills")) || [],
  price: {
    minPrice: url.searchParams.get("price_min") || 0,
    maxPrice: url.searchParams.get("price_max") || 0,
  },
};
const link_url = document.getElementById("send");
function getTimeDifference(dateString, serverDateTimeString) {
  const createdDate = new Date(dateString);
  const currentDate = new Date(serverDateTimeString);
  console.log(createdDate.toString(), serverDateTimeString);
  const diffInMs = currentDate - createdDate;

  const diffInSeconds = Math.floor(diffInMs / 1000);
  if (diffInSeconds < 60) {
    return `${diffInSeconds} с.`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} мин.`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ч.`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} д.`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} мес`;
}
function makeInFuture(element) {
  element.className = "Infavorites addingFavorite";
}

function removeFuture(element) {
  element.className = "Infavorites";
}

const setButtonState = (enabled) => {
  const buttons = document.querySelectorAll(
    ".InfavoritesFastWork, .InfavoritesVacancy"
  );
  buttons.forEach((button) => {
    button.disabled = !enabled;
  });
};
const input_special = document.getElementById("special");
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
            insertFastWorks(data);
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
const insertFastWorks = (FastWorkList) => {
  FastWorkList.fastWorks.forEach((fastWork, index) => {
    const userItem = FastWorkList.users.find(
      (user) => user.id === fastWork.userID
    );
    const companyItem = FastWorkList.company.find((item) =>
      item.userList.some((userListItem) => userListItem.userID === userItem.id)
    );
    let isPremium = FastWorkList.premium.some(
      (premium) => userItem.id === premium
    );

    console.log(`Premium ${isPremium} for ${userItem.name}`);

    // Создание контейнера для каждой вакансии
    const article = document.createElement("article");
    article.classList.add("vakansiaItem");
    article.setAttribute(
      "data-last",
      index === FastWorkList.fastWorks.length - 1 ? "true" : ""
    );

    // Добавление информации о вакансии
    const topInfo = document.createElement("div");
    topInfo.classList.add("topInfoPriceAndTitle");

    // Добавление заголовка и типа работы
    const titleAndTypeJob = document.createElement("div");
    titleAndTypeJob.classList.add("titleAndTypeJob");

    const h2 = document.createElement("h2");
    h2.classList.add("h2Mob");

    const specialSpan = document.createElement("span");
    const specialLink = document.createElement("a");
    specialLink.href = `/fast-work/${fastWork.id}`;
    specialLink.classList.add("titleJob");
    specialLink.innerText = fastWork.special;
    specialSpan.appendChild(specialLink);

    const hardSpan = document.createElement("span");
    hardSpan.classList.add("hardOrNo");
    hardSpan.style.color =
      fastWork.level <= 2
        ? "#A4A4A4"
        : fastWork.level <= 4
        ? "#000000"
        : "#4900E3";
    hardSpan.innerText = fastWork.level;

    h2.appendChild(specialSpan);
    h2.appendChild(hardSpan);
    titleAndTypeJob.appendChild(h2);

    topInfo.appendChild(titleAndTypeJob);

    // Добавление цены
    const priceJob = document.createElement("div");
    priceJob.classList.add("priceJob", "priceJobFastJob");

    const priceH3 = document.createElement("h3");
    priceH3.classList.add("rightPlace");

    if (fastWork.price.agreement) {
      const priceSpan = document.createElement("span");
      priceSpan.innerText = "Договорная";
      priceH3.appendChild(priceSpan);
    } else {
      if (fastWork.price.maxPrice) {
        const priceSpan = document.createElement("span");
        priceSpan.classList.add("priceItem");
        priceSpan.innerText = `до ${fastWork.price.maxPrice.toLocaleString(
          "no-NO"
        )}`;
        priceH3.appendChild(priceSpan);
        const pSpan = document.createElement("span");
        pSpan.classList.add("p");
        pSpan.innerText = "Ꝑ";
        priceH3.appendChild(pSpan);
      } else if (fastWork.price.minPrice) {
        const priceSpan = document.createElement("span");
        priceSpan.classList.add("priceItem");
        priceSpan.innerText = `от ${fastWork.price.minPrice.toLocaleString(
          "no-NO"
        )}`;
        priceH3.appendChild(priceSpan);
        const pSpan = document.createElement("span");
        pSpan.classList.add("p");
        pSpan.innerText = "Ꝑ";
        priceH3.appendChild(pSpan);
      }
    }

    priceJob.appendChild(priceH3);

    // Добавление срока выполнения
    const termOfTheWork = document.createElement("div");
    termOfTheWork.classList.add("termOfTheWork");

    const termNumber = document.createElement("span");
    termNumber.classList.add("termOfTheWorkNumber");
    termNumber.innerText = "1";

    const termText = document.createElement("span");
    termText.classList.add("termOfTheWorkNumber");
    if (1 === 1) {
      termText.innerText = "месяц";
    } else if (1 <= 4 && 1 > 1) {
      termText.innerText = "месяца";
    } else {
      termText.innerText = "месяцев";
    }

    termOfTheWork.appendChild(termNumber);
    termOfTheWork.appendChild(termText);
    priceJob.appendChild(termOfTheWork);

    topInfo.appendChild(priceJob);

    article.appendChild(topInfo);

    // Добавление навыков
    if (fastWork.skills) {
      const stackForJob = document.createElement("div");
      stackForJob.classList.add("stackForJob");

      const listStacks = document.createElement("ul");
      listStacks.classList.add("listStacks");

      fastWork.skills.forEach((skill) => {
        const abilityItem = document.createElement("li");
        abilityItem.classList.add("abilityItem");

        const abilityTitle = document.createElement("h5");
        abilityTitle.classList.add("ability");
        abilityTitle.innerText = skill.title;

        abilityItem.appendChild(abilityTitle);
        listStacks.appendChild(abilityItem);
      });

      stackForJob.appendChild(listStacks);
      article.appendChild(stackForJob);
    }

    // Добавление описания
    if (fastWork.description.length) {
      const middleInfoVacansya = document.createElement("div");
      middleInfoVacansya.classList.add("middleInfoVacansya", "d-blockFastWork");

      const descriptionVacansy = document.createElement("div");
      descriptionVacansy.classList.add("descriptionVacansy");

      if (fastWork.description?.length) {
      const middleInfo = document.createElement("div");
      middleInfo.className = "middleInfoVacansya";

      const description = document.createElement("pre");
      description.className = "descriptionVacansyText";
      description.innerHTML = fastWork.description;

      // Создаем основной контейнер div с классом "showFull"
      const showFull = document.createElement("div");
      showFull.className = "showFull";
      showFull.addEventListener("click", function (e) {
        let isShow = this.previousElementSibling.classList.contains("fullText");
        console.log(isShow);
        if (isShow) {
          this.previousElementSibling.classList.remove("fullText");
          this.children[0].innerText = "Показать полностью";
        } else {
          this.children[0].innerText = "Скрыть";
          this.previousElementSibling.classList.add("fullText");
        }
      });
      // Создаем span с классом "showFullText" и добавляем текст
      const showFullText = document.createElement("span");
      showFullText.className = "showFullText";
      showFullText.textContent = "Показать полностью";

      // Вставляем span внутрь div
      showFull.appendChild(showFullText);
      middleInfo.appendChild(description);
      middleInfo.appendChild(showFull);
      article.appendChild(middleInfo);
    }

    // Добавление нижней информации
    const bottomInfo = document.createElement("div");
    bottomInfo.classList.add("bottomInfo");

    const companyLink = document.createElement("a");
    companyLink.href = companyItem
      ? `/company/${companyItem.INN}`
      : `/user/${userItem.id}`;

    const companyInfo = document.createElement("div");
    companyInfo.classList.add("companyInfo");

    const imgDiv = document.createElement("div");
    imgDiv.classList.add("img");

    const img = document.createElement("img");
    img.width = 40;
    img.height = 40;
    img.alt = "Логотип компании";

    img.src = companyItem
      ? companyItem.avatar
      : userItem.avatar
      ? userItem.avatar
      : isPremium
      ? "/assets/pictures/ПремиумРаботодатель.jpg"
      : "/assets/pictures/ДефолтРаботодатель.jpg";

    imgDiv.appendChild(img);

    const titleCompanyAndDate = document.createElement("div");
    titleCompanyAndDate.classList.add("titleCompanyAndDate");

    const titleCompany = document.createElement("div");
    titleCompany.classList.add("titleCompany");

    const companyTitleSpan = document.createElement("span");
    companyTitleSpan.classList.add("styleTitleCompany");
    companyTitleSpan.innerText = companyItem
      ? companyItem.title
      : `${userItem.name} ${userItem.surname}`;

    titleCompany.appendChild(companyTitleSpan);
    titleCompanyAndDate.appendChild(titleCompany);

    const timeCompany = document.createElement("div");
    timeCompany.classList.add("titleCompany");

    const timeSpan = document.createElement("span");
    timeSpan.classList.add("styleTimeCompany");
    timeSpan.innerText = `${getTimeDifference(
      fastWork.dataCreated,
      FastWorkList.dateTimeServer
    )} назад`;

    timeCompany.appendChild(timeSpan);
    titleCompanyAndDate.appendChild(timeCompany);

    companyInfo.appendChild(imgDiv);
    companyInfo.appendChild(titleCompanyAndDate);
    companyLink.appendChild(companyInfo);

    bottomInfo.appendChild(companyLink);

    // Кнопки
    const buttonsElements = document.createElement("div");
    buttonsElements.classList.add("buttonsElements");

    const favoriteButton = document.createElement("button");
    favoriteButton.classList.add("Infavorites");
    favoriteButton.setAttribute("data-id", fastWork.id);
    favoriteButton.innerText = "В избранное";

    if (FastWorkList.favorites.some((item) => item.id === fastWork.id)) {
      favoriteButton.classList.add("addingFavorite");
    }
    favoriteButton.addEventListener("click", async function () {
      const url = "/api/favorite-fastWork";
      const clickedValue = favoriteButton.getAttribute("data-id");

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
            id: clickedValue,
          }),
        });

        const data = await response.json();

        console.log(data);
        console.log(this);
        if (data.result) {
          makeInFuture(this);
        } else {
          removeFuture(this);
        }
      } catch (error) {
        console.error("Ошибка:", error);
      } finally {
        setTimeout(() => setButtonState(true), 1000);
      }
    });
    buttonsElements.appendChild(favoriteButton);

    const respondButton = document.createElement("button");
    respondButton.classList.add("Respond");

    const respondLink = document.createElement("a");
    respondLink.href = `/fast-work/${fastWork.id}`;
    respondLink.innerText = "Откликнуться";

    respondButton.appendChild(respondLink);
    buttonsElements.appendChild(respondButton);

    bottomInfo.appendChild(buttonsElements);

    article.appendChild(bottomInfo);

    // Вставляем статью в контейнер на странице
    document.querySelector(".listVacas").appendChild(article);
  }});
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
    let fastWorksRespond = await fetch(`/api/fast-work?limit=${limitVacancy}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "augwod89h1h9awdh9py0y82hjd",
      },
      body: JSON.stringify(dataSearch),
    }).then((obj) => obj.json());
    console.log(fastWorksRespond);
    limitVacancy += step;
    if (!fastWorksRespond.success) {
      isStop = true;
      return { success: false, message: "Ошибка при получении" };
    }
    if (fastWorksRespond.fastWorks.length <= 0) {
      isStop = true;
      return { success: false, message: "Больше вакансий нет!" };
    }
    return { ...fastWorksRespond };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Ошибка при получении" };
  }
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
  if (dataSearch.hard != 0 && dataSearch.hard <= 5 && dataSearch.hard >= 1) {
    document
      .querySelectorAll("input[name='Level']")
      .forEach((item) =>
        dataSearch.hard === item.value ? (item.checked = true) : false
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

  // Зарплата
  if (dataSearch.price.minPrice || dataSearch.price.maxPrice) {
    input_max.value = dataSearch.price.maxPrice || "";
    input_min.value = dataSearch.price.minPrice || "";
  }

  const fastWorkList = document.querySelectorAll(".Infavorites");
  fastWorkList.forEach(function (item) {
    item.addEventListener("click", async function () {
      const url = "/api/favorite-fastWork";
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
            id: clickedValue,
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
document.querySelectorAll("input[name='Level']").forEach((item) => {
  item.addEventListener("click", function (e) {
    if (e.target.checked) {
      dataSearch.hard = e.target.value;
    } else {
      dataSearch.hard = 0;
    }
    changeURL("hard", JSON.stringify(dataSearch.hard));
  });
});
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}
