const FastWork = require("../Schema/FastWork");
const { v4 } = require("uuid");
const { Temporal } = require("@js-temporal/polyfill");

async function createFastWork({
  userID,
  special,
  skills,
  experience,
  price,
  description,
  responses,
}) {
  const formattedSkills = skills.map((skill) => ({ title: skill }));
  console.log(
    userID,
    special,
    skills,
    experience,
    price,
    description,
    responses
  );
  const now = Temporal.Now.plainDateTimeISO();
  const add30 = now.add({ days: 30 });

  const newVacancy = new FastWork({
    id: v4(),
    userID,
    special,
    skills: formattedSkills,
    level: experience,
    price,
    description,
    responses,
    dateRemove: add30.toString(), // Сохраняем дату как строку
  });

  try {
    const savedVacancy = await newVacancy.save();
    return { success: true, data: savedVacancy };
  } catch (err) {
    console.log(err);
    return { success: false, error: err.message };
  }
}

async function searchFastWorkById(id) {
  try {
    const fastWork = await FastWork.findOne({ id });
    console.log(fastWork);
    if (!fastWork) {
      return { success: false, message: "ФастВорк с таким id не найдено" };
    }
    return { success: true, data: fastWork };
  } catch (err) {
    console.log(err);
    return { success: false, error: err.message };
  }
}
async function searchFastWorkByUserId(id) {
  try {
    const fastWork = await FastWork.find({ userID: id });
    if (!fastWork) {
      return {
        success: false,
        message: "ФастВорк у пользователя с таким id не найдено",
      };
    }
    return { success: true, data: fastWork };
  } catch (err) {
    console.log(err);
    return { success: false, error: err.message };
  }
}

module.exports = { createFastWork, searchFastWorkById, searchFastWorkByUserId };
