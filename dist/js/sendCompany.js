const firstStage = document.querySelector(".createOne");
const secondStage = document.querySelector(".createTwo");
const lastStage = document.querySelector(".createThree");

// Кнопки переключения
const toSecondStageBtn = document.getElementById("toTwoStage");
const toThirdStageBtn = document.getElementById("toThreeStage");
const finalyStage = document.getElementById("finaly");
// Действия кнопок
toSecondStageBtn.addEventListener("click", () => {
  firstStage.style.display = "none";
  secondStage.style.display = "block";
});
toThirdStageBtn.addEventListener("click", () => {
  secondStage.style.display = "none";
  lastStage.style.display = "block";
});
let aprove = false;
const data = {
  title: "",
  INN: "",
  description: "",
  companyICON: "",
  countStaffs: null,
};
const formData = new FormData();
const formData1 = new FormData();
// Валидация этапов
function firstStageValidation() {
  if (
    data.title.length >= 3 &&
    data.title.length <= 250 &&
    data.INN.length <= 20 &&
    data.INN.length >= 9 &&
    data.description.length >= 5 &&
    data.description.length <= 250 &&
    formData.has("company")
  ) {
    toSecondStageBtn.removeAttribute("disabled");
    return true;
  }
  toSecondStageBtn.setAttribute("disabled", "");
  return false;
}

function secondStageValidation() {
  if (
    formData1.has("registration") &&
    formData1.has("NU") &&
    formData1.has("listWrite") &&
    aprove
  ) {
    toThirdStageBtn.removeAttribute("disabled");
    return true;
  }
  toThirdStageBtn.setAttribute("disabled", "");
  return false;
}
document.getElementById("accept").addEventListener("click", () => {
  aprove = !aprove;
  secondStageValidation();
});
// Inputs
const title = document.getElementById("nameCompany");
title.addEventListener("input", (e) => {
  let value = e.target.value;
  if (value.length > 250) {
    title.value = value.slice(0, 250);
    return;
  }
  data.title = value.trim();
  firstStageValidation();
});

const innCompany = document.getElementById("innCompany");
innCompany.addEventListener("input", (e) => {
  let value = e.target.value;
  if (value.length > 20) {
    innCompany.value = value.slice(0, 20);
    return;
  }
  data.INN = value.trim();
  firstStageValidation();
});

const descriptionCompany = document.getElementById("descriptionCompany");
const count = document.getElementById("reminder");
descriptionCompany.addEventListener("input", (e) => {
  let value = e.target.value;
  if (value.length > 250) {
    descriptionCompany.value = value.slice(0, 250);
    count.innerText = "Осталось символов: 0";
    return;
  }
  count.innerText = `Осталось символов: ${250 - value.length} `;
  data.description = value.trim();
  firstStageValidation();
});

// Избражения
const imageUpload = document.getElementById("imageUpload");
const leftFishPhoto = document.querySelector(".leftFishPhoto");

let uploadedImage = null; // Переменная для хранения загруженного изображения

imageUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  formData.delete("company");
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Создаем объект Image для обработки изображения
      const img = new Image();
      img.onload = () => {
        // Вычисляем минимальное значение ширины и высоты
        const minDimension = Math.min(img.width, img.height);
        // Создаем новое Canvas для обработки изображения
        const canvas = document.createElement("canvas");
        canvas.width = minDimension;
        canvas.height = minDimension;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, minDimension, minDimension); // Рисуем изображение на Canvas
        leftFishPhoto.innerHTML = "";
        // Сохраняем обработанное изображение
        uploadedImage = canvas.toDataURL();

        // Устанавливаем фон для .leftFishPhoto
        leftFishPhoto.style.backgroundImage = `url(${uploadedImage})`;
        formData.append(
          "company",
          convertDataURIToBlob(uploadedImage),
          "company.png"
        );

        leftFishPhoto.style.backgroundSize = "cover";
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    firstStageValidation();
  }
});

// Функция для преобразования Data URL в Blob
function convertDataURIToBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

function handleDrop(event) {
  event.preventDefault(); // Предотвращаем действие по умолчанию

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    console.log("File:", file);
    let inputId;
    switch (this.id) {
      case "oneDrag":
        inputId = "registration";
        break;
      case "twoDrag":
        inputId = "NU";
        break;
      case "threeDrag":
        inputId = "listWrite";
        break;
    }

    const input = document.getElementById(inputId);
    formData1.delete(inputId); // Удаляем старое значение из formData

    if (file.type === "application/pdf") {
      formData1.append(inputId, file);
      input.previousElementSibling.innerText = file.name;
      console.log(file.name, input.previousElementSibling);
      this.classList.add("active");
      this.classList.remove("error");
    } else {
      input.value = "";
      input.previousElementSibling.innerText = "Ошибка";
      this.classList.remove("active");
      formData1.remove(inputId);
      this.classList.add("error");
      alert("Пожалуйста, загрузите PDF-файл.");
    }
    secondStageValidation();
  }
}

function handleDragOver(event) {
  event.preventDefault(); // Необходим для того, чтобы событие drop сработало
}

