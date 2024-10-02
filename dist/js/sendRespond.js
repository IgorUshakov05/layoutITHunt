let message = document.getElementById("message");
let button = document.getElementById("send");
button.setAttribute("disabled", "disabled");
const data = {
  id: window.location.href.split("/").reverse()[0],
  message: null,
};
let sendRespond = async () => {
  return await fetch("/api/respond-vacancy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "augwod89h1h9awdh9py0y82hjd",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

message.addEventListener("input", function (e) {
  let value = e.target.value;
  if (value === "") {
    button.setAttribute("disabled", "disabled");
    return false;
  }
  if (value.length > 1500) {
    button.setAttribute("disabled", "disabled");
    alert("Сообщение слишком длинное. Максимальная длина 1500 символов.");
    return false;
  }
  button.removeAttribute("disabled");
  data.message = value;
});

button.addEventListener("click", sendRespond);
