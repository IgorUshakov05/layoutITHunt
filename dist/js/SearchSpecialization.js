let url = new URL(window.location.href);
const parentSkill = document.querySelector(".listAddadSkills");
const inputSkills = document.getElementById("skills");
const input = document.getElementById("specialization");
const allData = {
  firstName: url.searchParams.get("name") || null,
  lastName: url.searchParams.get("surname") || null,
  job: JSON.parse(url.searchParams.get("job")) || [],
  skills: JSON.parse(url.searchParams.get("skills")) || [],
  city: url.searchParams.get("city") || null,
  expiriens: JSON.parse(url.searchParams.get("expiriens")) || [],
};
let inputCity = document.getElementById("searchCity");
let limitUsers = 4;
let isStop = false;
let removeSkill = (title) => {
  try {
    document.querySelector(`.skill[data-title="${title}"]`).remove();
    console.log(title);
    allData.skills = allData.skills.filter((skill) => skill != title);
  } catch (e) {
    console.log(e);
  }
};
inputSkills.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    let value = e.target.value.trim();
    if (!value) return false;
    allData.skills.push(value);
    parentSkill.innerHTML = "";
    allData.skills.forEach((skill) => {
      const li = document.createElement("li");
      li.innerHTML = `<div class="skill" data-title="${skill}">
                            <p class="titleSkill">${skill}</p>
                            <div onClick="removeSkill('${skill}')" id="removeSpecial" class="removeSpecial"><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L16 16" stroke="white" stroke-linecap="round"/>
                                <path d="M16 1L8.5 8.5L1 16" stroke="white" stroke-linecap="round"/>
                                </svg>
                            </div>
                        </div> `;
      parentSkill.appendChild(li);
    });
    this.value = "";
    setLisnk("skills", JSON.stringify(allData.skills));
  }
});
function selectExpiriens(value) {
  value = value.split("-");
  if (Number.isNaN(Number(value[0]))) {
    allData.expiriens = [];
    url.searchParams.delete("expiriens");
    return;
  }
  allData.expiriens = [value[0], value[1] ? value[1] : null];
  setLisnk("expiriens", JSON.stringify(allData.expiriens));
  return;
}
const firstAndLastName = document.getElementById("firstAndLastName");
$("#firstAndLastName").on("input", () => {
  try {
    let value = firstAndLastName.value
      .trim()
      .split(" ")
      .filter((elem) => {
        return elem.trim() !== "";
      });

    allData.firstName =
      value[0][0].toUpperCase() + value[0].slice(1, value[0].length);
    allData.lastName =
      value[1][0].toUpperCase() + value[1].slice(1, value[1].length);

    firstAndLastName.value = `${allData.firstName || ""} ${
      allData.lastName || ""
    }`;
    setLisnk("name", allData.lastName);
    setLisnk("surname", allData.firstName);
  } catch (e) {
    return false;
  }
});

function dataLoad() {
  if (allData.lastName && allData.firstName) {
    firstAndLastName.value = `${allData.lastName || ""} ${
      allData.firstName || ""
    }`;
  }
  if (allData.city) {
    inputCity.value = allData.city || "";
  }
  if (allData.skills.length > 0) {
    allData.skills.forEach((skill) => {
      const li = document.createElement("li");
      li.innerHTML = `<div class="skill" data-title="${skill}">
      <p class="titleSkill">${skill}</p>
      <div onClick="removeSkill('${skill}')" id="removeSpecial" class="removeSpecial"><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L16 16" stroke="white" stroke-linecap="round"/>
      <path d="M16 1L8.5 8.5L1 16" stroke="white" stroke-linecap="round"/>
      </svg>
      </div>
      </div> `;
      parentSkill.appendChild(li);
    });
  }
}

let setLisnk = (nameQueryParam, valueQueryParam) => {
  console.log(nameQueryParam, valueQueryParam);
  url.searchParams.delete(nameQueryParam);
  url.searchParams.append(nameQueryParam, valueQueryParam);
  console.log(url.search);
  document
    .querySelector(".sendForm")
    .setAttribute("href", "/specialists" + url.search);
};

