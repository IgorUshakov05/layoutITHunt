const { Router } = require("express");
const router = Router();
const deleteChatIfEmpty = require("../../database/Request/DeleteChatIfIsAmpty");

router.get("/removeRoom", async (req, res) => {
    console.log('remove!');
    let room = req.query.room;  // Правильное извлечение параметра из query
    console.log(room);
    if (!room) {
        return res.status(400).json({ message: "Room parameter is missing" });
    }
    try {
        let result = await deleteChatIfEmpty(room);
        if (result) {
            console.log("Удаление чата", room);
            return res.status(200).json({ message: "Room removed successfully" });
        } else {
            return res.status(404).json({ message: "Chat not found" });
        }
    } catch (error) {
        console.error("Error removing room:", error);
        return res.status(500).json({ message: "Failed to remove room" });
    }
});

module.exports = router;
