window.addEventListener("load", () => {
    let button = document.getElementById("sendMessage");
    let inputMessage = document.getElementById("inputMessage");
    let statusElement = document.querySelector(".lastTime");

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/chat`;
    const ws = new WebSocket(wsUrl);

    let typingTimeout; // Переменная для таймера отслеживания окончания ввода

    ws.onopen = () => {
        console.log("WebSocket connection opened.");
        ws.send(
            JSON.stringify({
                type: "isOffline",
                url: window.location.href.split("/")[4],
                status: true
            })
        );
    };

    ws.onmessage = (event) => {
        try {
            const { type, result, fromCurrentUser, status } = JSON.parse(event.data);
            console.log({ type, result, fromCurrentUser, status });

            if (type === "message") {
                let template;
                if (fromCurrentUser) {
                    template = `
                      <div data-id='${result.id}' class="boxMessage rigthMess">
                        <span class="hisMessage myMessage">
                          <span>${result.content}</span>
                          <span class="bottomTime bottomTimeLeft">
                            <span>${result.time}</span>
                          </span>
                        </span>
                      </div>`;
                } else {
                    template = `
                      <div data-id='${result.id}' class="boxMessage">
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
            } else if (type === "isOffline") {
                if (fromCurrentUser) {
                    setOnline(status ? 'Онлайн' : 'Оффлайн');
                }
            } else if (type === "typing") {
                if (!!fromCurrentUser) {
                    setOnline(status ? 'Печатает...' : 'Онлайн');
                }
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
        const room = window.location.pathname.split("/")[4];
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

        if (value.length > 0) {
            ws.send(
                JSON.stringify({
                    type: "typing",
                    url: window.location.href.split("/")[4],
                    status: true
                })
            );

            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                ws.send(
                    JSON.stringify({
                        type: "typing",
                        url: window.location.href.split("/")[4],
                        status: false
                    })
                );
            }, 2000); // Таймаут 2 секунды
        } else {
            ws.send(
                JSON.stringify({
                    type: "typing",
                    url: window.location.href.split("/")[4],
                    status: false
                })
            );
        }

        button.disabled = value.length < 1;
    });

    // Обработка клика по кнопке для отправки сообщения
    button.addEventListener("click", () => {
        const message = inputMessage.value.trim();
        if (message) {
            ws.send(
                JSON.stringify({
                    type: "message",
                    content: message,
                    url: window.location.href.split("/")[4],
                })
            );
            inputMessage.value = "";
            button.disabled = true;
        }
    });

    // Обработка нажатия Enter для отправки сообщения
    inputMessage.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault(); // Предотвратить стандартное поведение Enter
            const message = inputMessage.value.trim();
            if (message) {
                ws.send(
                    JSON.stringify({
                        type: "message",
                        content: message,
                        url: window.location.href.split("/")[4],
                    })
                );
                inputMessage.value = "";
                button.disabled = true;
            }
        }
    });

    let setOnline = (message) => {
        statusElement.innerHTML = message;
    };
});
