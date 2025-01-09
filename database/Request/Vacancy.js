const Vacancy = require("../Schema/Vakancy");
const UserScheme = require("../Schema/UserSchema");
const { v4 } = require("uuid");
const favoriteUserVacancySchema = require("../Schema/FavoriteVacancyOfUserSchema");
const { Temporal } = require("@js-temporal/polyfill");
const ReasonRMVacancy = require("../Schema/ReasonRemoveVacansy");
const CompanySchema = require("../Schema/Company");
const Premium = require("../Schema/Premium");
const { addCauseVacancy } = require("./CauseRemovePublication");
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

let getAllRespond = async (hrID) => {
  try {
    // Fetch vacancies for the given hrID
    let vacancies = await Vacancy.find({
      userID: hrID,
    }).select("special skills responses id description");

    console.log(vacancies);
    if (!vacancies.length) return { success: true, message: "Вакансий нет" };

    let userIDs = vacancies.flatMap((vacancy) =>
      vacancy.responses.map((response) => response.userID)
    );
    let getFavoriteUser = await UserScheme.findOne({ id: hrID }).select(
      "favorite"
    );
    let favoriteUsers = getFavoriteUser.favorite
      ? getFavoriteUser.favorite.map((favoriteUser) => favoriteUser.person)
      : [];
    console.log(getFavoriteUser);
    let users = await UserScheme.find({ id: { $in: userIDs } }).select(
      "id name surname skills avatar job city"
    );
    let premium = await Premium.find({ userID: { $in: userIDs } }).select(
      "userID"
    );
    premium = premium.map((premium) => premium.userID);

    let formattedVacancies = vacancies.map((vacancy) => {
      return {
        id: vacancy.id,
        special: vacancy.special,
        description: vacancy.description,
        responses: vacancy.responses
          .filter((response) => response.isRead === false)
          .map((response) => {
            const user = users.find((u) => u.id === response.userID) || {};

            const now = new Date();
            const diffTime = Math.abs(now - new Date(response.datetime));
            const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
            const minutes = Math.floor(
              (diffTime % (1000 * 60 * 60)) / (1000 * 60)
            );
            const hours = Math.floor(
              (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            let timeDifference = "";
            if (days > 0) {
              timeDifference = `${days} ${days > 1 ? "дня" : "день"} назад`;
            } else if (hours > 0) {
              timeDifference = `${hours} ${hours > 1 ? "часа" : "час"} назад`;
            } else if (minutes > 0) {
              timeDifference = `${minutes} ${
                minutes > 1 ? "минуты" : "минута"
              } назад`;
            } else {
              timeDifference = `${seconds} ${
                seconds > 1 ? "секунды" : "секунда"
              } назад`;
            }
            return {
              userID: response.userID,
              message: response.message,
              name: user.name || "",
              surname: user.surname || "",
              job: user.job || "",
              datetime: response.datetime,
              city: user.city || "",
              isFavorite: favoriteUsers.includes(response.userID),
              timeDifference,
              premium: premium.includes(response.userID),
              avatar: user.avatar || "",
              skills: user.skills || [],
            };
          }),
        skills: vacancy.skills,
      };
    });
    return { success: true, vacancies: formattedVacancies };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Сервер упал!" };
  }
};

let getAllRequest = async (workerID) => {
  try {
    let vacancies = await Vacancy.find({
      "responses.userID": workerID,
      "responses.request": { $in: [true, false] },
    }).select("special skills responses id description");
    console.log(vacancies);
    if (!vacancies.length) return { success: true, message: "Вакансий нет" };

    let userIDs = vacancies.flatMap((vacancy) =>
      vacancy.responses.map((response) => response.userID)
    );
    let getFavoriteUser = await UserScheme.findOne({ id: workerID }).select(
      "favorite"
    );
    let favoriteUsers = getFavoriteUser.favorite
      ? getFavoriteUser.favorite.map((favoriteUser) => favoriteUser.person)
      : [];
    console.log(getFavoriteUser);
    let users = await UserScheme.find({ id: { $in: userIDs } }).select(
      "id name surname skills avatar job city"
    );
    let premium = await Premium.find({ userID: { $in: userIDs } }).select(
      "userID"
    );
    premium = premium.map((premium) => premium.userID);

    let formattedVacancies = vacancies.map((vacancy) => {
      return {
        id: vacancy.id,
        special: vacancy.special,
        description: vacancy.description,
        responses: vacancy.responses
          .filter((response) => response.isRead === false)
          .map((response) => {
            const user = users.find((u) => u.id === response.userID) || {};

            const now = new Date();
            const diffTime = Math.abs(now - new Date(response.datetime));
            const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
            const minutes = Math.floor(
              (diffTime % (1000 * 60 * 60)) / (1000 * 60)
            );
            const hours = Math.floor(
              (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            let timeDifference = "";
            if (days > 0) {
              timeDifference = `${days} ${days > 1 ? "дня" : "день"} назад`;
            } else if (hours > 0) {
              timeDifference = `${hours} ${hours > 1 ? "часа" : "час"} назад`;
            } else if (minutes > 0) {
              timeDifference = `${minutes} ${
                minutes > 1 ? "минуты" : "минута"
              } назад`;
            } else {
              timeDifference = `${seconds} ${
                seconds > 1 ? "секунды" : "секунда"
              } назад`;
            }
            return {
              userID: response.userID,
              message: response.message,
              name: user.name || "",
              surname: user.surname || "",
              job: user.job || "",
              datetime: response.datetime,
              city: user.city || "",
              isFavorite: favoriteUsers.includes(response.userID),
              timeDifference,
              premium: premium.includes(response.userID),
              avatar: user.avatar || "",
              skills: user.skills || [],
            };
          }),
        skills: vacancy.skills,
      };
    });
    return { success: true, vacancies: formattedVacancies };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Сервер упал!" };
  }
};

let AnswerOfSolution = async (
  workerID,
  vacancyID,
  solution,
  userID,
  message
) => {
  try {
    let getRequest = await Vacancy.findOne({
      id: vacancyID,
      userID,
      responses: { $elemMatch: { userID: workerID } },
    });

    if (!getRequest) return { success: false, message: "Отклик не найден" };
    let response = getRequest.responses.find((u) => u.userID === workerID);
    if (!response) return { success: false, message: "Отклик не найден" };
    console.log(message);
    let answer = await Vacancy.findOneAndUpdate(
      {
        id: vacancyID,
        userID,
        responses: { $elemMatch: { userID: workerID } },
      },
      {
        $set: {
          "responses.$.isRead": solution === null ? false : true,
          "responses.$.hrMessage": solution === null ? null : message,
          "responses.$.request": solution,
        },
      }
    );
    if (!answer) return { success: false, message: "Что-то пошло не так!" };
    return { success: true, message: answer };
  } catch (e) {
    console.log(e);
  }
};

const getVacancy = async (query, limit = 2, userID = null) => {
  try {
    let allVacancies = await Vacancy.find(query)
      .skip(limit - 2)
      .limit(2);
    let userIDs = [
      ...new Set(
        allVacancies.map((item) => {
          return item.userID;
        })
      ),
    ];
    let users = await UserScheme.find({ id: { $in: userIDs } }).select(
      "avatar id name surname city"
    );
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
    console.log(favorites);
    // console.log(users, " - люди");
    // console.log(company, " - компании");
    // console.log(allVacancies, " - вакансии");
    return {
      success: true,
      users,
      vacancies: allVacancies,
      company,
      dateTimeServer: new Date(),
      favorites: favorites?.vacancyID || [],
    };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Что-то пошло не так!" };
  }
};
module.exports = {
  createVacancy,
  updateVacansy,
  AnswerOfSolution,
  getVacancy,
  searchVacancyById,
  getAllRequest,
  searchVacancyByUserId,
  removeVacancy,
  getAllRespond,
  sendRequest,
};
