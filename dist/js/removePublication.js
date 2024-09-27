let idPublication = null;
let text = null;
let type = null;
document.addEventListener("DOMContentLoaded", () => {
  let removeVButton = document.querySelectorAll(".removeVButton");
  for (const button of removeVButton) {
    button.addEventListener("click", function (e) {
      type = "vacancy";
      idPublication = this.dataset.id;
      document.querySelector(".blackBack").style.display = "block";
      document.getElementById("removePublication").style.display = "block";
    });
  }

  let removeFButton = document.querySelectorAll(".removeFButton");
  for (const button of removeFButton) {
    button.addEventListener("click", function (e) {
      type = "fastwork";
      idPublication = this.dataset.id;
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
async function removePublic(id, type) {
  try {
    let result = await fetch("/api/removePublication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "augwod89h1h9awdh9py0y82hjd",
      },
      body: JSON.stringify({ type, id, text }),
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
    idPublication = null;
    document.querySelector(".blackBack").style.display = "none";
    document.getElementById("removePublication").style.display = "none";
  });

document
  .getElementById("removePublic")
  .addEventListener("click", async function (e) {
    let removeVacancy = await removePublic(idPublication, type);
    console.log(removeVacancy);
    if (removeVacancy.success) {
      window.location.reload();
    } else {
      alert("Ошибка удаления вакансии");
    }
  });
