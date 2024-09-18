const getAlltarrif = document.querySelectorAll(".itemCountSpec");
const titleInput = document.getElementById("titleCompany");
const descriptionInput = document.getElementById("descriptionCompany");
const buttonSave = document.getElementById("sendChange");
let dataCompany = {
  title: null,
  description: null,
  count: null,
  avatar: null,
};

const symbols = document.getElementById("teap");
titleInput.addEventListener("input", function (e) {
  let value = e.target.value;
  this.value = value.slice(0, 249);
  dataCompany.title = value;
});

descriptionInput.addEventListener("input", function (e) {
  let value = e.target.value;
  this.value = value.slice(0, 249);
  symbols.innerText = `Осталось символов ${250 - value.length}`;
  dataCompany.description = value;
});

const sendAvatar = async () => {
  if (!formData.has("company")) return false;

  try {
    const response = await fetch(`${window.conf.FILE_SERVER}/upload/company`, {
      method: "POST",
      headers: {
        Authorization: "ILOVEPORN",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed.");
    }

    const dataSERV = await response.json();
    console.log(dataSERV);
    return dataSERV;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Пробрасываем ошибку дальше
  }
};

async function sendUpdateData() {
  if (
    formData.has("company") === false &&
    dataCompany.title === null &&
    dataCompany.count === null &&
    dataCompany.description === null
  ) {
    return [null, false];
  }
  let sendAvatarOfCompany;
  // Пытаемся отправить аватар, если он есть
  if (formData.has("company")) {
    sendAvatarOfCompany = await sendAvatar();
  }

  if (sendAvatarOfCompany === false || !formData.has("company")) {
    dataCompany.avatar = null;
  } else {
    dataCompany.avatar = sendAvatarOfCompany.title;
  }

  // Отправляем данные компании
  let sendData = await fetch("/api/update-company", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "augwod89h1h9awdh9py0y82hjd",
    },
    body: JSON.stringify(dataCompany),
  });
  let toJson = await sendData.json();
  await console.log(toJson);
  return [toJson.INN, toJson.success, toJson.message];
}

let formData = new FormData();
for (const item of getAlltarrif) {
  item.addEventListener("click", function (e) {
    for (const i of getAlltarrif) {
      i.classList.remove("active");
    }
    this.classList.add("active");
    dataCompany.count = parseInt(this.dataset.count);
  });
}

const imageUpload = document.getElementById("imageUpload");
const backgroundImage = document.querySelector(".leftFishPhoto");
buttonSave.addEventListener("click", async function (e) {
  let [inn, status, message] = await sendUpdateData();
  console.log(inn, status);
  if (!inn || !status) return false;
  window.location.href = `/company/${inn}`;
});
imageUpload.addEventListener("change", function (event) {
  const file = event.target.files[0];
  // Проверяем, является ли файл изображением
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    formData.append("company", file);
    reader.onload = function (e) {
      backgroundImage.style.backgroundImage = `url(${e.target.result})`;
      backgroundImage.style.backgroundSize = "cover";
    };
    reader.readAsDataURL(file);
  }
});
