let isAscending = false; // Переменная для отслеживания порядка
let valueVacansy = "";
$(".sort").on("click", function () {
  const $articles = $(".itemZayancaVac");
  const sortedArticles = $articles.sort((a, b) => {
    const aMatches = parseInt($(a).find(".colorHunt").text().split("/")[0]);
    const bMatches = parseInt($(b).find(".colorHunt").text().split("/")[0]);

    return isAscending ? aMatches - bMatches : bMatches - aMatches; // Переключение порядка
  });

  $(".listZayavoc").append(sortedArticles); // Обновляем порядок элементов
  $(this).children(".defaultAll").children("svg").toggleClass("rotate");
  $(this).children(".listVacansySelect").toggle();

  isAscending = !isAscending; // Переключаем порядок
});
$(".items").on("click", function (e) {
  const valueVacansy = $(this).text().trim();
  document.querySelector(".mainText").innerHTML = valueVacansy;

  $(".itemZayancaVac").each(function () {
    const title = $(this).find(".titleVacancyZa").text();
    if (title.includes(valueVacansy) || valueVacansy === "Все вакансии") {
      $(this).show(); // Показываем подходящие вакансии
    } else {
      $(this).hide(); // Скрываем неподходящие вакансии
    }
  });
});

$(".sortVac").on("click", function () {
  $(this).children(".defaultAll").children("svg").toggleClass("rotate");
  $(this).children(".listVacansySelect").toggle();
});
$(".filterToExp").on("click", function () {
  $(this).toggleClass("activeFilter");
  $(".makeWhite").toggleClass("makeBlack");
});
let fetchMethod = async (userID, vacancyID, isAccept, message) => {
  let req = await fetch("/api/solution", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "augwod89h1h9awdh9py0y82hjd",
    },
    body: JSON.stringify({
      vacancyID,
      userID,
      solution: isAccept,
      message,
    }),
  });
  let response = await req.json();
  return response;
};

async function accept(userID, vacancyID, message) {
  let req = await fetchMethod(userID, vacancyID, true, message);
  return req;
}

async function reject(userID, vacancyID, message) {
  let req = await fetchMethod(userID, vacancyID, false, message);
  return req;
}
async function cancel(userID, vacancyID) {
  let req = await fetchMethod(userID, vacancyID, null);
  return req;
}

function makeInFuture() {
  var elemParent = elem.parentElement.parentElement.parentElement;
  var buttons = elemParent.querySelectorAll(".inFav");
  buttons.forEach(function (item) {
    item.classList.add("addingFavorite");
  });
}

function removeFuture() {
  var elemParent = elem.parentElement.parentElement.parentElement;
  var buttons = elemParent.querySelectorAll(".inFav");
  buttons.forEach(function (item) {
    item.classList.remove("addingFavorite");
  });
}

// Принятие
let like = document.querySelectorAll(".sendLike");
for (const textAreasItem of like) {
  textAreasItem.addEventListener("click", async function () {
    let value = await this.closest(".itemZayancaVac")
      .querySelector(".textRequest")
      .querySelector(".textareaTwoCard");
    let resp = await accept(
      this.getAttribute("data-id"),
      this.getAttribute("data-v-id"),
      value.value.trim()
    );
    let msg = this.closest(".itemZayancaVac")
      .querySelector(".textRequest")
      .querySelector(".message");
    if (!resp.success) {
      msg.style.display = "block";
      resp.errors.forEach(function (err) {
        msg.innerText = err.msg;
      });
      return;
    }
    msg.style.display = "none";
    this.style.display = "none";
    value.setAttribute("disabled", "disabled");
    value.style.cursor = "not-allowed";
  });
}
// Отклонение
let dislike = document.querySelectorAll(".sendDislike");
for (const textAreasItem of dislike) {
  textAreasItem.addEventListener("click", async function () {
    let value = await this.closest(".itemZayancaVac")
      .querySelector(".textRequest")
      .querySelector(".textareaTwoCard");
    let resp = await reject(
      this.getAttribute("data-id"),
      this.getAttribute("data-v-id"),
      value.value.trim()
    );
    let msg = this.closest(".itemZayancaVac")
      .querySelector(".textRequest")
      .querySelector(".message");
    if (!resp.success) {
      msg.style.display = "block";
      resp.errors.forEach(function (err) {
        msg.innerText = err.msg;
      });
      return;
    }
    msg.style.display = "none";
    this.style.display = "none";
    value.setAttribute("disabled", "disabled");
    value.style.cursor = "not-allowed";
  });
}

// Отмена
let cansel = document.querySelectorAll(".bnone");
for (const textAreasItem of cansel) {
  textAreasItem.addEventListener("click", async function () {
    let resp = await cancel(
      this.getAttribute("data-id"),
      this.getAttribute("data-v-id"),
      null
    );
    let msg = await this.closest(".itemZayancaVac")
      .querySelector(".textRequest")
      .querySelector(".message");
    if (!resp.success) {
      msg.style.display = "block";
      resp.errors.forEach(function (err) {
        msg.innerText = err.msg;
      });
      return;
    }
    msg.style.display = "none";
    value.setAttribute("disabled", "disabled");
    value.style.cursor = "not-allowed";
  });
}

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

$(".rejectQuery").on("click", function () {
  $(this).parent().parent().toggle();
  $(this)
    .parent()
    .parent()
    .parent()
    .find(".textRequest")
    .css("display", "block");
  $(this).parent().parent().parent().find(".rejectUser").css("display", "flex");
});
$(".sendResponse").on("click", function () {
  $(this).parent().parent().toggle();
  $(this)
    .parent()
    .parent()
    .parent()
    .find(".textRequest")
    .css("display", "block");
  $(this)
    .parent()
    .parent()
    .parent()
    .find(".responseUser")
    .css("display", "flex");
});

$(".bnone").on("click", function () {
  let dataId = $(this).attr("data-id");
  $(this)
    .parent()
    .parent()
    .parent()
    .find('button[data-id="' + dataId + '"].sendLike')
    .css("display", "inline");
  $(this)
    .parent()
    .parent()
    .parent()
    .find('button[data-id="' + dataId + '"].sendDislike')
    .css("display", "inline");
  $(this)
    .parent()
    .parent()
    .parent()
    .find(".textRequest")
    .css("display", "none");
  $(this)
    .parent()
    .parent()
    .parent()
    .find(".textRequest")
    .find("textarea")
    .removeAttr("disabled")
    .css("cursor", "text")
    .val("");
  $(this)
    .parent()
    .parent()
    .parent()
    .find(".responseUser")
    .css("display", "none");
  $(this).parent().parent().parent().find(".defaulUser").toggle();
  $(this).parent().parent().parent().find(".rejectUser").css("display", "none");
});
