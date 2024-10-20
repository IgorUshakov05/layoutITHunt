// Select the input field
const input = document.getElementById("specialisationSelect");
const inputSkills = document.getElementById("inputSkills");
// Select all the list items
const listItems = document.querySelectorAll(".listSpecialMy li");
const maxLength = 5000;
const makeOneVisible = () => {
  if (allData.special !== "" && allData.skills.length !== 0) {
    $("#nextStageTwo").removeAttr("disabled");
  } else {
    $("#nextStageTwo").attr("disabled", true);
  }
};

const specializations = {
  Аналитик: "/assets/pictures/analytics.webp",
  "SEO-специалист": "/assets/pictures/seo.webp",
  "Графический дизайнер": "/assets/pictures/disigner.webp",
  "Системный администратор": "/assets/pictures/sysadm.webp",
  "Администратор БД": "/assets/pictures/database.webp",
  HR: "/assets/pictures/hr.webp",
  Frontend: "/assets/pictures/frontend.webp",
  "Менеджер продаж": "/assets/pictures/meneger.webp",
  Тестировщик: "/assets/pictures/tester.webp",
  "Продукт менеджер": "/assets/pictures/product.webp",
  Backend: "/assets/pictures/backend.webp",
  FullStack: "/assets/pictures/fullstack.webp",
  TeamLeader: "/assets/pictures/teamleader.webp",
  Верстальщик: "/assets/pictures/Верстальщик.webp",
  "Инфобез-специалист": "/assets/pictures/soft.webp",
  "Веб-дизайнер": "/assets/pictures/web-disigner.webp",
  Маркетолог: "/assets/pictures/marketolog.webp",
  Копирайтер: "/assets/pictures/copy.webp",
};

// Select the parent container
const parentListSpecial = document.querySelector(".ParentlistSpecial");
let skillList = [];
let allData = {
  special: window.conf.special,
  skills: window.conf.skills.map((el) => {
    return el.title;
  }),
  wayOfWorking: window.conf.wayOfWorking.map((el) => {
    return el.title;
  }),
  expirienceLife: window.conf.expirienceLife,
  id: new URL(window.location).searchParams.get("id"),
  salary: {
    min: window.conf.price.min,
    max: window.conf.price.max,
    agreement: Boolean(window.conf.price.agreement),
  },
  description: window.conf.description,
};
for (const wayItem of allData.wayOfWorking) {
  document.querySelector(`input[value="${wayItem}"]`).checked = true;
}
document.querySelector(
  `input[value="${allData.expirienceLife}"]`
).checked = true;
for (const skill of allData.skills) {
  appendElementUI(skill);
}

let specialList = [
  "Аналитик",
  "SEO-специалист",
  "Графический дизайнер",
  "Системный администратор",
  "Администратор БД",
  "HR",
  "Frontend",
  "Менеджер продаж",
  "Тестировщик",
  "Продукт менеджер",
  "Backend",
  "FullStack",
  "TeamLeader",
  "Верстальщик",
  "Инфобез-специалист",
  "Веб-дизайнер",
  "Маркетолог",
  "Копирайтер",
];
const employmentTypes = [
  "Удаленная",
  "Полный день",
  "Частичная работа",
  "Офисная",
  "Гибкий график",
  "Сменный график",
];