let listItems = document.querySelectorAll(".listSpecialMy li");
const parentListSpecial = document.querySelector(".ParentlistSpecial");
input.addEventListener("input", function () {
  const filter = input.value.toUpperCase();
  let found = false;

  listItems.forEach(function (item) {
    // Get the label text and convert it to uppercase for case-insensitive comparison
    const label = item.querySelector("label").textContent.toUpperCase();

    // If the input text is found in the label, display the item and set found to true
    if (label.indexOf(filter) > -1) {
      item.style.display = "block";
      found = true;
    } else {
      item.style.display = "none";
    }
  });

  // If no items found, hide the parent container; otherwise, show it
  if (!found || filter.length == 0) {
    parentListSpecial.style.display = "none";
  } else {
    parentListSpecial.style.display = "block";
  }
});
inputCity.addEventListener("input", function (e) {
  let value = e.target.value;
  allData.city = value;
  setLisnk("city", allData.city);
});
function select(title) {
  input.value = "";
  parentListSpecial.style.display = "none";
  $(".allSpecial").append(`<div class="selectedSpecial">
    <p>${title}</p>
    <div id="removeSpecial" class="removeSpecial"><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L16 16" stroke="white" stroke-linecap="round"/>
        <path d="M16 1L8.5 8.5L1 16" stroke="white" stroke-linecap="round"/>
        </svg>
        </div>
</div>`);
  allData.job.push(title);
  allData.job = [...new Set(allData.job)];
  setLisnk("job", JSON.stringify(allData.job));
}

$(".allSpecial").on("click", ".removeSpecial", function () {
  allData.job = allData.job.filter((elem) => {
    return elem !== $(this).parent().find("p").text();
  });
  $(this).parent().remove();
  console.log(url.search);
});

function makeInFuture(element) {
  $(element).addClass("addingFavorite");
}

// Функция для удаления класса
function removeFuture(element) {
  $(element).removeClass("addingFavorite");
}

