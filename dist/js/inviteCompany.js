// Получаем input
const userNameInput = document.getElementById('userName');

// Добавляем обработчик события при вводе в input
userNameInput.addEventListener('input', function () {
    // Получаем все элементы с классом "userNameCompany"
    const userNameCompanyElements = document.querySelectorAll('.userNameCompany');
    
    // Получаем значение введенное в input
    const inputValue = userNameInput.value.toLowerCase();
    
    // Перебираем все элементы с классом "userNameCompany"
    userNameCompanyElements.forEach(function (element) {
        // Получаем текст из элемента "userNameCompany" и приводим его к нижнему регистру
        const userNameText = element.textContent.toLowerCase();
        
        // Если введенное значение присутствует в тексте элемента "userNameCompany", то отображаем соответствующий элемент "itemInviteComp", иначе скрываем
        if (userNameText.includes(inputValue)) {
            element.closest('.itemInviteComp').style.display = 'block';
        } else {
            element.closest('.itemInviteComp').style.display = 'none';
        }
    });
});


  document.querySelectorAll('.reject').forEach(function (element) {
    element.addEventListener('click', function () {
        element.style.display = 'none';
        element.parentNode.querySelector('.responseD').style.display = 'none';
        element.parentNode.parentNode.querySelector('.timeSeen').style.display = 'none';
        element.parentNode.parentNode.querySelector('.InCompanyGren').style.display = 'none';
        element.parentNode.querySelector('.canelRespons').style.display = 'block';
        element.parentNode.querySelector('.canelRespons').classList.remove('greenLight');
        element.parentNode.querySelector('.canelRespons').classList.add('redLight');
        element.parentNode.parentNode.querySelector('.InCompanyRed').style.display = 'block';
    });
});

document.querySelectorAll('.responseD').forEach(function (element) {
    element.addEventListener('click', function () {
        element.style.display = 'none';
        element.parentNode.querySelector('.reject').style.display = 'none';
        element.parentNode.parentNode.querySelector('.timeSeen').style.display = 'none';
        element.parentNode.parentNode.querySelector('.InCompanyRed').style.display = 'none';
        element.parentNode.querySelector('.canelRespons').style.display = 'block';
        element.parentNode.querySelector('.canelRespons').classList.remove('redLight');
        element.parentNode.querySelector('.canelRespons').classList.add('greenLight');
        element.parentNode.parentNode.querySelector('.InCompanyGren').style.display = 'block';
    });
});

document.querySelectorAll('.canelRespons').forEach(function (element) {
    element.addEventListener('click', function () {
        element.style.display = 'none';
        element.parentNode.querySelector('.responseD').style.display = 'block';
        element.parentNode.querySelector('.reject').style.display = 'block';
    });
});