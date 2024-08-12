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
const sendMyCode = document.getElementById("sendMyCode");
const firstStapButton = document.getElementById("nextOne");

const finish = document.getElementById("last");
const firstScreen = document.getElementById("firstScreen");
const emailPlace = document.getElementById("emailPlace");
const sendCode = document.getElementById("nextOneGetCode");
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validatePassword(password) {
  const regex = /^(?=.*[A-Za-z]).{6,}$/;
  if (regex.test(password)) {
    document.getElementById("password-error-message").style.display = "none";
    return true;
  }
  document.getElementById("password-error-message").style.display = "block";
  return false;
}
function validatePasswords() {
  const password = data.password;
  const reply_password = data.reply_password;
  const isCheckboxChecked = document.getElementById("true").checked;

  if (
    validatePassword(password) &&
    validatePassword(reply_password) &&
    password === reply_password &&
    isCheckboxChecked
  ) {
    finish.removeAttribute("disabled");
  } else {
    finish.setAttribute("disabled", "");
  }
}

function validatePassword(password) {
  const regex = /^(?=.*[A-Za-z]).{6,}$/;
  if (regex.test(password)) {
    document.getElementById("password-error-message").style.display = "none";
    return true;
  }
  document.getElementById("password-error-message").style.display = "block";
  return false;
}

replypassword.addEventListener("input", function (e) {
  let value = e.target.value.trim();
  if (!value) {
    data.reply_password = "";
    validatePasswords();
    return;
  }
  if (validatePassword(value)) {
    data.reply_password = value;
  } else {
    data.reply_password = ""; // Обнуляем пароль, если он не проходит валидацию
  }
  validatePasswords();
});

password.addEventListener("input", function (e) {
  let value = e.target.value.trim();
  if (!value) {
    data.password = "";
    validatePasswords();
    return;
  }
  if (validatePassword(value)) {
    data.password = value;
  } else {
    data.password = ""; // Обнуляем пароль, если он не проходит валидацию
  }
  validatePasswords();
});

document.getElementById("true").addEventListener("change", function (e) {
  validatePasswords();
});

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

firstStapButton.addEventListener("click", () => {
  firstScreen.remove();
  document.getElementById("emailPlace").style.height = "auto";
});

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
  let value = e.target.value.trim();
  if (!value) {
    data.reply_password = "";
    validatePasswords();
    return;
  }
  if (validatePassword(value)) {
    data.reply_password = value;
  } else {
    data.reply_password = ""; // Обнуляем пароль, если он не проходит валидацию
  }
  validatePasswords();
});

password.addEventListener("input", function (e) {
  let value = e.target.value.trim();
  if (!value) {
    data.password = "";
    validatePasswords();
    return;
  }
  if (validatePassword(value)) {
    data.password = value;
  } else {
    data.password = ""; // Обнуляем пароль, если он не проходит валидацию
  }
  validatePasswords();
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
  sendCode.setAttribute("disabled", "");
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
        document.getElementById("codeInputs").style.height = "auto";
      }
      return response.json();
    })
    .catch(() => {
      document.getElementById("errorEmailSend");
      return (document.getElementById("errorEmailSend").innerText = "Ошибка");
    })
    .finally(() => {
      sendCode.removeAttribute("disabled");
    });
}

sendMyCode.addEventListener("click", verefyMailFetch);
function verefyMailFetch() {
    if(verefyMail.code === '' || verefyMail.code === undefined) {
        makeColor("red", "square");
        setTimeout(() => {
          makeColor("black", "square");
        }, 1000);
    }
  sendMyCode.setAttribute("disabled", "");
  fetch("/api/accept_code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "augwod89h1h9awdh9py0y82hjd",
    },
    body: JSON.stringify({
      mail: verefyMail.mail.trim(),
      codeUser: Number(verefyMail.code),
    }),
  })
    .then((obj) => {
      if (obj.status === 202) {
        makeColor("green", "square");
        setTimeout(() => {
          document.getElementById("theerdStap").style.height = "auto";
          return document.getElementById("codeInputs").remove();
        }, 1000);
      } else {
        makeColor("red", "square");
        setTimeout(() => {
        sendMyCode.removeAttribute("disabled");

          makeColor("black", "square");
        }, 1000);
      }
    })
    .catch(() => {
      makeColor("red", "square");
      sendMyCode.removeAttribute("disabled");
      setTimeout(() => {
        makeColor("black", "square");
      }, 1000);
    });
}

const makeColor = (color, className) => {
  let elements = document.querySelectorAll(`.${className}`);
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.border = `1px solid ${color}`;
    elements[i].style.color = color;
  }
};

finish.addEventListener("click", () => {
  finish.setAttribute('disabled', '');
  fetch("/api/registration", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "augwod89h1h9awdh9py0y82hjd",
    },
    body: JSON.stringify(data),
  }).then((obj) => {
    if (obj.status === 200) {
      return (window.location.href = "/");
    } else if (obj.status === 400)
      return (window.location.href = "/login?error=3");
  }).finally(() => {
    finish.removeAttribute('disabled');
  });
});
