const Vacancy = require("../Schema/Vakancy");
const UserScheme = require("../Schema/UserSchema");
const { v4 } = require("uuid");
const { Temporal } = require("@js-temporal/polyfill");
const ReasonRMVacancy = require("../Schema/ReasonRemoveVacansy");
const { addCauseVacancy } = require("./CauseRemovePublication");
const VacansyRemoved = require("../Schema/VacansyRemoved");
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
  const now = Temporal.Now.plainDateISO();
  const add30 = now.add({ months: 1 });
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
    let result = await Vacancy.findOneAndDelete({ id });
    if (!result) {
      return { success: false, message: "Vacancy not found" };
    }
    let addToCause = await addCauseVacancy(result.special, userReason);
    return { success: true, message: "Vacansy removed" };
  } catch (e) {
    console.log(e);
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
async function updateVacansy(
  id,
  {
    userID,
    special,
    skills,
    typeWork,
    experience,
    price,
    description,
    responses,
  }
) {
  try {
    const formattedSkills = skills.map((skill) => ({ title: skill }));
    const formattedTypeWork = typeWork.map((workType) => ({ title: workType }));
    const result = await Vacancy.findOneAndUpdate(
      { id, userID },
      {
        $set: {
          special,
          skills: formattedSkills,
          typeWork: formattedTypeWork,
          experience,
          price,
          description,
        },
      }
    );
    console.log(result);
    if (!result) return { success: false, message: "Vacancy not found" };
    return { success: true, data: result };
  } catch (err) {
    console.log(err);
    return { success: false, error: err.message };
  }
}

let sendRequest = async (id, specialID, message) => {
  try {
    const now = Temporal.Now.plainDateTimeISO();
    const date = new Date(now.toString());
    let isNotRep = await Vacancy.findOne({
      id,
      responses: { $elemMatch: { userID: specialID } },
    });
    if (isNotRep) return { success: false, message: "Заявка уже существует!" };
    let findVacancy = await Vacancy.findOneAndUpdate(
      { id },
      {
        $push: { responses: { userID: specialID, message, datetime: date } },
      }
    );
    if (!findVacancy) {
      return { success: false, message: "Вакансия не найдена!" };
    }
    if (findVacancy.responses.userID === specialID)
      return { success: false, message: "Заявка уже отправлена" };
    return { success: true, message: "Отклик отправлен!" };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Непредвиденная ошибка" };
  }
};

let getAllRespond = async (hrDI) => {
  try {
    let getAllRespond = await Vacancy.find({ userID: hrDI }).select(
      "special skills responses id"
    );
    if (!getAllRespond) return { success: true, message: "Вакансий нет" };
    let userIDs = getAllRespond.map((item) => {
      return item.responses.map((response) => response.userID);
    });
    console.log(userIDs);
    console.log(getAllRespond);
    let getUsers = await UserScheme.find({ id: getAllRespond });
    console.log(getUsers);
    return { success: true, vacancy: getAllRespond };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Сервер упал!" };
  }
};

module.exports = {
  createVacancy,
  updateVacansy,
  searchVacancyById,
  searchVacancyByUserId,
  removeVacancy,
  getAllRespond,
  sendRequest,
};
