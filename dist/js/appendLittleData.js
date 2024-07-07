document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    const dateError = document.getElementById('errorMessage');
    const registrationButton = document.getElementById('registrationMe');
  
    let data = {
      birthDay: "",
      role: "",
    };
  
    const valid = () => {
      if ((data.role === 'worker' || data.role === 'creatorWork') && data.birthDay.length === 10 && document.getElementById('true').checked) {
        registrationButton.removeAttribute('disabled');
      } else {
        registrationButton.setAttribute('disabled', '');
      }
    };
  
    const validateDate = () => {
      const inputDate = new Date(dateInput.value);
      const currentDate = new Date();
  
      // Убираем часть времени для корректного сравнения только по дате
      inputDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
  
      if (inputDate.getFullYear() > currentDate.getFullYear()) {
        dateError.style.display = 'block';
        dateInput.setCustomValidity('Год не может быть больше текущего.');
        registrationButton.setAttribute('disabled', '');
      } else {
        dateError.style.display = 'none';
        dateInput.setCustomValidity('');
        let value = dateInput.value.split('-').reverse().join('-');
        if (value.length === 10) {
          data.birthDay = value;
          console.log(data)
          valid();
        } else {
          // Если дата неполная или невалидная после удаления символов
          data.birthDay = "";
          valid();
        }
      }
    };
  
    // Обработчик для изменения значения поля ввода даты
    dateInput.addEventListener('input', validateDate);
  
    // Изначальная проверка при загрузке страницы
    validateDate();
  
    // Обработчики для выбора роли
    document.getElementById("worker").addEventListener("click", function (e) {
      data.role = e.target.value.trim();
      valid();
    });
  
    document.getElementById("creatorWork").addEventListener("click", function (e) {
      data.role = e.target.value.trim();
      valid();
    });
  
    // Обработчик для чекбокса
    document.getElementById('true').addEventListener('click', function (e) {
      valid();
    });
    registrationButton.addEventListener('click',()=> {
      fetch("/api/registration_with_google", {
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
      });
    })
  });
  