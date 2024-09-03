const { Router } = require("express");
const {
  getNotVerefy,
  setStatusOfCompany,
} = require("../../database/Request/Company");
const router = Router(); // Create a new router object
router.post("/get_all_not_verefy_company", async (req, res) => {
  try {
    const notVerifiedCompanies = await getNotVerefy(); // Assuming you have this function
    res.json({ success: true, result: notVerifiedCompanies });
  } catch (error) {
    console.error("Error getting not verified companies:", error);
    res.status(500).json({ success: false, message: "Error retrieving data" });
  }
});

router.post("/setVerefy", async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id) {
      return res.json({ success: false, message: "ID компании не передан" });
    }
    if (status === undefined)
      return res.json({ success: false, message: "Статус не передан" });
    console.log(status, id);
    const setStatus = await setStatusOfCompany(id, status);
    if (!setStatus)
      return res.json({ success: false, message: "Комапния не найдена" });
    return res.json({ success: true, result: setStatus });
  } catch (error) {
    console.error("Error getting not verified companies:", error);
    res.status(500).json({ success: false, message: "Error retrieving data" });
  }
});
module.exports = router;
