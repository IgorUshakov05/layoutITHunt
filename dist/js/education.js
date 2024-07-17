let addCourse = document.getElementById("addCurse");
let sendJobTitle = document.getElementById("sendEduData");
$(".typeEdu").on("click", function (e) {
  let value = $(this).text();
  newEdu.type = value;
  $(".listEduRus").toggle();
  document.querySelector(".titleEdu").innerText = value;
  $(".butForSelectEdu").children("svg").toggleClass("rotate180");
  validateFormEdu();
});
let newEdu = {
  type: "Профессиональное образование",
  course: undefined,
};

function validateFormEdu() {
  const { course, type } = newEdu;
  if (
    course &&
    course.length <= 60 &&
    course.length >= 5 &&
    (type === "Профессиональное образование" ||
      type === "Общее образование" ||
      type === "Дополнительное образование" ||
      type === "Профессиональное обучение")
  ) {
    sendJobTitle.disabled = false; // Включаем кнопку
    return true;
  } else {
    sendJobTitle.disabled = true; // Отключаем кнопку
    return false;
  }
}

addCourse.addEventListener("paste", function (e) {
  e.preventDefault();
  const pastedText = e.clipboardData.getData("text");
  if (pastedText.length > 60) {
    const truncatedText = pastedText.slice(0, 60);
    this.value =
      this.value.slice(0, this.selectionStart) +
      truncatedText +
      this.value.slice(this.selectionEnd);
  } else {
    this.value =
      this.value.slice(0, this.selectionStart) +
      pastedText +
      this.value.slice(this.selectionEnd);
  }
  newEdu.course = this.value;
  validateFormEdu();
});

addCourse.addEventListener("input", function (e) {
  let value = e.target.value;

  if (value.length > 60) {
    this.style.borderColor = "red";
    this.value = value.slice(0, 60);
    return;
  }

  if (value.length < 60) {
    this.style.borderColor = "black";
  }

  newEdu.course = this.value;
  validateFormEdu();
});

sendJobTitle.addEventListener("click", async () => {
  let isValid = await validateFormEdu();
  if (!isValid) {
    return false;
  }
  sendJobTitle.disabled = true; // Включаем кнопку
  fetch("/api/set_edu", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "augwod89h1h9awdh9py0y82hjd",
    },
    body: JSON.stringify(newEdu),
  })
    .then((obj) => {
      if (obj.status === 201) {
        return obj;
      }
      return error();
    })
    .then((obj) => obj.json())
    .then((obj) => {
      successEdu(obj.result);
      console.log(obj);
    })
    .catch((e) => error());
});

const error = () => {
  document.querySelector(".selectedEdu").style.borderColor = "red";
  addCourse.style.borderColor = "red";
  sendJobTitle.disabled = true; // Включаем кнопку
  setTimeout(() => {
    document.querySelector(".selectedEdu").style.borderColor = "#5412E0";
    addCourse.style.borderColor = "black";
  }, 500);
};

let successEdu = (data) => {
  addCourse.value = "";
  sendJobTitle.disabled = true;
  document.getElementById("addEuctionModal").close();
  $(".blackBack").css("display", "none");
  newEdu = {
    type: "Профессиональное образование",
    course: undefined,
  };

  let template = `
    <div class="eduSchool clickNoEdu">
        <div class="removeEdu">
            <p class="rmText" data-id="${data.id}">Удалить</p>
        </div>
        <p class="educationalInstitution">${data.type}</p>
        <p class="educationalInstitutionType">${data.course}</p>
        <button class="rmText paddAndBor" data-id="${data.id}">Удалить</button>
    </div>`;
    document
    .getElementById("parentEdu")
    .insertAdjacentHTML("beforeend", template);
};

const successDelEdu = (id) => {
  let button = document.querySelector(`button[data-id="${id}"]`);
  if (button) {
    let targetElement = button.closest(".eduSchool");
    if (targetElement) {
      targetElement.remove();
      console.log("Элемент удален:", targetElement); // Выводим удаленный элемент
    } else {
      console.log("Элемент с классом expiriensItem не найден");
    }
  } else {
    console.log("Кнопка с data-id не найдена");
  }
};

$(document).on("click", ".rmText", function () {
  let id = $(this).data("id");
  fetch("/api/del_edu", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "augwod89h1h9awdh9py0y82hjd",
    },
    body: JSON.stringify({ id }),
  })
    .then((obj) => {
      console.log(obj.status);
      if (obj.status === 401) {
        return (window.location.href = "/login");
      }
      if (obj.status === 400) {
        errors();
        return (window.location.href = "/login");
      }
      if (obj.status === 201) {
        sendMyExp.disabled = false;
        return obj.json();
      }
    })
    .then((obj) => {
      console.log(obj);
      successDelEdu(id);
    });
});
