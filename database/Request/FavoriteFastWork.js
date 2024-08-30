const FavoriteSchema = require("../Schema/FavoriteVacancyOfUserSchema");
const FastWorkSchema = require("../Schema/FastWork");

async function isFavoriteFastWork(userID, vacancyID) {
  try {
    let electedVacancyAdd = await FavoriteSchema.findOne({
      userID,
      "fastWorkID.id": vacancyID,
    });
    console.log(!!electedVacancyAdd);
    return !!electedVacancyAdd;
  } catch (err) {
    console.log(err);
    return { success: false, error: err.message };
  }
}

async function electedFastWork(userID, fastWorkID) {
  try {
    let electedVacancyAdd = await FavoriteSchema.findOneAndUpdate(
      { userID },
      { $setOnInsert: { userID, fastWorkID: [], vacancyID: [] } },
      { new: true, upsert: true }
    );
    // Проверить, существует ли уже fastWorkID
    let findFavorite = electedVacancyAdd.fastWorkID.find(
      (item) => item.id === fastWorkID
    );

    // Если не существует, добавить в список, иначе удалить
    if (!findFavorite) {
      await FavoriteSchema.updateOne(
        { userID },
        { $push: { fastWorkID: { id: fastWorkID } } }
      );
      return { success: true, isNew: true };
    } else {
      await FavoriteSchema.updateOne(
        { userID },
        { $pull: { fastWorkID: { id: fastWorkID } } }
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
    let electedVacancyAdd = await FavoriteSchema.findOne({ userID });
    return { success: true, data: electedVacancyAdd };
  } catch (err) {
    console.log(err);
    return { success: false, error: err.message, data: [] };
  }
}

async function getMyFavorites(userID) {
  try {
    let electedVacancyAdd = await FastWorkSchema.findOne({ userID });
    console.log(electedVacancyAdd);
    if (!electedVacancyAdd)
      return { success: false, error: "User ID is required", data: [] };
    let vacancies = electedVacancyAdd.vacancyID.map((item) => item.id);
    let vacanciesData = await VacancySchema.find(
      { id: { $in: vacancies } },
      { special: 1, id: 1, price: 1, _id: 0 }
    );
    return { success: true, data: vacanciesData };
  } catch (e) {
    return { success: false, error: err.message, data: [] };
  }
}

module.exports = {
  isFavoriteFastWork,
  electedFastWork,
  findFAllFavoriteOfId,
  getMyFavorites,
};
