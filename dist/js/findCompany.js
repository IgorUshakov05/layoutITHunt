let data = {
  inn: 0,
  img: "",
};

let result = [];
document.getElementById("nameCompany").addEventListener(
  "input",
  (function () {
    let timeoutId;
    let lastValue = "";

    return async function () {
      try {
        const value = this.value;
        clearTimeout(timeoutId);

        if (value.length >= 3 && value !== lastValue) {
          timeoutId = setTimeout(async () => {
            lastValue = value;

            const response = await fetch("/api/invite-company", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "augwod89h1h9awdh9py0y82hjd",
              },
              body: JSON.stringify({ text: value }),
            });
            const obj = await response.json();
            console.log(obj);

            if (!obj.success) {
              document.querySelector(".companyForSelect").style.display =
                "none";
              document
                .getElementById("nameCompany")
                .classList.remove("hasList");
              return;
            }
            const companyList = document.querySelector(".companyForSelect");
            companyList.innerHTML = ""; // Очищаем предыдущие результаты

            obj.data.forEach((company) => {
              let item = `
                 <li class="padding10 clickSelect">
                                <div class="infoSelectCOmpany">
                                    <div class="groupInfo">
                
                                       <div class="picCompany">
                                    <img width="39" height="39" src="${company.avatar}" alt="">
                                </div>
                                <div class="titleCompanyAndINN">
                                    <h1 class="companyTitle">${company.title}</h1>
                                    <p class="inn">${company.INN}</p>
                                </div>
                            </div>
                            <div class="canelSelect">
                                <span class="selectNo seleced" data-id="${company.INN}">Выбрать</span>
                            </div>
                            </div> 
                            </li>`;

              companyList.insertAdjacentHTML("beforeend", item);
            });
            result = obj.data;
            companyList.style.display = "block";
            document.getElementById("nameCompany").classList.add("hasList");
          }, 2000);
        } else {
          const companyList = document.querySelector(".companyForSelect");
          companyList.style.display = "none";
          companyList.innerHTML = ""; // Очищаем список, если введено меньше 3 символов
          document.getElementById("nameCompany").classList.remove("hasList");
        }
      } catch (e) {
        console.log(e);
      }
    };
  })()
);

// Используйте делегирование событий для обработки клика на динамически добавленных элементахF
$(document).on("click", ".seleced", function () {
  const companyTitle = $(this).closest("li").find(".companyTitle").text(); // Получаем текст заголовка компании
  const inn = $(this).attr("data-id"); // Получаем текст ИНН
  const src = $(this).closest("li").find(".picCompany img").attr("src"); // Получаем значение атрибута src изображения

  console.log(companyTitle, inn, src); // Выводим результат в консоль
  data.inn = inn;
  data.img = src;
  $(".bigBox").append(`
    <div class="specialisationSelectInput selecteCompany"  style="margin-top: 12px;">
                            <div class="infoSelectCOmpany">
                                <div class="groupInfo">
                                
                                   <div class="picCompany">
                                <img width="39" height="39" src="${src}" alt="Выбранная компания">
                                </div>
                                <div class="titleCompanyAndINN">
                                <h1 class="companyTitle">${companyTitle}</h1>
                                <p class="inn">${inn}</p>
                                </div>
                                </div>
                                <div class="canelSelect">
                                <span class="selectNo">Отменить</span>
                                </div>
                                </div> 
                        </div>
                        `);
  $(".grupAbsolute").toggle();
  $(".companyForSelect").css("display", "none");
  $("#nameCompany").val(""); // Присвоение значения полю ввода
  $("#toTwoStage").removeAttr("disabled");
});

$("#bigBox").on("click", ".selectNo", () => {
  $(".grupAbsolute").toggle();
  $("#toTwoStage").attr("disabled", true);
  data.inn = 0;
  data.img = "";
  $(".selecteCompany").remove();
});

$("#toTwoStage").on("click", async () => {
  if (data.inn == 0) {
    return false;
  } else {
    let { success, message } = await request();
    if (!success) return alert(message);
    $(".here").attr("href", data.img);
    $(".windowFinally").css("display", "flex");
    $(".data").css("height", "0").css("overflow", "hidden");
    $(".createCompanyMain")
      .css("background", "#5412E0")
      .css("box-shadow", "none");
    $(".addOrg").css("color", "white");
  }
});

let request = async () => {
  let fetching = await fetch("/api/invite-company-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "augwod89h1h9awdh9py0y82hjd",
    },
    body: JSON.stringify({ companyId: data.inn }), // Передаем JSON в теле запроса
  });
  let response = await fetching.json();
  console.log(response);
  return response;
};
