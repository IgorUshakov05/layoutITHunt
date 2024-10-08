const FastWork = require("../Schema/FastWork");
const { v4 } = require("uuid");
const { Temporal } = require("@js-temporal/polyfill");
const {addCauseFastWork} = require("../Request/CauseRemovePublication");

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
  const now = Temporal.Now.plainDateISO();
  const add30 = now.add({ months: 1 });

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
    console.log(id, ' - айди')
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

async function updateFastWork(
  id,
  { userID, special, skills, experience, price, description, responses }
) {
  const formattedSkills = skills.map((skill) => ({ title: skill }));
  try {
    const result = await FastWork.findOneAndUpdate(
      { id, userID },
      {
        $set: {
          userID,
          special,
          skills: formattedSkills,
          level: experience,
          price,
          description,
        },
      }
    );
    if (!result) return { success: false, message: "fast work not found" };
    return { success: true, data: result };
  } catch (err) {
    console.log(err);
    return { success: false, error: err.message };
  }
}

const removeFastWork = async (id, userReason) => {
  try {
    let result = await FastWork.findOneAndDelete({ id });
    if (!result) {
      return { success: false, message: "Vacancy not found" };
    }
    let addToCause = await addCauseFastWork(result.special, userReason);
    return { success: true, message: "Vacansy removed" };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Error" };
  }
};


let sendRequest = async (id, specialID, message) => {
  try {
    const now = Temporal.Now.plainDateTimeISO();
    const date = new Date(now.toString());
    let isNotRep = await FastWork.findOne({
      id,
      responses: { $elemMatch: { userID: specialID } },
    });
    if (isNotRep) return { success: false, message: "Заявка уже существует!" };
    let findVacancy = await FastWork.findOneAndUpdate(
      { id },
      {
        $push: { responses: { userID: specialID, message, datetime: date } },
      }
    );
    if (!findVacancy) {
      return { success: false, message: "Фаст-Ворк не найден!" };
    }
    if (findVacancy.responses.userID === specialID)
      return { success: false, message: "Заявка уже отправлена" };
    return { success: true, message: "Отклик отправлен!" };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Непредвиденная ошибка" };
  }
};


module.exports = {
  createFastWork,
  updateFastWork,
  sendRequest,
  removeFastWork,
  searchFastWorkById,
  searchFastWorkByUserId,
};
