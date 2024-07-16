const switchTypeDate = document.getElementById("switchTypeDate"); //Срок слова
let srokTitle = document.getElementById("srokTitle");
let termValue = document.querySelector(".termValue"); //Срок
let jobTitle = document.getElementById("jobTitle"); //Должность
let companytitle = document.getElementById("companytitle"); //Компания
let descriptJob = document.getElementById("descriptJob"); //Описание
let sendMyExp = document.getElementById("sendMyExp"); // Кнопка отправки

let newExJob = {
  special: null,
  company: null,
  typeData: "y",
  date: 1,
  description: null,
};

function validateForm() {
  const { special, company, date, description } = newExJob;
  // Проверяем, что все поля заполнены и соответствуют условиям
  if (
    special &&
    special.length <= 60 &&
    company &&
    company.length <= 60 &&
    description &&
    description.length <= 1000 &&
    date &&
    date.toString().length <= 2
  ) {
    sendMyExp.disabled = false; // Включаем кнопку
    return true;
  } else {
    sendMyExp.disabled = true; // Отключаем кнопку
    return false;
  }
}

jobTitle.addEventListener("input", function (e) {
  let value = e.target.value;
  if (value.length >= 60) {
    this.style.borderColor = "red";
    this.value = value.slice(0, -1);
    return;
  }
  this.style.borderColor = "black";
  newExJob.special = value;
  validateForm();
});

companytitle.addEventListener("input", function (e) {
  let value = e.target.value;

  if (value.length > 60) {
    this.style.borderColor = "red";
    this.value = value.slice(0, 60);
    return;
  }

  if (value.length < 60) {
    this.style.borderColor = "black";
  }

  newExJob.company = value;
  validateForm();
});

descriptJob.addEventListener("input", function (e) {
  let value = e.target.value;

  if (value.length > 1000) {
    this.style.borderColor = "red";
    this.value = value.slice(0, 1000);
    return;
  }

  if (value.length < 1000) {
    this.style.borderColor = "black";
  }

  newExJob.description = value;
  validateForm();
});

switchTypeDate.addEventListener("click", () => {
  newExJob.typeData = newExJob.typeData === "m" ? "y" : "m";
  termValue.innerHTML = getEnding(newExJob.date, newExJob.typeData);
});

srokTitle.addEventListener("input", function (e) {
  let value = e.target.value;
  if (value.length >= 3) {
    this.style.borderColor = "red";
    document.querySelector(".setTerm").style.borderColor = "red";
    this.value = value.slice(0, -1);
    return;
  }
  this.style.borderColor = "black";
  document.querySelector(".setTerm").style.borderColor = "black";
  newExJob.date = value;
  termValue.innerHTML = getEnding(newExJob.date, newExJob.typeData);
  validateForm();
});

function getEnding(date, type) {
  if (type === "y") {
    return date % 10 === 1 && date % 100 !== 11
      ? "год"
      : date % 10 >= 2 && date % 10 <= 4 && (date % 100 < 12 || date % 100 > 14)
      ? "года"
      : "лет";
  } else {
    return date % 10 === 1 && date % 100 !== 11
      ? "месяц"
      : date % 10 >= 2 && date % 10 <= 4 && (date % 100 < 12 || date % 100 > 14)
      ? "месяца"
      : "месяцев";
  }
}

descriptJob.addEventListener("paste", function (e) {
  e.preventDefault();
  const pastedText = e.clipboardData.getData("text");
  if (pastedText.length > 1000) {
    const truncatedText = pastedText.slice(0, 1000);
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
  newExJob.description = this.value;
  validateForm();
});

companytitle.addEventListener("paste", function (e) {
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
  newExJob.company = this.value;
  validateForm();
});

srokTitle.addEventListener("paste", function (e) {
  e.preventDefault();
  const pastedText = e.clipboardData.getData("text");
  let textToInsert = pastedText;
  if (pastedText.length > 2) {
    textToInsert = pastedText.slice(0, 2);
  }
  this.value =
    this.value.slice(0, this.selectionStart) +
    textToInsert +
    this.value.slice(this.selectionEnd);
  newExJob.date = this.value;
  validateForm();
});

jobTitle.addEventListener("paste", function (e) {
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
  newExJob.special = this.value;
  validateForm();
});

sendMyExp.addEventListener("click", () => {
  sendMyExp.disabled = true;
  let valid = validateForm();
  if (!valid) {
    return false;
  }
  fetch("/api/set_exp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "augwod89h1h9awdh9py0y82hjd",
    },
    body: JSON.stringify(newExJob),
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
      success(obj.result);
    });
});
function escapeHtml(unsafe) {
  return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
}
const success = (data) => {
  let template = `<div class="expiriensItem">
                    <div class="topInfoExpiriensItem">
                        <p class="MyVacExp">
    ${escapeHtml(data.special)}

                        </p>
                        <p class="titleCompanyExp">
${escapeHtml(data.company)}
                        </p>
                        <div class="timeJobAndShowAll">
                            <p class="TimeJob">${data.date} ${getEnding(
    data.date,
    data.typeData
  )}</p>
                            <div class="expand"><svg class="rotatePls" width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.920898 1L6.93536 7L12.9498 1" stroke="#5412E0" stroke-width="2"/>
</svg>
</div>
                            </div>
                        </div>
                        <div class="middleInfoExp"> 
                            <pre class="decriptMyLazzy">
                            ${escapeHtml(data.description)}</pre>
                            <div class="bottomElementExp">
                                <p class="TimeJob">${data.date} ${getEnding(
    data.date,
    data.typeData
  )}</p>
                                <div class="buttonsEditAndDelete">
                                    <button class="removeExp" data-id=${
                                      data.id
                                    }>Удалить</button>
                                    </div>
                                </div>
                            </div> 
                            
                    </div>`;
  document
    .getElementById("parentForExp")
    .insertAdjacentHTML("beforeend", template);
    addExpiriensModal.close();
    companytitle.value = ''
    descriptJob.value = ''
    jobTitle.value = ''
    srokTitle.value = ''
    newExJob = {
      special: null,
      company: null,
      typeData: "y",
      date: 1,
      description: null,
    };
    $(".blackBack").css("display", "none");
};

const errors = () => {
  srokTitle.style.borderColor = "red";
  descriptJob.style.borderColor = "red";
  companytitle.style.borderColor = "red";
  jobTitle.style.borderColor = "red";
  switchTypeDate.style.borderColor = "red";
};

const successDel = (id) => {
  let button = document.querySelector(`button[data-id="${id}"]`);
  if (button) {
    let targetElement = button.closest('.expiriensItem');
    if (targetElement) {
      targetElement.remove();
      console.log('Элемент удален:', targetElement); // Выводим удаленный элемент
    } else {
      console.log('Элемент с классом expiriensItem не найден');
    }
  } else {
    console.log('Кнопка с data-id не найдена');
  }
};

document.addEventListener('click', function(event) {
  // Проверяем, что кликнули по элементу с классом 'removeExp'
  if (event.target.classList.contains('removeExp')) {
    // Получаем значение атрибута 'data-id' элемента, на котором был совершен клик
    let id = event.target.getAttribute('data-id');
    console.log(id);
    fetch("/api/del_exp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "augwod89h1h9awdh9py0y82hjd",
      },
      body: JSON.stringify({id}),
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
        successDel(id);
      });
  }
});