let getUserByLimit = async () => {
  try {
    if (isStop) {
      isStop = true;
      return { success: false };
    }
    let user = await fetch(`/api/user?limit=${limitUsers}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "augwod89h1h9awdh9py0y82hjd",
      },
      body: JSON.stringify(allData),
    }).then((obj) => obj.json());
    limitUsers += 2;
    if (!user.success) {
      isStop = true;
      return { success: false, message: "Ошибка при получении" };
    }
    if (user.users.length <= 0) {
      isStop = true;
      return { success: false, message: "Больше пользователей нет!" };
    }
    return { success: true, users: user.users, messsage: "Успех!" };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Ошибка при получении" };
  }
};

function calculateExperience(expiriens) {
  console.log(expiriens);
  if (!Array.isArray(expiriens) || expiriens.length === 0) {
    return "Нет опыта"; // Обработка пустого или некорректного массива
  }

  const totalExperience = expiriens.reduce((sum, item) => {
    const experience = Number(item.date);
    if (isNaN(experience)) return sum; // Игнорируем некорректные значения
    return sum + (item.typeData === "m" ? experience / 12 : experience);
  }, 0);

  // Разделяем годы и месяцы
  const years = Math.floor(totalExperience);
  const months = Math.round((totalExperience - years) * 12);

  // Функция для склонения
  function getDeclension(value, words) {
    const absValue = Math.abs(value) % 100;
    const lastDigit = absValue % 10;

    if (absValue > 10 && absValue < 20) return words[2];
    if (lastDigit === 1) return words[0];
    if (lastDigit > 1 && lastDigit < 5) return words[1];
    return words[2];
  }

  // Слова для склонения
  const yearsWord = getDeclension(years, ["год", "года", "лет"]);
  const monthsWord = getDeclension(months, ["месяц", "месяца", "месяцев"]);

  // Формируем итоговый вывод
  let experienceText = "";
  if (years > 0) experienceText += `${years} ${yearsWord}`;
  if (months > 0)
    experienceText += `${years > 0 ? " и " : ""}${months} ${monthsWord}`;

  return experienceText || "Нет опыта";
}
function insertUsers(users) {
  users.forEach((user, index) => {
    document.querySelector(".append").insertAdjacentHTML(
      "beforeend",
      `
    <article
      data-last="${index === users.length - 1 ? true : false}"
      class="${user.isPremium ? "premiumUser " : ""} personArticle"
    >
      <div class="topInfoSpec">
        <div class="leftTopInfoSpec">
          <div class="imgProfile">
            <img
              width="104"
              height="104"
              src="${
                user.avatar
                  ? user.avatar
                  : user.isPremium
                  ? "/assets/pictures/ПремиумС.jpg"
                  : "/assets/pictures/ДефолтСпециалист.jpg"
              }"
              alt="Фото ${user.surname} ${user.name}"
            />
          </div>
        </div>
        <div class="rightTopInfoSpec">
          <div class="flexBeetwin">
            <div class="rigthTop">
              <div class="leftleft">
                <a
                  href="/${user.id}"
                  title="${user.surname} ${user.name}"
                  data-username="${user.surname} ${user.name}"
                >
                  <span class="userLFName">${user.surname} ${user.name}</span>
                </a>
                <div class="specialnost">
                  <span class="specialnostText">${
                    user.job || "Работа не определена"
                  }</span>
                </div>
              </div>
            </div>

            <div class="rightright">
              <button
                id="addToFavorites"
                class="inFavoritePerson textMy beActive inFav ${
                  user.isFavorite ? "addingFavorite" : ""
                }"
                data-id="${user.id}"
              >
                В избранное
              </button>
              <a href="/send-message?id=${
                user.id
              }" class="inFavoritePerson textMy typing">Написать</a>
            </div>
          </div>
          <div class="bottomRight">
                  <div class="expitiens">
              
                    <span
                      >Опыт
                      <b style="font-weight: 700"
                        >${calculateExperience(user.expiriens)}</b
                      ></span
                    >
                  </div>
                  
                </div>
            <div class="cityPerson">
              <div class="point">
                <svg
                  class="point"
                  width="11"
                  height="15"
                  viewBox="0 0 11 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5.5 0C8.53757 0 11 2.26228 11 5.05312C11 9.61016 5.5 14.4375 5.5 14.4375C5.5 14.4375 0 9.65067 0 5.05312C0 2.26228 2.46243 0 5.5 0Z"
                    fill="#5412E0"
                  />
                  <path
                    d="M5.5 8.25003C7.01878 8.25003 8.25 7.01881 8.25 5.50003C8.25 3.98125 7.01878 2.75003 5.5 2.75003C3.98122 2.75003 2.75 3.98125 2.75 5.50003C2.75 7.01881 3.98122 8.25003 5.5 8.25003Z"
                    fill="white"
                  />
                </svg>
              </div>
              <p title="${user.city}">${user.city || "Локация не указана"}</p>
            </div>
          </div>
        </div>
      </div>
      ${
        user.description?.length
          ? `<div class="middleInfoVacansya noMob">
        <div class="descriptionVacansy">
          <p class="descriptionVacansyText">${user.description}</p>
        </div>
        <div class="showFull">
          <span class="showFullText">Показать полностью</span>
        </div>
      </div>`
          : ""
      }
      ${
        user.skills
          ? `<div class="bottomInfoSpec">
        <ul class="listStacks" style="margin-left: -8px">
          ${user.skills
            .map(
              (skill) => `<li class="abilityItem">
            <h5 class="ability">${skill.title}</h5>
          </li>`
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }
      <div class="rightright mobrightright">
        <button type="button" class="Infavorites defaultButton inFav ${
          user.isFavorite ? "addingFavorite" : ""
        }" data-id="${user.userID}">
          В избранное
        </button>
        <a href="/send-message?id=${
          user.id
        }" class="inFavoritePerson textMy typing">Написать</a>
      </div>
    </article>`
    );
  });
  lifeForFavorite();
}
document.addEventListener("DOMContentLoaded", () => {
  let lastElement = document.querySelectorAll('[data-last="true"]');
  lastElement = lastElement[lastElement.length - 1];
  if (lastElement) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach(async (entry) => {
          console.log(entry);
          if (entry.isIntersecting) {
            let users = await getUserByLimit(limitUsers);
            console.log(users);
            if (!users.success) return false;
            insertUsers(users.users);
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
function lifeForFavorite() {
  document.querySelectorAll(".inFav").forEach(function (item) {
    item.addEventListener("click", function () {
      let id = this.getAttribute("data-id");
      fetch("/api/favorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "augwod89h1h9awdh9py0y82hjd",
        },
        body: JSON.stringify({ id }),
      })
        .then((obj) => obj.json())
        .then((obj) => {
          if (obj.result) {
            makeInFuture(item);
          } else {
            removeFuture(item);
          }
        });
      // if (item.classList.contains("addingFavorite")) {
      // } else {
      // }
    });
  });
  $(".showFull").on("click", function () {
    let descriptionVacansyText = $(this).prev(".descriptionVacansy");
    descriptionVacansyText.toggleClass("fullText");
    var buttonText = $(this).find(".showFullText");
    buttonText.text(function (i, text) {
      return text === "Показать полностью" ? "Свернуть" : "Показать полностью";
    });
  });
}
lifeForFavorite();
dataLoad();