let oneStageHideAndShoTwoStage = () => {
  document.getElementById("oneStage").style.display = "none";
  document.getElementById("twoStage").style.display = "block";
};
const list = document.querySelector(".listExpressive");
let timeoutId;
inputSkills.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    console.log("Вы нажали Enter");
    event.preventDefault();
    if (!allData.skills.includes(this.value)) {
      allData.skills.push(this.value);
      appendElementUI(this.value);
    }
    this.value = "";
    document.querySelector(".ParentlistExpressive").style.display = "none";
    list.innerHTML = "";
    clearTimeout(timeoutId);
    return;
  }
});
inputSkills.addEventListener("input", async function (e) {
  clearTimeout(timeoutId); // Очищаем предыдущий таймаут
  let value = e.target.value.trim();

  timeoutId = setTimeout(async () => {
    // Запускаем таймаут
    if (!value.length) {
      document.querySelector(".ParentlistExpressive").style.display = "none";
      list.innerHTML = "";
      return;
    }
    try {
      let response = await fetch(`/api/setSkills?title=${value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "augwod89h1h9awdh9py0y82hjd",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data = await response.json();
      console.log(data);

      if (!data.items) {
        return;
      }

      // Обновляем UI, используя полученные данные

      document.querySelector(".ParentlistExpressive").style.display = "block";
      list.innerHTML = "";

      data.items.forEach((item) => {
        const li = document.createElement("li");
        li.classList.add("SelectSkill");
        li.innerHTML = `<label>${item.text}</label>`;
        list.appendChild(li);

        li.addEventListener("click", () => {
          if (allData.skills.length > 100) return false;
          const label = li.querySelector("label");
          console.log(label.textContent);
          document.querySelector(".ParentlistExpressive").style.display =
            "none";
          inputSkills.value = "";
          // Добавляем элемент в массив уникальных навыков и в UI, если его там еще нет
          if (!allData.skills.includes(item.text)) {
            allData.skills.push(item.text);
            appendElementUI(item.text);
          }
        });
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }, 500); // Задержка в 500 мс
});
function appendElementUI(text) {
  let skillsList = document.querySelector(".skillsList");
  let elemToAppend = `<li class="slillItem">
                        <span>${text}</span>
                        <span class="removeSkill">
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L12 12" stroke="white" stroke-linecap="round"/>
                                <path d="M12 1L6.5 6.5L1 12" stroke="white" stroke-linecap="round"/>
                            </svg>
                        </span>
                      </li>`;

  skillsList.insertAdjacentHTML("beforeend", elemToAppend);

  // Привязываем событие к новому элементу
  let removeSkillElem = skillsList.querySelector(
    ".slillItem:last-child .removeSkill"
  );
  removeSkillElem.addEventListener("click", removeFunction);
  makeOneVisible();
}

function removeFunction() {
  console.log("Удаление навыка", this.parentElement.children[0].innerText);
  removeFromSkillAllData(this.parentElement.children[0].innerText);
  this.closest(".slillItem").remove();
  makeOneVisible();
}

// Add event listener for input changes
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

function removeFromSkillAllData(title) {
  allData.skills = allData.skills.filter((skill) => skill !== title);
  console.log(allData.skills);
}
function select(pic, title) {
  if (!specialList.includes(title)) return false;
  $(".boxSelection").css("display", "flex");
  $(".titleJobItem").text(title);
  $(".noneMake").toggle();
  $(".selectImg").attr("src", pic);
  allData.special = title;
  makeOneVisible();
}
select(specializations[allData.special], allData.special);

$('input[name="interest"]').change(function () {
  allData.wayOfWorking = [];

  // Проходим по всем выбранным чекбоксам и добавляем их значение в массив
  $('input[name="interest"]:checked').each(function () {
    if (employmentTypes.some((item) => item === $(this).val()))
      allData.wayOfWorking.push($(this).val());
  });
  makeOneVisibleTwoStage();
});

$('input[name="radioExpiriens"]').change(function () {
  // Обновляем переменную expirienceLife с выбранным значением
  allData.expirienceLife = $('input[name="radioExpiriens"]:checked').val();

  // Выводим результат в консоль (можно изменить на ваше действие)
  makeOneVisibleTwoStage();
});

$('input[name="zarplata"]').change(function () {
  // Обновляем переменную allData.salary.agreement в зависимости от выбранной радиокнопки
  allData.salary.agreement =
    $('input[name="zarplata"]:checked').val() === "true";

  // Выводим результат в консоль (можно изменить на ваше действие)
  makeOneVisibleTwoStage();
});

$(".canesSelect").on("click", () => {
  $(".boxSelection").css("display", "none");
  $(".titleJobItem").text("");
  $(".noneMake").toggle();
  allData.special = "";
  $(".selectImg").attr("src", "");
  makeOneVisible();
});

$("#min").on("input", () => {
  allData.salary.min = $("#min").val();
  makeOneVisibleTwoStage();
});
document.getElementById("max").value = allData.salary.max;
document.getElementById("min").value = allData.salary.min;
document.getElementById("zarplata").checked = allData.salary.agreement;

$("#max").on("input", () => {
  allData.salary.max = $("#max").val();
  makeOneVisibleTwoStage();
});

const makeOneVisibleTwoStage = () => {
  let isActive =
    allData.expirienceLife !== "" && // Проверка, что опыт жизни не пуст
    allData.wayOfWorking.length !== 0 && // Проверка, что способ работы выбран
    (allData.salary.min > 0 ||
      allData.salary.max > 0 ||
      allData.salary.agreement);
  if (isActive) {
    $("#nextStageThree").removeAttr("disabled"); // Включить кнопку
  } else {
    $("#nextStageThree").attr("disabled", true); // Отключить кнопку
  }
  return isActive;
};

const makeOneVisibleLastStage = () => {
  let isActive =
    allData.description.length >= 10 &&
    quill.getText().length >= 10 &&
    specialList.includes(allData.special) &&
    allData.skills.length <= 100 &&
    (allData.salary.min > 0 ||
      allData.salary.max > 0 ||
      allData.salary.agreement);
  if (isActive) {
    $("#nextStageFinalyAndEnd").removeAttr("disabled");
  } else {
    $("#nextStageFinalyAndEnd").attr("disabled", true);
  }
  return isActive;
};

//Первый экран
$("#nextStageTwo").on("click", () => {
  oneStageHideAndShoTwoStage();
  $(".oneStage").height("0");
  $("#progress").attr("value", "60");
  $(".twoStage").height("fit-content");
});

//Первый экран - на первый экран
$("#toOneStage").on("click", () => {
  $(".oneStage").height("fit-content");
  $("#progress").attr("value", "30");
  document.getElementById("oneStage").style.display = "block";
  document.getElementById("twoStage").style.display = "none";
});

//Второй экран
$("#nextStageThree").on("click", () => {
  $(".twoStage").height("0");
  $("#progress").attr("value", "90");
  $(".threeStage").height("fit-content");
});

$("#toThreeStage").on("click", () => {
  $(".twoStage").height("fit-content");
  $("#progress").attr("value", "60");
  $(".threeStage").height("0");
});

//Финал!
var formats = [
  "background",
  "bold",
  "color",
  "font",
  "code",
  "italic",
  "link",
  "size",
  "strike",
  "script",
  "underline",
  "blockquote",
  "header",
  "indent",
  "list",
  "align",
  "direction",
  "code-block",
  "formula",
  // 'image'
  // 'video'
];
var quill = new Quill("#editor-container", {
  theme: "snow",
  placeholder: "Придумайте описание вакансии",
  modules: {
    toolbar: [
      ["bold", "italic"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  },
  formats: formats,
});
let charCount = document.getElementById("charCount");
var charCountElem = document.getElementById("charCount");
quill.on("text-change", (delta, oldDelta, source) => {
  makeOneVisibleLastStage();
  // Получаем текущий текст из редактора
  let value = quill.getText();
  // Вставляем текст из allData.description, если он есть
  if (value.length === 0) {
    allData.description = "";
  }
  if (value.length >= maxLength) {
    // Проверяем, не превышает ли длина текста максимальное значение
    // Если превышает, обрезаем текст до максимальной длины
    quill.deleteText(maxLength, value.length - maxLength);
    // Обновляем значение переменной после обрезки
    value = quill.getText();
  }

  // Обновляем счетчик оставшихся символов
  charCount.innerText = maxLength - value.length;

  // Логируем источник изменения
  if (source === "api") {
    console.log("An API call triggered this change.");
  } else if (source === "user") {
    console.log("A user action triggered this change.");
  }

  // Блокировка вставки картинок
  if (source === "user") {
    const ops = delta.ops;
    for (const op of ops) {
      if (op.insert && typeof op.insert === "object" && op.insert.image) {
        quill.deleteText(op.insert.image.length, 0);
      }
    }
  }
  allData.description = quill.root.innerHTML;
});
var editor = document.getElementsByClassName("ql-editor");
editor[0].innerHTML = allData.description;
document
  .getElementById("nextStageFinalyAndEnd")
  .addEventListener("click", async () => {
    const button = document.getElementById("nextStageFinalyAndEnd");
    try {
      button.setAttribute("disabled", "disabled");

      const is = makeOneVisibleLastStage();
      console.log(is);
      if (!is) {
        button.setAttribute("disabled", "disabled");
        return false;
      }

      console.log("Fetch Create Vacancy");
      const response = await fetch("/api/edit-vacancy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "augwod89h1h9awdh9py0y82hjd",
        },
        body: JSON.stringify(allData),
      });

      if (response.status !== 201) {
        console.log(response);
        return false;
      }

      const data = await response.json();
      $(".threeStage").height("0");
      progress.value = 100;
      $("#progress").attr("value", "100");
      $(".lineCreateLevel").addClass("filalyProgress");
      $(".finalyStage").height("fit-content");
    } finally {
      console.log("Finished");
    }
  });
