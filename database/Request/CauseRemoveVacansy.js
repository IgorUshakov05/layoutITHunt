const CauseRemove = require("../Schema/VacansyRemoved");
const { v4 } = require("uuid");
const addCause = async (title, causeCode) => {
  try {
    let newCause = await new CauseRemove({ id: v4(), title, cause: causeCode });
    let saveCause = await newCause.save();
    return { success: true, result: saveCause };
  } catch (error) {
    console.log(error);
    return { success: false, error: error.message };
  }
};

module.exports = { addCause };
