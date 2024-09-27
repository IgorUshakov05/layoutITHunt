const CauseRemoveVacancy = require("../Schema/VacansyRemoved");
const CauseRemoveFastWork = require("../Schema/FastWorkRemoved");
const { v4 } = require("uuid");
const addCauseVacancy = async (title, causeCode) => {
  try {
    let newCause = await new CauseRemoveVacancy({
      id: v4(),
      title,
      cause: causeCode,
    });
    let saveCause = await newCause.save();
    return { success: true, result: saveCause };
  } catch (error) {
    console.log(error);
    return { success: false, error: error.message };
  }
};

const addCauseFastWork = async (title, causeCode) => {
  try {
    let newCause = await new CauseRemoveFastWork({
      id: v4(),
      title,
      cause: causeCode,
    });
    let saveCause = await newCause.save();
    return { success: true, result: saveCause };
  } catch (error) {
    console.log(error);
    return { success: false, error: error.message };
  }
};

module.exports = { addCauseFastWork, addCauseVacancy };
