const FavoriteVacancySchema = require("../Schema/FavoriteVacancyOfUserSchema");
const VacancySchema = require("../Schema/Vakancy");
const FastWorkSchema = require("../Schema/FastWork");

async function isFavoriteVacancy(userID, vacancyID) {
  try {
    let electedVacancyAdd = await FavoriteVacancySchema.findOne({
      userID,
      "vacancyID.id": vacancyID,
    });
    console.log(!!electedVacancyAdd);
    return !!electedVacancyAdd;
  } catch (err) {
    console.log(err);
    return { success: false, error: err.message };
  }
}

async function electedVacancy(userID, vacancyID) {
  try {
    let electedVacancyAdd = await FavoriteVacancySchema.findOneAndUpdate(
      { userID },
      { $setOnInsert: { userID, fastWorkID: [], vacancyID: [] } },
      { new: true, upsert: true }
    );

    let findFavorite = electedVacancyAdd.vacancyID.find(
      (item) => item.id === vacancyID
    );

    if (!findFavorite) {
      await FavoriteVacancySchema.updateOne(
        { userID },
        { $push: { vacancyID: { id: vacancyID } } }
      );
      return { success: true, isNew: true };
    } else {
      await FavoriteVacancySchema.updateOne(
        { userID },
        { $pull: { vacancyID: { id: vacancyID } } }
      );
      return { success: true, isNew: false };
    }
  } catch (err) {
    console.log(err);
    return { success: false, error: err.message };
  }
}

async function findFAllFavoriteOfId(userID) {
  try {
    console.log(userID);
    if (!userID)
      return { success: false, error: "User ID is required", data: [] };
    let electedVacancyAdd = await FavoriteVacancySchema.findOne({ userID });
    console.log(electedVacancyAdd, " вот");
    if (!electedVacancyAdd) return { succes: false };
    return { success: true, data: electedVacancyAdd };
  } catch (err) {
    console.log(err);
    return { success: false, error: err.message, data: [] };
  }
}

async function getMyFavorites(userID) {
  try {
    let electedVacancyAdd = await FavoriteVacancySchema.findOne({ userID });
    console.log(electedVacancyAdd);
    if (!electedVacancyAdd)
      return { success: false, error: "User ID is required", data: null };
    let vacancies = electedVacancyAdd.vacancyID.map((item) => item.id);
    let vacanciesData = await VacancySchema.find(
      { id: { $in: vacancies } },
      { special: 1, id: 1, price: 1, _id: 0 }
    );
    let fastWork = electedVacancyAdd.fastWorkID.map((item) => item.id);
    let fastWorkData = await FastWorkSchema.find(
      { id: { $in: fastWork } },
      { special: 1, id: 1, price: 1, _id: 0 }
    );
    return { success: true, data: [vacanciesData, fastWorkData] };
  } catch (e) {
    return { success: false, error: err.message, data: [] };
  }
}

module.exports = {
  isFavoriteVacancy,
  electedVacancy,
  findFAllFavoriteOfId,
  getMyFavorites,
};
