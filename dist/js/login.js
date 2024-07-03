let email = document.getElementById('email');
let password = document.getElementById('password');

const urlParams = new URLSearchParams(window.location.search);
const errorValue = urlParams.get('error');

// Проверяем наличие параметра 'error' и обрабатываем его значение
if (errorValue === '1') {
    document.getElementById('findAcc').style.display = "block"
    document.getElementById('quest').style.marginTop = "15px"
}
else if(errorValue === '2') {
    document.getElementById('findAcc').innerText = 'Аккаунт не найден'
    document.getElementById('findAcc').style.display = "block"
    document.getElementById('quest').style.marginTop = "15px"
}
else if(errorValue === '3') {
    document.getElementById('findAcc').innerText = 'Пользователь уже существует'
    document.getElementById('findAcc').style.display = "block"
    document.getElementById('quest').style.marginTop = "15px"
}
    else{

    document.getElementById('findAcc').style.display = "none"
}

document.getElementById('myForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the standard form submission

    const formData = { email:email.value, password:password.value };
    console.log(formData); // Corrected the variable name here

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'augwod89h1h9awdh9py0y82hjd'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.status === 200) {
                return window.location.href = '/'; // Redirect to the specified URL
            }
            else if(response.status === 404) {
                email.value=''
                password.value = ''
                return document.getElementById("error").innerText = "Пользователь не найден"
            }
            else if(response.status === 401) {
                email.value=''
                password.value = ''
                return document.getElementById("error").innerText = "Пароль неверный"
            }
            return response.json()
        })
        .catch(error => {
                   email.value=''
                password.value = ''
            console.error('Error:', error);
        });

});