let formData = new FormData(); 
let regToINN = new RegExp('^[0-9]*$');
let regToEmail = new RegExp(/^[а-яa-zA-ZА-Я0-9.!#$%&'+/=?^_`{|}~-]+@[а-яa-zA-ZА-Я0-9-]+(?:.[а-яa-zA-ZА-Я0-9-]+)$/)
let regToLink = new RegExp('/^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/g')
//Поля ввода данных компании
const nameCompany = document.getElementById('nameCompany')
const innCompany = document.getElementById('innCompany')
const websiteCompany = document.getElementById('websiteCompany')
const addresCompany = document.getElementById('addresCompany')
const numberCompany = document.getElementById('numberCompany')
const descriptionCompany = document.getElementById('descriptionCompany')
let postCompany = document.getElementById('postCompany')

const OneStage = document.getElementById('toTwoStage')
const codePlace = document.getElementById('textWarning')
const parentButtonGetCode = document.getElementById('parentButtonGetCode')
let getCodePass = document.getElementById('getCodePass')
const CloseStage = (stageID) => {
    document.getElementById(stageID).style.display = 'none'
}
const reTextStage = (text) => {
    document.getElementById('stageCreate').innerText = text
}
const OpenStage = (stageID) => {
    document.getElementById(stageID).style.display = 'block'
}
const progress = (progress) => {
    document.getElementById('progress').setAttribute('value', progress)
}
const windowScale = () => {
    document.getElementById('windowSendCompany').classList.add('widthemail')
}



OneStage.addEventListener('click', () => {
    windowScale()
    CloseStage('OneStageElem')
    OpenStage('TwoStageElem')
    reTextStage('Подтвердите компанию')
    window.scrollBy(0, 0)
    progress("50")
})
// Название компании
nameCompany.addEventListener('input', (event) => {
    
    let value = (event.target.value).trim()
    if (value.length >= 50) {
        nameCompany.value =  nameCompany.value.slice(0, 50)
        console.log("Большой")
        return false
    }
    if (value.length >= 3) {
        formData.delete('nameCompany')
        formData.append('nameCompany',value)
    }
    valudStage()
})

//ИНН компании
innCompany.addEventListener('input', (event) => {
    let value = (event.target.value).trim()
    console.log(regToINN.test(value));
    if (value.length >= 13) {
        innCompany.value =  innCompany.value.slice(0, 12)
        console.log("Большой")
        return false
    }
    if(!regToINN.test(value)) {
        return false
    }
    if (value.length >= 4) {
        formData.delete('innCompany')
        formData.append('innCompany',value)
    }
    valudStage()
})

websiteCompany.addEventListener('input', (event) => {
    let value = (event.target.value).trim()
    if (value.length >= 40) {
        websiteCompany.value =  websiteCompany.value.slice(0, 40)
        console.log("Большой")
        return false
    }
    if (value.length >= 6) {
        formData.delete('websiteCompany')
        formData.append('websiteCompany',value)
    }
    valudStage()
})

//Адрес компании
addresCompany.addEventListener('input', (event) => {
    let value = (event.target.value).trim()
    if (value.length >= 211) {
        addresCompany.value =  addresCompany.value.slice(0, 211)
        console.log("Большой")
        return false
    }
    
    if (value.length >= 8) {
        formData.delete('addresCompany')
        formData.append('addresCompany',value)
    }
    valudStage()
})

//Номер компании
numberCompany.addEventListener('input', (event) => {
    let value = (event.target.value).trim()
    if (value.length >= 211) {
        numberCompany.value =  numberCompany.value.slice(0, 211)
        console.log("Большой")
        return false
    }
    
    if (value.length >= 8) {
        formData.delete('numberCompany')
        formData.append('numberCompany',value)
    }
    valudStage()
})

//Описание компании
descriptionCompany.addEventListener('input', (event) => {
    let value = (event.target.value).trim()
    if (value.length >= 1000) {
        descriptionCompany.value =  descriptionCompany.value.slice(0, 1000)
        console.log("Большой")
        return false
    }
    if (value.length >= 10) {
        formData.delete('descriptionCompany')
        formData.append('descriptionCompany',value)
    }
    valudStage()
})
function readFile(file) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      document.getElementById("avatarCompany").src = reader.result;
    });
    reader.readAsDataURL(file);  
  }
