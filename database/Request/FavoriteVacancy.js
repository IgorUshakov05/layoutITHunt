const FavoriteVacancySchema = require("../Schema/FavoriteVacancyOfUserSchema");

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
      { $setOnInsert: { userID, vacancyID: [] } },
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
    if(!userID) return { success: false, error: "User ID is required", data: [] };
    let electedVacancyAdd = await FavoriteVacancySchema.findOne({ userID });
    return { success: true, data: electedVacancyAdd };
  } catch (err) {
    console.log(err);
    return { success: false, error: err.message, data: [] };
  }
}

module.exports = { isFavoriteVacancy, electedVacancy, findFAllFavoriteOfId };
