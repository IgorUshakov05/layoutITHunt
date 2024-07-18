const short = document.getElementById('short');
const middle = document.getElementById('middle');
const long = document.getElementById('long');

const createPayment = (tariff) => {
    short.setAttribute('disabled', '')
    middle.setAttribute('disabled', '')
    long.setAttribute('disabled', '')
  fetch("/api/create-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "augwod89h1h9awdh9py0y82hjd",
    },
    body: JSON.stringify({ tariff }),
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      }
      throw new Error('Failed to create payment');
    })
    .then((data) => {
      // Проверяем наличие confirmation_url
      if (data.confirmation && data.confirmation.confirmation_url) {
        // Перенаправляем пользователя
        window.location.href = data.confirmation.confirmation_url;
        short.removeAttribute('disabled')
        middle.removeAttribute('disabled')
        long.removeAttribute('disabled')
      } else {
        throw new Error('Invalid payment response');
      }
    })
    .catch((error) => {  short.removeAttribute('disabled')
        middle.removeAttribute('disabled')
        long.removeAttribute('disabled')});
  
};

short.addEventListener('click', () => createPayment('short'));
middle.addEventListener('click', () => createPayment('middle'));
long.addEventListener('click', () => createPayment('long'));
