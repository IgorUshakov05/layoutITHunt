window.addEventListener('load',() => {
    let button = document.getElementById("sendMessage");
    let inputMessage = document.getElementById("inputMessage");
    let statusElement = document.querySelector('.lastTime'); // Элемент для отображения статуса
    
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/chat`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
        console.log("WebSocket connection opened.");
    };
    
    ws.onmessage = (event) => {
        try {
            const { type, result, fromCurrentUser } = JSON.parse(event.data);
            console.log(result);
    
            if (type === 'message') {
                // Обработка сообщения
                let template;
                if (fromCurrentUser) {
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
                const chatContainer = document.querySelector(".someChat");
                chatContainer.insertAdjacentHTML("beforeend", template);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            } else if (type === 'status') {
                // Обработка статуса
                setOnline(result.isActive);
            }
        } catch (error) {
            console.error("Failed to parse incoming message:", error);
        }
    };
    
    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
    };
    
    ws.onclose = () => {
        console.log("WebSocket connection closed.");
        setOnline(false);
        const room = window.location.pathname.split("/")[2];
        fetch(`/api/removeRoom?room=${encodeURIComponent(room)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "augwod89h1h9awdh9py0y82hjd",
            },
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.message) {
                console.log(data.message);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    };
    
    // Обработка ввода текста в поле
    inputMessage.addEventListener("input", function (e) {
        let value = e.target.value;
        button.disabled = value.length < 1;
    });
    
    // Обработка клика по кнопке для отправки сообщения
    button.addEventListener("click", () => {
        ws.send(
            JSON.stringify({
                type: 'message',
                content: inputMessage.value,
                url: window.location.href.split("/")[4],
            })
        );
        inputMessage.value = "";
        button.disabled = true;
    });
    
    inputMessage.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            let value = e.target.value;
            button.disabled = value.length < 1;
            ws.send(
                JSON.stringify({
                    type: 'message',
                    content: inputMessage.value,
                    url: window.location.href.split("/")[4],
                })
            );
            inputMessage.value = "";
            button.disabled = true;
        }
    });
    
    let setOnline = (isActive) => {
        if (isActive) return statusElement.innerHTML = 'Онлайн';
        return statusElement.innerHTML = 'Оффлайн';
    };
})
