$(".myVacListForSelect").on("click", function () {
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
  console.log(response);
  return response;
};

async function accept(userID, vacancyID, message) {
  let req = await fetchMethod(userID, vacancyID, true, message);
}

async function reject(userID, vacancyID, message) {
  let req = await fetchMethod(userID, vacancyID, false, message);
}
async function cancel(userID, vacancyID) {
  let req = await fetchMethod(userID, vacancyID, null);
}

function makeInFuture(elem) {
  var elemParent = elem.parentElement.parentElement.parentElement;
  var buttons = elemParent.querySelectorAll(".inFav");
  buttons.forEach(function (item) {
    item.classList.add("addingFavorite");
  });
}

function removeFuture(elem) {
  var elemParent = elem.parentElement.parentElement.parentElement;
  var buttons = elemParent.querySelectorAll(".inFav");
  buttons.forEach(function (item) {
    item.classList.remove("addingFavorite");
  });
}

// Принятие
let like = document.querySelectorAll(".sendLike");
for (const textAreasItem of like) {
  textAreasItem.addEventListener("click", function () {
    this.style.display = "none";

    let value = this.closest(".itemZayancaVac")
      .querySelector(".textRequest")
      .querySelector(".textareaTwoCard");
    value.setAttribute("disabled", "disabled");
    value.style.cursor = "not-allowed";
    accept(
      this.getAttribute("data-id"),
      this.getAttribute("data-v-id"),
      value.value.trim()
    );
  });
}
// Отклонение
let dislike = document.querySelectorAll(".sendDislike");
for (const textAreasItem of dislike) {
  textAreasItem.addEventListener("click", function () {
    this.style.display = "none";
    let value = this.closest(".itemZayancaVac")
      .querySelector(".textRequest")
      .querySelector(".textareaTwoCard");
    value.setAttribute("disabled", "disabled");
    value.style.cursor = "not-allowed";
    reject(
      this.getAttribute("data-id"),
      this.getAttribute("data-v-id"),
      value.value.trim()
    );
  });
}

// Отмена
let cansel = document.querySelectorAll(".bnone");
for (const textAreasItem of cansel) {
  textAreasItem.addEventListener("click", function () {
    cancel(this.getAttribute("data-id"), this.getAttribute("data-v-id"), null);
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
