$(".removeMySkill").on("click", () => {
  $(".mySkills").hide();
  $(".d-none").show();
});

const sendSkillsToProfile = document.getElementById("sendSkillsToProfile");
let deletes = [];
$(document).on("click", ".canelSkillDelete > li", function (e) {
  console.log(this.innerText, deletes);
  deletes.push(this.innerText);
  this.remove();
});


let save = document.getElementById('save')
save.addEventListener('click', () => {
  if(!deletes.length) {
    return false
  }

  fetch(`/api/setSkills`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "augwod89h1h9awdh9py0y82hjd",
    },
    body: JSON.stringify({ skills:deletes }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data) {
        window.location.reload();
      }
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
})
sendSkillsToProfile.addEventListener("click", () => {
  fetch(`/api/setSkills`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "augwod89h1h9awdh9py0y82hjd",
    },
    body: JSON.stringify({ skills: dataUser.userSkills }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data) {
        window.location.reload();
      }
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
let findSkill = document.getElementById("findSkill");
$(".canelSkill").on("click", () => {
  $(".mySkills").show();
  $(".d-none").hide();
  while (deletes.length > 0) {
    const item = deletes.shift();
    $('.canelSkillDelete').append(`<li>${item}</li>`);
}
});
let dataUser = {
  userSkills: [],
};
let timeoutId; // Переменная для хранения ID таймаута
let skills = [];
findSkill.addEventListener("input", async function (e) {
  clearTimeout(timeoutId); // Очищаем предыдущий таймаут
  let value = e.target.value.trim();
  timeoutId = setTimeout(async () => {
    // Запускаем таймаут
    if (!value.length) {
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

      // Обновляем UI, используя полученные данные
      // Например:
      if (!data.items) {
        return;
      }
      data.items.map((item) => {
        if (!skills.includes(item)) {
          skills.push(item);
        }
      });

      $(".listSelectSkills").html(
        data.items
          .map((item) => `<li class="selectSkill">${item.text}</li>`)
          .join("")
      );
      $(".selectSkills").show();
      $(".listSelectSkills").show();
    } catch (error) {
      console.error("Error:", error);
      $(".selectSkills").hide();
      $(".listSelectSkills").hide();
    }
  }, 500); // Задержка в 500 мс
});

$(document).on("click", ".selectSkill", function (e) {
  console.log(this.innerText);
  const found = skills.find((skill) => skill.text === this.innerText);
  if (!found) {
    window.location.reload();
    return false;
  }

  dataUser.userSkills.push({ title: this.innerText });

  dataUser.userSkills = Array.from(
    new Set(dataUser.userSkills.map((item) => JSON.stringify(item)))
  ).map((item) => JSON.parse(item));

  $(".selectSkills").hide();
  $(".listSelectSkills").hide();
  $(".listAddingSkill").html(
    dataUser.userSkills
      .map((item) => `<li class="listAddingSkillItem">${item.title}</li>`)
      .join("")
  );
  findSkill.value = "";
});

$(document).on("click", ".listAddingSkillItem", function (e) {
  const skillTitle = $(this).text(); // Получаем название навыка
  console.log(skillTitle);
  dataUser.userSkills = dataUser.userSkills.filter((item) => {
    return item.title !== skillTitle; // Фильтрация списка навыков
  });
  $(".listAddingSkill").html(
    dataUser.userSkills
      .map((item) => `<li class="listAddingSkillItem">${item.title}</li>`)
      .join("")
  ); // Обновляем список навыков
});



$(".onClick").on("click", function () {
  $(this).find(".myListOnClick").toggle();
  $(this).find(".rot").toggleClass("rotate180");
});

const addExpiriensModal = document.getElementById("addExpiriens");
const closeAddExpiriens = document.getElementById("closeAddExpiriens");
const openAddExpiriendModal = document.getElementById("openAddExpiriendModal");

closeAddExpiriens.addEventListener("click", () => {
  addExpiriensModal.close();
  $(".blackBack").css("display", "none");
});

openAddExpiriendModal.addEventListener("click", () => {
  $(".blackBack").css("display", "block");
  addExpiriensModal.show();
});

const addSkillButton = document.getElementById("addSkillButton");
const closeSkillModal = document.getElementById("closeSkillModal");
const addSkill = document.getElementById("addSkill");

closeSkillModal.addEventListener("click", () => {
  addSkill.close();
  dataUser.userSkills = [];
  $(".youNeedIs").show();
  $(".listAddingSkill").html("");
  $(".blackBack").css("display", "none");
});

addSkillButton.addEventListener("click", () => {
  $(".blackBack").css("display", "block");
  $(".youNeedIs").hide();
  addSkill.show();
});

const addEdButton = document.getElementById("addEdButton");
const closeEduModal = document.getElementById("closeEduModal");
const addEuctionModal = document.getElementById("addEuctionModal");

closeEduModal.addEventListener("click", () => {
  addEuctionModal.close();
  $(".blackBack").css("display", "none");
});

addEdButton.addEventListener("click", () => {
  $(".blackBack").css("display", "block");
  addEuctionModal.show();
});

$(".eduSchool").on("click", function () {
  $(this).find(".paddAndBor").toggleClass("activeRm");
});

$(".butForSelectEdu").on("click", function () {
  $(".listEduRus").toggle();
  $(this).children("svg").toggleClass("rotate180");
});
