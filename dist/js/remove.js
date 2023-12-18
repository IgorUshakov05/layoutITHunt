const removeAccountInput = document.getElementById('removeAccountInput')
const allBox = document.getElementsByClassName('box')
const next = document.getElementById('remove')
const goRemove = document.getElementById('goRemove')
removeAccountInput.addEventListener('input', (event) => {
    let value = event.target.value
    console.log(`value: ${value}, length: ${value.length}`)

    if (value.length > 6) {
        removeAccountInput.value = ''
        goRemove.setAttribute('disabled' ,'')
        return false
    }
    for (let i = 0; i < 6; i++) {
        allBox[i].innerText = ''
    }
    value.split('').forEach((e,i) => {
        allBox[i].innerText = e
    })
    if (value.length == 6) {
        goRemove.removeAttribute('disabled')
    }
})

goRemove.addEventListener('click',() => {
    createSuccess()
})

next.addEventListener('click', ()=> {
   try {
    goNextStage()
   } catch (e) {
      console.log(e)
      return e
   }
})
function goNextStage() {
    document.getElementById('oneStage').remove()
    document.getElementById('twoStage').style.display = "block"
}
function createSuccess() {
    const succsess = document.createElement('div')
    succsess.classList = 'succsess'
    const succsessMessage = document.createElement('p')
    succsessMessage.classList = 'succsessMessage'
    succsessMessage.innerText = 'Аккаунт успешно удален!'
    succsess.appendChild(succsessMessage)
    document.getElementById('twoStage').remove()
    document.getElementById('login').appendChild(succsess)

}