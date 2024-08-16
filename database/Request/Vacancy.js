const Vacancy = require("../Schema/Vakancy");
const { v4 } = require("uuid");
const { Temporal } = require("@js-temporal/polyfill");

async function createVacancy({
  userID,
  special,
  skills,
  typeWork,
  experience,
  price,
  description,
  responses,
}) {
  const formattedSkills = skills.map((skill) => ({ title: skill }));
  const formattedTypeWork = typeWork.map((workType) => ({ title: workType }));

  // Использование PlainDateTime для работы с датой и временем
  const now = Temporal.Now.plainDateTimeISO();
  const addDate = now.add({ days: 30 });

  const newVacancy = new Vacancy({
    id: v4(),
    userID,
    special,
    skills: formattedSkills,
    typeWork: formattedTypeWork,
    experience,
    price,
    description,
    responses,
    dateAndTimeCreated: addDate.toString(), // Сохраняем дату как строку
  });

  try {
    const savedVacancy = await newVacancy.save();
    return { success: true, data: savedVacancy };
  } catch (err) {
    console.log(err);
    return { success: false, error: err.message };
  }
}

async function searchVacancyById(id) {
  try {
    const vacancy = await Vacancy.findOne({ id });
    if (!vacancy) {
      return { success: false, message: "Вакансии с таким id не найдено" };
    }
    return { success: true, data: vacancy };
  } catch (err) {
    console.log(err);
    return { success: false, error: err.message };
  }
}
async function searchVacancyByUserId(id) {
  try {
    const vacancy = await Vacancy.find({ userID: id });
    if (!vacancy) {
      return {
        success: false,
        message: "Вакансий у пользователя с таким id не найдено",
      };
    }
    return { success: true, data: vacancy };
  } catch (err) {
    console.log(err);
    return { success: false, error: err.message };
  }
}

module.exports = { createVacancy, searchVacancyById, searchVacancyByUserId };