document.getElementById('avatarCompany1').addEventListener('change', (event) => {
    formData.delete('avatarCompany')
    formData.append('avatarCompany', event.target.files[0]);
    readFile(event.target.files[0])
    console.log(event.target.files[0])
    valudStage()
});

document.getElementById('avatarCompany2').addEventListener('change', (event) => {
    formData.delete('avatarCompany')
    formData.append('avatarCompany', event.target.files[0]);
    readFile(event.target.files[0])
    console.log(event.target.files[0])
    valudStage()
});

const valudStage = () => {
    if ((formData.has('avatarCompany') && formData.has('descriptionCompany') && formData.has('nameCompany') && formData.has('innCompany') && formData.has('numberCompany') && formData.has('websiteCompany') && nameCompany.value && innCompany.value&& websiteCompany.value&& addresCompany.value&& descriptionCompany.value&& numberCompany.value)) {
        OneStage.removeAttribute('disabled')
        return true
    } else {
        document.getElementById('toTwoStage').setAttribute('disabled', '')
        return false;
    }
}



// Валидация почты
postCompany.addEventListener('input', (e) => {
    let value = (e.target.value).trim()
    console.log(value);
    if (regToEmail.test(value) && value.length !== 0) {
        getCodePass.removeAttribute('disabled')
    }
    else {
        getCodePass.setAttribute('disabled','')
    }
})
function showBoxs() {
    formData.delete('emailCompany')
    formData.append('emailCompany',postCompany.value)
    document.getElementById('understage').remove()
    codePlace.style.display = 'block'
}

getCodePass.addEventListener('click', showBoxs)
const allBox = document.getElementsByClassName('box')
const removeAccountInput = document.getElementById('removeAccountInput')
removeAccountInput.addEventListener('input', (event) => {
    let value = event.target.value
    console.log(`value: ${value}, length: ${value.length}`)

    if (value.length > 6) {
        removeAccountInput.value = ''
        document.getElementById('postCodeVerefy').setAttribute('disabled' ,'')
        return false
    }
    for (let i = 0; i < 6; i++) {
        allBox[i].innerText = ''
    }
    value.split('').forEach((e,i) => {
        allBox[i].innerText = e
    })
    if (value.length == 6 && validEmailAndCode) {
        document.getElementById('postCodeVerefy').removeAttribute('disabled')
    }
})

function validEmailAndCode() {
    if ((formData.has('codeVerefy') && formData.has('postCodeVerefy') &&  removeAccountInput.value&& postCompany.value)) {
        return true
    } else {
        return false;
    }
}
// Функция при успешном подтверждении почты
function finalyVerefy() {
    document.getElementById('postCodeVerefy').remove()
    formData.delete('codeVerefy')
    formData.append('codeVerefy',document.getElementById('removeAccountInput').value)
    removeAccountInput.value = ''
    let xx = document.querySelectorAll('.box');
    let i = 1;
    xx.forEach(box => {
    setTimeout(() => {
        box.style.borderColor = 'green';

    },500*i)})
    setTimeout(() => {
        codePlace.remove()
        let endScreen = `<h1 class="successSend">Заявка на создание компании отправлена</h1><p class="textEnd">Это нужно для того чтобы убедиться что компания действительно существует.</p>`
        document.getElementById('lastStage').innerHTML=endScreen
        document.getElementById('lastStage').style.display = "block"
    },1500)
}

document.getElementById('postCodeVerefy').addEventListener('click', () => {
 
    // //Запрос на сравнение

    // //Если все ОК
    finalyVerefy()

    //Не ок
    // NoCOde()
})

const NoCOde = () => {
    let xx = document.querySelectorAll('.box');
    let i = 1;
xx.forEach(box => {
setTimeout(() => {
    box.style.borderColor = 'red';

},900*i)})
    xx.forEach(box => {
        box.style.borderColor = 'black';
    })
}