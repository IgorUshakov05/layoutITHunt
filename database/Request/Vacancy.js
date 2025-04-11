const Vacancy = require("../Schema/Vakancy");
const UserScheme = require("../Schema/UserSchema");
const { v4 } = require("uuid");
const favoriteUserVacancySchema = require("../Schema/FavoriteVacancyOfUserSchema");
const { Temporal } = require("@js-temporal/polyfill");
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
    const now = new Date();

    const updatedVacancy = await Vacancy.findOneAndUpdate(
      {
        id,
        "responses.userID": { $ne: specialID }, // проверяем, что отклика от этого userID ещё нет
      },
      {
        $push: {
          responses: { userID: specialID, message, datetime: now },
        },
      },
      {
        new: true,
      }
    ).select("userID special");

    if (!updatedVacancy) {
      const alreadyResponded = await Vacancy.exists({
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
      data: updatedVacancy,
    };
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
    // Получаем вакансии, на которые откликался пользователь
    let vacancies = await Vacancy.aggregate([
      {
        $match: {
          "responses.userID": workerID,
          "responses.request": { $in: [true, false] },
        },
      },
      {
        $project: {
          special: 1,
          skills: 1,
          id: 1,
          description: 1,
          userID: 1,
          responses: {
            $filter: {
              input: "$responses",
              as: "resp",
              cond: {
                $and: [
                  { $eq: ["$$resp.userID", workerID] },
                  { $in: ["$$resp.request", [true, false]] },
                ],
              },
            },
          },
        },
      },
    ]);

    if (!vacancies.length) return { success: true, message: "Вакансий нет" };
    let { skills } = await UserScheme.findOne({ id: workerID }).select(
      "skills"
    );

    const hrIDs = [...new Set(vacancies.map((v) => v.userID))]; // Убираем дубликаты из hrIDs
    console.log(hrIDs);

    const companies = await CompanySchema.find({
      isFreez: false,
      isVarefy: true,
      "userList.userID": { $in: hrIDs },
    }).select("id title avatar userList");

    console.log(companies, "компании");

    const [hrUsers, favoritesDoc, premiumDocs] = await Promise.all([
      UserScheme.find({ id: { $in: hrIDs } }).select(
        "id name surname avatar city skills"
      ),
      UserScheme.findOne({ id: workerID }).select("favorite"),
      Premium.find({ userID: { $in: hrIDs } }).select("userID"),
    ]);

    const favoriteHRs = favoritesDoc?.favorite?.map((f) => f.person) || [];
    const premiumHRs = premiumDocs.map((p) => p.userID);

    const formattedVacancies = vacancies.map((vacancy) => {
      const hr = hrUsers.find((u) => u.id === vacancy.userID) || {};

      const companiesForHR = companies.filter((company) =>
        company.userList.some((user) => user.userID === hr.id)
      );
      const companyAvatar =
        companiesForHR.length > 0 ? companiesForHR[0].avatar : null;
      const titleCompany =
        companiesForHR.length > 0 ? companiesForHR[0].title : null;
      const enrichedResponses = vacancy.responses.map((response) => {
        const now = new Date();
        const diff = now - new Date(response.datetime);
        const seconds = Math.floor((diff / 1000) % 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const hours = Math.floor((diff / 1000 / 60 / 60) % 24);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        let timeDifference = "";
        if (days > 0)
          timeDifference = `${days} ${days > 1 ? "дня" : "день"} назад`;
        else if (hours > 0)
          timeDifference = `${hours} ${hours > 1 ? "часа" : "час"} назад`;
        else if (minutes > 0)
          timeDifference = `${minutes} ${
            minutes > 1 ? "минуты" : "минута"
          } назад`;
        else
          timeDifference = `${seconds} ${
            seconds > 1 ? "секунды" : "секунда"
          } назад`;

        return {
          message: response.message,
          hrMessage: response.hrMessage || "",
          request: response.request,
          datetime: response.datetime,
          timeDifference,
        };
      });

      return {
        id: vacancy.id,
        special: vacancy.special,
        description: vacancy.description,
        skills: vacancy.skills,
        workerSkills: skills || [], // Навыки работника
        skills: vacancy.skills, // Навыки вакансии
        responses: enrichedResponses,
        hr: {
          id: hr.id || "",
          name: titleCompany ? titleCompany : hr.name || "",
          surname: titleCompany ? "" : hr.surname,
          city: hr.city || "",
          avatar: companyAvatar ? companyAvatar : hr.avatar || "",
          isFavorite: favoriteHRs.includes(hr.id),
          premium: premiumHRs.includes(hr.id),
        },
      };
    });

    return {
      success: true,
      vacancies: formattedVacancies,
    };
  } catch (e) {
    console.error("Ошибка при получении откликов:", e);
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

const getVacancy = async (
  query,
  limit = 2,
  userID = null,
  companyINN = null
) => {
  try {
    let allVacancies;
    if (companyINN != null) {
      let findFirst = await CompanySchema.findOne({
        INN: companyINN,
        isVarefy: true,
      });
      let getUserID = findFirst.userList.map((user) => user.userID);
      console.log(getUserID);
      allVacancies = await Vacancy.find({
        userID: getUserID,
        ...query,
      });
    } else {
      allVacancies = await Vacancy.find(query)
        .skip(limit - 2)
        .limit(2);
    }

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
    let premium = await Premium.find({ userID: { $in: userIDs } }).select(
      "userID"
    );
    premium = premium.map((premium) => premium.userID);
    console.log(premium, " premium");
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
      premium,
      dateTimeServer: new Date(),
      favorites: favorites?.vacancyID || [],
    };

    //  return {
    //    success: true,
    //    users,
    //    premium,
    //    fastWorks: allFastWorks,
    //    company,
    //    dateTimeServer: new Date(),
    //    favorites: favorites?.fastWorkID || [],
    //  };
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
