let idVacancy = null;
let text = null;
document.addEventListener("DOMContentLoaded", () => {
  let removesButton = document.querySelectorAll(".removeVacancy");
  for (const button of removesButton) {
    button.addEventListener("click", function (e) {
      idVacancy = this.dataset.id;
      document.querySelector(".blackBack").style.display = "block";
      document.getElementById("removePublication").style.display = "block";
    });
  }
});
document.getElementById("Yees").addEventListener("click", function (e) {
  text = 1;
});
document.getElementById("notClick").addEventListener("click", function (e) {
  text = 2;
});
document.getElementById("notActualy").addEventListener("click", function (e) {
  text = 3;
});
async function removePublic(id) {
  try {
    let result = await fetch("/api/removeVacancy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "augwod89h1h9awdh9py0y82hjd",
      },
      body: JSON.stringify({ id, text }),
    }).then((obj) => obj.json());
    return result;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

document
  .querySelector(".removePublicToServer")
  .addEventListener("click", function (e) {
    idVacancy = null;
    document.querySelector(".blackBack").style.display = "none";
    document.getElementById("removePublication").style.display = "none";
  });

document
  .getElementById("removePublic")
  .addEventListener("click", async function (e) {
    let removeVacancy = await removePublic(idVacancy);
    console.log(removeVacancy);
    if (removeVacancy.success) {
      window.location.reload();
    } else {
      alert("Ошибка удаления вакансии");
    }
  });
