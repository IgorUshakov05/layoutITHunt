const input = document.getElementById('specializationInput')
const button = document.getElementById('submitBtn')
input.addEventListener('input', () => {
   if ((input.value).trim().length >= 3) {
    button.removeAttribute('disabled')
   }
   else {
    button.setAttribute('disabled', '')
   }
})

button.addEventListener('click', () => {
   button.setAttribute('disabled', '')
   fetch('/api/specialOffered', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'augwod89h1h9awdh9py0y82hjd'
      },
      body: JSON.stringify({special:input.value.trim()})
  })
  .then(response =>  response.json())
  .then(data => {
      console.log(data);
      document.getElementById('parentForAppend').innerHTML = `<div class="textHelp">
                        <div class="green"></div>
                        <p>${data.message}</p>
                    </div>`
      input.value = ''
  })
  .finally(() => {
   setTimeout(() => {
      button.removeAttribute('disabled')
   },5000)
  })
  ;
})