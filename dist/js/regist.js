const surname = document.getElementById("surname")
const lastname = document.getElementById("lastname")
const dateInput = document.getElementById('date');
const email = document.getElementById("email")
const password = document.getElementById("password")
const replypassword = document.getElementById("replypassword")
const buttonGetCode = document.getElementById('nextOneGetCode')
const inputs = document.querySelectorAll('.square-input');
//Кноки для перехода на этапы
const firstStapButton = document.getElementById('nextOne')


firstStapButton.addEventListener('click', () => {
    document.getElementById('firstScreen').style.display = 'none'
    document.getElementById('secondStap').style.display = 'block'
})

