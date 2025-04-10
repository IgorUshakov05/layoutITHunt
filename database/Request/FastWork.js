const FastWork = require("../Schema/FastWork");
const { v4 } = require("uuid");
const { Temporal } = require("@js-temporal/polyfill");
const { addCauseFastWork } = require("../Request/CauseRemovePublication");
const UserSchema = require("../Schema/UserSchema");
const favoriteUserVacancySchema = require("../Schema/FavoriteVacancyOfUserSchema");
const CompanySchema = require("../Schema/Company");
const Premium = require("../Schema/Premium");

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
    console.log(id, " - айди");
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
    const now = new Date();

    let updatedFastWork = await FastWork.findOneAndUpdate(
      {
        id,
        "responses.userID": { $ne: specialID },
      },
      {
        $push: {
          responses: { userID: specialID, message, datetime: now },
        },
      }
    ).select("userID special");
    if (!updatedFastWork) {
      const alreadyResponded = await FastWork.exists({
        id,
        "responses.userID": specialID,
      });

      return {
        success: false,
        message: alreadyResponded
          ? "Вы уже откликнулись"
          : "Вакансия не найдена!",
      };
    }

    return {
      success: true,
      message: "Отклик отправлен!",
      data: updatedFastWork,
    };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Непредвиденная ошибка" };
  }
};

const getFastWorks = async (query, limit = 2, userID = null) => {
  try {
    console.log(query);
    let allFastWorks = await FastWork.find(query)
      .skip(limit - 2)
      .limit(limit);
    let userIDs = [
      ...new Set(
        allFastWorks.map((item) => {
          return item.userID;
        })
      ),
    ];
    let users = await UserSchema.find({ id: { $in: userIDs } }).select(
      "avatar id name surname city"
    );
    let premium = await Premium.find({ userID: { $in: userIDs } }).select(
      "userID"
    );
    premium = premium.map((premium) => premium.userID);

    const company = await CompanySchema.find({
      isVarefy: true,
      isFreez: false,
      userList: {
        $elemMatch: { userID: { $in: userIDs } },
      },
    }).select("id avatar userList isFreez INN isVerefy title");
    let favorites = [];
    if (userID) {
      favorites = await favoriteUserVacancySchema.findOne({ userID });
    }
    // console.log(favorites);
    // console.log(users, " - люди");
    // console.log(company, " - компании");
    // console.log(allFastWorks, " - фаст-ворки");
    return {
      success: true,
      users,
      premium,
      fastWorks: allFastWorks,
      company,
      dateTimeServer: new Date(),
      favorites: favorites?.fastWorkID || [],
    };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Что-то пошло не так!" };
  }
};

module.exports = {
  createFastWork,
  updateFastWork,
  sendRequest,
  getFastWorks,
  removeFastWork,
  searchFastWorkById,
  searchFastWorkByUserId,
};
