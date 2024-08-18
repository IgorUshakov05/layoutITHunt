var url;

function searchFavorite() {
  var input, filter, messages, i;
  input = document.getElementById("searchPeople");
  filter = input.value.toUpperCase().trim();
  messages = document.querySelectorAll(".myDady");

  messages.forEach((msg) => {
    var textElems = msg.querySelectorAll(
      ".firstNameAndLastNameText, .specialnostText"
    );
    var show = Array.from(textElems).some((elem) => {
      var text = elem.textContent || elem.innerText;
      return text.toUpperCase().includes(filter);
    });
    msg.style.display = show ? "" : "none";
  });
}

$(".clickShow").on("click", function () {
  $(this).closest(".myVac").find(".descriptionVacansyProfile").toggle();
  $(this).closest(".myVac").find(".arrow").toggleClass("rotate");
});

$(".allSelect").on("click", function () {
  document.getElementById("searchPeople").value = "";
  messages = document.querySelectorAll(".myDady");
  messages.forEach((msg) => {
    msg.style.display = "";
  });
  $(".inputSearchFavorite").toggle();
  $(".dadysIsNotActive").toggleClass("dadys");
  if ($(".inputSearchFavorite").is(":visible")) {
    $(this).find("span").text("Скрыть");
  } else {
    $(this).find("span").text("Показать всех");
  }
});

$(".arrow").on("click", function () {
  $(this).closest(".myVac").find(".descriptionVacansyProfile").toggle();
  $(this).closest(".myVac").find(".arrow").toggleClass("rotate");
});

$(".closeVacancy").on("click", function () {
  $(".vacancyBox").toggle();
  $(".closeVacancy").toggleClass("rotate");
});

$(".closeFast").on("click", function () {
  $(".fastBox").toggle();
  $(".closeFast").toggleClass("rotate");
});

$(".canelss").on("click", function () {
  $(".blackBack").hide();
  $(".modalWindowRemoveUser").hide();
});
$(".removeUserFavorite").on("click", function () {
  $(".blackBack").show();
  $(".modalWindowRemoveUser").show();
  console.log($(this).attr("data-id"));
  url = $(this).attr("data-id");
});
$("#removeChatUser").on("click", () => {
  removeFavoriteUserFetch(url);
  console.log(url);
});
document.addEventListener("removeChatUser", function () {
  console.log(this);
});
const removeFavoriteUserFetch = (urlUser) => {
  fetch("/api/favorite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "augwod89h1h9awdh9py0y82hjd",
    },
    body: JSON.stringify({
      id: urlUser,
    }),
  })
    .then((obj) => obj.json())
    .then((data) => {
        if(data.result === false) window.location.reload();
      console.log(data);
    })
    .catch(function (error) {
      if (error) {
        $(".descriptionRemove").text("Ошибка при удалении").css("color", "red");
        setTimeout(() => {
           window.location.reload();
        }, 2000);
      }
    });
};
