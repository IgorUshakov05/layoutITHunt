// Получение ссылки на элементы
let button = document.getElementById("sendMessage");
let inputMessage = document.getElementById('inputMessage');

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const host = window.location.host;
const wsUrl = `${protocol}//${host}/chat`;
const ws = new WebSocket(wsUrl);

ws.onopen = () => {
    console.log("WebSocket connection opened.");
};

ws.onmessage = (event) => {
    try {
        const { result, fromCurrentUser } = JSON.parse(event.data);
        console.log(result);

        // Определяем, какое сообщение добавить
        let template;
        if (fromCurrentUser) {
            // Сообщение от текущего пользователя
            template = `
                <div class="boxMessage rigthMess">
                    <span class="hisMessage myMessage">
                        <span>${result.content}</span>
                        <span class="bottomTime bottomTimeLeft">
                            <span>${result.time}</span>
                        </span>
                    </span>
                </div>`;
        } else {
            // Сообщение от другого пользователя
            template = `
                <div class="boxMessage">
                    <span class="hisMessage">
                        <span>${result.content}</span>
                        <span class="bottomTime">
                            <span>${result.time}</span>
                        </span>
                    </span>
                </div>`;
        }

        // Добавляем сообщение в чат
        const chatContainer = document.querySelector('.someChat');
        chatContainer.insertAdjacentHTML('beforeend', template);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (error) {
        console.error("Failed to parse incoming message:", error);
    }
};

ws.onerror = (error) => {
    console.error("WebSocket error:", error);
};

ws.onclose = () => {
    console.log("WebSocket connection closed.");
    const room = window.location.pathname.split('/')[2];
    fetch(`/api/removeRoom?room=${encodeURIComponent(room)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "augwod89h1h9awdh9py0y82hjd",
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            console.log(data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
    
};

// Обработка ввода текста в поле
inputMessage.addEventListener('input', function(e) {
    let value = e.target.value;
    button.disabled = value.length < 1;
});

// Обработка клика по кнопке для отправки сообщения
button.addEventListener("click", () => {
    // Отправляем сообщение через WebSocket
    ws.send(JSON.stringify({ content: inputMessage.value, url: window.location.href.split('/')[4] }));

    // Очищаем поле ввода после отправки
    inputMessage.value = '';
    button.disabled = true; // Отключаем кнопку после отправки
});
