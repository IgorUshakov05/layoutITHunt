const input = document.getElementById('specializationInput')
const button = document.getElementById('submitBtn')
input.addEventListener('input', () => {
   if (input.value.length >= 3) {
    button.removeAttribute('disabled')
   }
   else {
    button.setAttribute('disabled', '')
   }
})
