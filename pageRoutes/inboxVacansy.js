const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../api/tokens/accessToken");
const { getAllRespond, getAllRequest } = require("../database/Request/Vacancy");
router.get("/inbox/vacancies", async (req, res) => {
  let access = req.cookies.access;
  console.log(req.query);
  let user = await decodeAccessToken(access);
  if (!access || !user) return res.redirect("/login");
  // if (user.userROLE !== "creatorWork" || user.userROLE !== "worker")
  //   return res.redirect("/login");
  console.log(user.userROLE, " - Это");
  let vacancies, users, success;

  if (user.userROLE === "creatorWork") {
    try {
      // getAllRequest;
      const result = await getAllRespond(user.userID);
      ({ vacancies, users, success } = result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  } else if (user.userROLE === "worker") {
    const result = await getAllRequest(user.userID);
    ({ vacancies, success, users } = result);
  } else {
    return res.redirect("/login");
  }

  // Now use vacancies, users, and success as needed
  console.log(success);
  if (!success) return await res.redirect("/");
  return await res.render("inboxVacansy", {
    isLoggedIn: !!user,
    id: user.userID,
    vacancies,
    users,
    role: user.userROLE,
    chatList: user.chatList || null,
  });
});

module.exports = router;
