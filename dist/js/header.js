$(document).ready(function () {
  const $burgerButton = $(".burger");
  const $mobileMenu = $(".mobile");
  const $main = $("main");
  const $openClose = $(".open-close");

  $burgerButton.on("click", function (event) {
    event.stopPropagation();
    $mobileMenu.toggle(); // Переключение видимости мобильного меню
    if ($mobileMenu.is(":visible")) {
      $("body").css("overflow-y", "hidden"); // Заблокировать вертикальную прокрутку
    } else {
      $("body").css("overflow-y", "auto"); // Восстановить вертикальную прокрутку
    }
    $burgerButton.toggleClass("rotate-burger"); // Добавление/удаление класса для поворота иконки бургера
  });

  $(".fromDevelopers").on("click", function () {
    $(this).children(".fromUs").children(".fullDev").toggleClass("rotate");
    $(this).children(".fromUsText").toggle();
  });
  $main.on("click touchstart", function () {
    $mobileMenu.css("display", "none");
    $("body").css("overflow-y", "auto");
    $burgerButton.removeClass("rotate-burger");
  });
  $(".open-close").on("click", function () {
    var paragraph = $(this).siblings("p");

    $(this).toggleClass("rotate");
    paragraph.toggleClass("some-class");
  });

  $(".response").click(function () {
    // Используем метод slideToggle() для плавного открытия/скрытия элемента с классом "request"
    $(this).find(".request").slideToggle();
    $(this).toggleClass("responseClick");
    $(this).find(".text > p").toggleClass("while");
  });

  $("#openModal").click(function () {
    $(".modal").css("display", "flex");
  });
  // Обработчик для клика по кнопке "Назад"
  $("#backBtn").click(function () {
    $(".modal").css("display", "none");
  });

  $(".openFilter").on("click", function () {
    $(".filt").toggleClass("clearFilt");
    // Получаем текущий текст внутри элемента <p>
    var currentText = $(".openFilter p").text();

    // Изменяем текст в зависимости от текущего значения
    if (currentText === "Закрыть фильтр") {
      $(".openFilter p").text("Раскрыть фильтр");
    } else {
      $(".openFilter p").text("Закрыть фильтр");
    }
  });

  $(".showFull").on("click", function () {
    let descriptionVacansyText = $(this).prev(".descriptionVacansyText");
    descriptionVacansyText.toggleClass("fullText");
    var buttonText = $(this).find(".showFullText");
    buttonText.text(function (i, text) {
      return text === "Показать полностью" ? "Свернуть" : "Показать полностью";
    });
  });

  // if ($(window).width() <= 1100) {
  //     $('.filt').addClass('clearFilt');
  // }

  // // Добавляем обработчик изменения размера окна
  $(window).on("resize", function () {
    // Проверяем ширину окна и скрываем фильтр, если необходимо
    if ($(window).width() > 1100) {
      $(".filt").removeClass("clearFilt");
    }
  });

  $(".buttonremoveChat").on("click", () => {
    $(".blackBack").addClass("BlockModal");
    $(".removeChatNone").addClass("BlockModal");
    $(".windowMethodsChatMobile").removeClass("showModalWind");
  });

  $(".blockUser").on("click", () => {
    $(".blackBack").addClass("BlockModal");
    $(".blockUs").addClass("BlockModal");
    $(".windowMethodsChatMobile").removeClass("showModalWind");
  });
  $(".settingEvent").on("click", () => {
    $(".blackBack").addClass("BlockModal");
    $(".unpdateEventClick").addClass("BlockModal");
    $(".windowMethodsChatMobile").removeClass("showModalWind");
  });
  $(".canelss").on("click", () => {
    $(".blackBack").removeClass("BlockModal");
    $(".blockUs").removeClass("BlockModal");
    $(".removeChatNone").removeClass("BlockModal");
    $(".unpdateEventClick").removeClass("BlockModal");

    $(".windowMethodsChatMobile").removeClass("showModalWind");
  });

  $(".settingsOpen").on("click", () => {
    $(".allInfoProfile").toggle(); // This line toggles the visibility of elements with the class .allInfoProfile
    console.log("hello");
    $(".settingsMenu").toggle();
    // $('body').css('overflow', 'scroll')
    $(".settingsOpen").toggleClass("rotate90"); // This line toggles the class rotate on elements with the class settingsOpen
  });
});

$("#modalAbout").on("click", () => {
  $(".blackBack").css("display", "block");
  $(".youNeedIs").css("display", "flex");
});
$("#closeModalThis").on("click", () => {
  $(".blackBack").css("display", "none");
  $(".youNeedIs").css("display", "none");
});
$(document).on("click", ".topInfoExpiriensItem", function () {
  $(this).parent().find(".middleInfoExp").toggle();

  $(this).find(".MyVacExp").toggleClass("boldEn");
  $(this).find(".titleCompanyExp").toggleClass("boldEn");
  $(this).find(".timeJobAndShowAll").find(".TimeJob").toggleClass("boldEn");

  $(this)
    .find(".timeJobAndShowAll")
    .find(".expand")
    .find(".rotatePls")
    .toggleClass("rotate180");
});

navigator.serviceWorker.register("/js/sw.js").then(async (registration) => {
  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    return await registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey:
          "BBmnshdtouYvNTxdUOjorAyXcbmqoyvneglwYM1rFDgWUkshIyjUO2h8pFD5ADvWXeE6IIs0A3KyMtiZVV7DNVM",
      })
      .then((newSubscription) => {
        sendSubscriptionToServer(newSubscription);
        localStorage.setItem("subscription", JSON.stringify(newSubscription));
      });
  } else {
    return false;
  }
});

function sendSubscriptionToServer(subscription) {
  fetch("/notification/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "Content-Type": "application/json",
      authorization: "whaud 1y82e 12et7gyqwdt7aywd awy",
    },
  });
}
