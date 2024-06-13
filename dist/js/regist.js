const surname = document.getElementById("surname");
const lastname = document.getElementById("lastname");
const dateInput = document.getElementById("date");
const role = document.getElementsByClassName("select");
const email = document.getElementById("email");
let code = document.getElementById("codeVery");
const password = document.getElementById("password");
const replypassword = document.getElementById("replypassword");
const buttonGetCode = document.getElementById("nextOneGetCode");
const inputs = document.querySelectorAll(".square-input");
//Кноки для перехода на этапы
const sendMyCode = document.getElementById('sendMyCode')
const firstStapButton = document.getElementById("nextOne");

const firstScreen = document.getElementById("firstScreen");
const emailPlace = document.getElementById("emailPlace");
const sendCode = document.getElementById("nextOneGetCode");
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validateFirstStap() {
  if (
    data.surname.length >= 2 &&
    data.name.length >= 2 &&
    data.birthDay.length === 10 &&
    data.role.length >= 2
  ) {
    firstStapButton.removeAttribute("disabled");
    console.log("Заполнено");
    return true;
  }
  firstStapButton.setAttribute("disabled", "");
  console.log("Не заполнено");
  return false;
}

firstStapButton.addEventListener('click',() => {
    firstScreen.remove()
})

let data = {
  surname: "",
  name: "",
  birthDay: "",
  role: "",
  password: "",
  reply_password: "",
  mail: "",
};
let verefyMail = {};
email.addEventListener("input", function (e) {
  const value = e.target.value.trim();
  data.mail = value;
  verefyMail.mail = value;
  if (validateEmail(value)) {
    buttonGetCode.removeAttribute("disabled");
  } else {
    buttonGetCode.setAttribute("disabled", "");
  }
});

replypassword.addEventListener("input", function (e) {
  data.reply_password = e.target.value.trim();
});

password.addEventListener("input", function (e) {
  data.password = e.target.value.trim();
});

lastname.addEventListener("input", function (e) {
  let value = e.target.value.trim();
  if (!value) {
    data.surname = "";
    validateFirstStap();
    return;
  }
  data.surname = value[0].toUpperCase() + value.slice(1).toLowerCase();
  validateFirstStap();
  console.log(data);
});

surname.addEventListener("input", function (e) {
  let value = e.target.value.trim();
  if (!value) {
    data.name = "";
    validateFirstStap();
    return;
  }
  data.name = value[0].toUpperCase() + value.slice(1).toLowerCase();
  validateFirstStap();
});

dateInput.addEventListener("input", function (e) {
  let value = e.target.value.trim();
  if (!value) {
    data.birthDay = "";
    validateFirstStap();
    return;
  }
  data.birthDay = value.split("-").reverse().join("-");
  validateFirstStap();
});

document.getElementById("worker").addEventListener("click", function (e) {
  data.role = e.target.value.trim();
  validateFirstStap();
});
document.getElementById("creatorWork").addEventListener("click", function (e) {
  data.role = e.target.value.trim();
  validateFirstStap();
});

code.addEventListener("input", function (e) {
  let box = document.getElementsByClassName("square");
  let value = e.target.value.trim();
  if (value.length >= 7) {
    this.value = "";
    value = "";
    for (let i = 0; i < box.length; i++) {
      box[i].innerText = "";
    }
  }
  for (let i = 0; i < value.length; i++) {
    box[i].innerText = value[i];
  }
  verefyMail.code = value;
});

code.addEventListener("keydown", function (e) {
  if (e.key === "Backspace" || e.key === "Delete") {
    let box = document.getElementsByClassName("square");
    for (let i = box.length - 1; i >= 0; i--) {
      if (box[i].innerText !== "") {
        box[i].innerText = "";
        break;
      }
    }
  }
});
sendCode.addEventListener("click", post_verefy);
function post_verefy() {
  email.value = "";
  fetch("/api/post_verefy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "augwod89h1h9awdh9py0y82hjd",
    },
    body: JSON.stringify({ mail: verefyMail.mail.trim(), username: "Игорь" }),
  })
    .then((response) => {
      console.log(response.status);
      if (response.status === 200 || response.status === 409) {
        emailPlace.remove();
      }
      return response.json();
    })
    .catch(() => {
      document.getElementById("errorEmailSend");
      return (document.getElementById("errorEmailSend").innerText = "Ошибка");
    });
}

sendMyCode.addEventListener('click',verefyMailFetch)
function verefyMailFetch() {
  fetch("/api/accept_code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "augwod89h1h9awdh9py0y82hjd",
    },
    body: JSON.stringify(verefyMail),
  })
    .then((obj) => obj.json())
    .then((obj) => {
      return (document.getElementById("notCode").innerText = obj.message);
    })
    .catch(() => {
      return (document.getElementById("notCode").innerText =
        "Произошла ошибка");
    });
}
