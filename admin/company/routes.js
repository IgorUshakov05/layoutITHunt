const { Router } = require("express");
const {getNotVerefy} = require("../../database/Request/Company")
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
module.exports = router;