const Vacancy = require("../Schema/Vakancy");
const { v4 } = require("uuid");
const { Temporal } = require("@js-temporal/polyfill");
const ReasonRMVacancy = require("../Schema/ReasonRemoveVacansy");

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
  const add30 = now.add({ days: 30 });
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
const removeVacancy = async (id, userReason) => {
  try {
    let result = await Vacancy.deleteOne({ id });
    console.log(result);
    if (!result.deletedCount) {
      return { success: false, message: "Vacancy not found" };
    }
    let reason = await ReasonRMVacancy({ id: v4(), text: userReason });
    await reason.save();
    return { success: true, message: "Company removed" };
  } catch (e) {
    return { success: false, message: "Error" };
  }
};
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

module.exports = {
  createVacancy,
  searchVacancyById,
  searchVacancyByUserId,
  removeVacancy,
};