function handleInputChange(event) {
  const file = event.target.files[0];
  const parentElement = event.target.closest(".documents");
  const nameFilt = this.previousElementSibling;
  if (file && file.type === "application/pdf") {
    formData1.append(event.target.id, file);
    nameFilt.innerText = file.name;
    parentElement.classList.add("active");
    parentElement.classList.remove("error");
  } else {
    event.target.value = ""; // Очистка выбранного файла
    parentElement.classList.remove("active");
    parentElement.classList.add("error");
    nameFilt.innerText = "Ошибка";
    alert("Пожалуйста, загрузите PDF-файл.");
  }
  secondStageValidation();
}

// Добавляем обработчики событий
document.getElementById("oneDrag").addEventListener("drop", handleDrop);
document.getElementById("oneDrag").addEventListener("dragover", handleDragOver);

document.getElementById("twoDrag").addEventListener("drop", handleDrop);
document.getElementById("twoDrag").addEventListener("dragover", handleDragOver);

document.getElementById("threeDrag").addEventListener("drop", handleDrop);
document
  .getElementById("threeDrag")
  .addEventListener("dragover", handleDragOver);

document
  .getElementById("registration")
  .addEventListener("change", handleInputChange);
document.getElementById("NU").addEventListener("change", handleInputChange);
document
  .getElementById("listWrite")
  .addEventListener("change", handleInputChange);
function updateCountStaffs(event) {
  const selectedValue = event.target.value;
  // Убедимся, что выбранное значение допустимо
  if (["5", "20", "50", "100", "200"].includes(selectedValue)) {
    data.countStaffs = parseInt(selectedValue, 10); // Обновляем значение в data
    finalyStage.removeAttribute("disabled");
  } else {
    finalyStage.setAttribute("disabled", "");
    console.warn("Неверное значение: ", selectedValue);
    data.countStaffs = null;
  }
  console.log("Обновленное значение countStaffs:", data.countStaffs);
}

// Получаем все элементы с атрибутом name="tariff"
const tariffElements = document.getElementsByName("tariff");

// Добавляем обработчик события change для каждого элемента
tariffElements.forEach((element) => {
  element.addEventListener("change", updateCountStaffs);
});
finalyStage.addEventListener("click", async () => {
  // Отключаем кнопку, чтобы предотвратить повторные нажатия
  finalyStage.setAttribute("disabled", "true");

  try {
    // Выполняем верификацию компании
    let verefy = await verefyCompany();
    if (!verefy.success) {
      finalyStage.removeAttribute("disabled"); // Включаем кнопку обратно, если верификация не удалась
      return;
    }

    // Загружаем аватар и документы параллельно
    const [avatar, files] = await Promise.all([sendAvatar(), sendDocuments()]);

    // Проверяем успешность загрузки файлов
    if (
      !avatar.title ||
      !files.files.NU ||
      !files.files.registration ||
      !files.files.listWrite
    ) {
      alert("Ошибка при загрузке файлов.");
      finalyStage.removeAttribute("disabled"); // Включаем кнопку обратно, если загрузка не удалась
      return;
    }

    // Обновляем данные перед отправкой платежа
    data.companyICON = avatar.title;
    data.NU = files.files.NU;
    data.registration = files.files.registration;
    data.listWrite = files.files.listWrite;

    // Отправляем запрос на создание платежа
    const response = await fetch("/api/create-payment-company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "augwod89h1h9awdh9py0y82hjd",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 201) {
      const responseData = await response.json();
      // Проверяем наличие confirmation_url
      if (
        responseData.confirmation &&
        responseData.confirmation.confirmation_url
      ) {
        // Перенаправляем пользователя
        window.location.href = responseData.confirmation.confirmation_url;
      } else {
        throw new Error("Invalid payment response");
      }
    } else {
      throw new Error(
        `Failed to create payment, status code: ${response.status}`
      );
    }
  } catch (error) {
    alert("Произошла ошибка при создании платежа: " + error.message);
    finalyStage.removeAttribute("disabled"); // Включаем кнопку обратно в случае ошибки
  } finally {
    // Чтобы кнопка не оставалась заблокированной навсегда
    setTimeout(() => {
      finalyStage.removeAttribute("disabled");
    }, 5000); // Включаем кнопку через 5 секунд
  }
});

const verefyCompany = async () => {
  try {
    const response = await fetch("/api/verefy-company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "augwod89h1h9awdh9py0y82hjd",
      },
      body: JSON.stringify({ INN: data.INN }),
    });

    if (response.status === 400) {
      const responseData = await response.json();
      alert(responseData.message || "Компания существует");
      return { success: false }; // Возвращаем объект с success: false
    }

    if (response.status !== 201) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Ошибка при проверке компании", error);
    throw error; // Пробрасываем ошибку дальше
  }
};

const sendAvatar = async () => {
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
    return dataSERV;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Пробрасываем ошибку дальше
  }
};

const sendDocuments = async () => {
  try {
    const response = await fetch(`${window.conf.FILE_SERVER}/upload/pdfs`, {
      method: "POST",
      headers: {
        Authorization: "ILOVEPORN",
      },
      body: formData1,
    });

    if (!response.ok) {
      throw new Error("PDF upload failed.");
    }

    const dataSERV = await response.json();
    return dataSERV;
  } catch (error) {
    console.error("Error uploading PDFs:", error);
    throw error; // Пробрасываем ошибку дальше
  }
};
