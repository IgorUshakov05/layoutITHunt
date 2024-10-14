$(".myVacListForSelect").on("click", function () {
  $(this).children(".defaultAll").children("svg").toggleClass("rotate");
  $(this).children(".listVacansySelect").toggle();
});

$(".filterToExp").on("click", function () {
  $(this).toggleClass("activeFilter");
  $(".makeWhite").toggleClass("makeBlack");
});
let fetchMethod = async (userID, vacancyID, isAccept) => {
  let req = await fetch("/api/solution", {
    method: "POST",
    body: JSON.stringify({ userID, vacancyID, solution: isAccept }),
  });
  let response = await req.json();
  console.log(fetchMethod);
  return response;
};
async function accept(userID, vacancyID) {
    let req = await fetchMethod(userID, vacancyID, true)
    
}

function cancel(userID, vacancyID) {}

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

document.querySelectorAll(".inFav").forEach(function (item) {
  item.addEventListener("click", function () {
    if (item.classList.contains("addingFavorite")) {
      removeFuture(item);
    } else {
      makeInFuture(item);
    }
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
    .find(".responseUser")
    .css("display", "none");
  $(this).parent().parent().parent().find(".defaulUser").toggle();
  $(this).parent().parent().parent().find(".rejectUser").css("display", "none");
});
