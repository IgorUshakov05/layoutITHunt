const addMessageToChat = require("../../../database/Request/SendMesage");
const { decodeAccessToken } = require("../../tokens/accessToken");
const WebSocket = require("ws");
const deleteChatIfEmpty = require("../../../database/Request/DeleteChatIfIsAmpty");

// Функция для получения cookie по имени
function getCookie(name, cookies) {
    const value = `; ${cookies}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}

// Хранилище для комнат
const rooms = {};

async function handleMessageSocketConnection(wss) {
    wss.on("connection", async (ws, request) => {
        console.log("Client connected");

        // Извлечение cookies из заголовка запроса
        const cookies = request.headers.cookie;
        const accessToken = getCookie("access", cookies);
        if (!accessToken || !(await decodeAccessToken(accessToken))) {
            ws.send(JSON.stringify({ error: "Unauthorized" }));
            ws.close();
            return;
        }

        // Декодируем токен пользователя
        let userID;
        try {
            const decoded = await decodeAccessToken(accessToken);
            userID = decoded.userID;
        } catch (error) {
            console.error("Failed to decode access token:", error);
            ws.send(JSON.stringify({ error: "Unauthorized" }));
            ws.close();
            return;
        }

        // Устанавливаем URL комнаты для WebSocket
        ws.currentRoom = null;

        // Обработка сообщений
        ws.on("message", async (message) => {
            console.log(`Received message: ${message}`);

            let parsedMessage;
            try {
                parsedMessage = JSON.parse(message);
            } catch (error) {
                console.error("Failed to parse message:", error);
                ws.send(JSON.stringify({ error: "Invalid message format" }));
                return;
            }

            const { content, url } = parsedMessage;

            // Проверяем наличие содержания и URL комнаты
            if (!content || !url) {
                ws.send(JSON.stringify({ error: "Empty message or room" }));
                return;
            }

            // Создаем комнату, если её нет
            if (!rooms[url]) {
                rooms[url] = new Set();
            }
            rooms[url].add(ws);

            ws.currentRoom = url;

            // Сохраняем сообщение и рассылаем его другим клиентам
            try {
                const result = await addMessageToChat(url, userID, content);

                rooms[url].forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(
                            JSON.stringify({
                                result: result,
                                fromCurrentUser: client === ws,
                            })
                        );
                    }
                });
            } catch (error) {
                console.error("Failed to save message:", error);
                ws.send(JSON.stringify({ error: "Failed to save message" }));
            }
        });

        // Обработка отключения клиента
        ws.on("close", async () => {
            console.log("Client disconnected");
            if (ws.currentRoom) {
                return await leave(ws.currentRoom, ws);
            }
        });
    });
}

// Функция для выхода из комнаты
const leave = async (room, socket) => {
    console.log(room, ' удаление')
    // Проверяем, существует ли комната
    if (!rooms[room]) return;
    let remove = await deleteChatIfEmpty(room)
    if(remove) console.log("Удаение")
    // Удаляем сокет из комнаты
    rooms[room].delete(socket);

    // Если комната пуста, удаляем её
    if (rooms[room].size === 0) {
        delete rooms[room];
    }
};

module.exports = { handleMessageSocketConnection };
