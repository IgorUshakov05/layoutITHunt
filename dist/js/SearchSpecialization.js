let url = new URL(window.location.origin);
console.log(url.search);
const parentSkill = document.querySelector(".listAddadSkills");
const inputSkills = document.getElementById("skills");
const input = document.getElementById("specialization");
const allData = {
  firstName: "",
  lastName: "",
  job: [],
  skills: [],
  city: "",
  expiriens: [],
};

let removeSkill = (title) => {
  try {
    document.querySelector(`.skill[data-title="${title}"]`).remove();
    console.log(title);
    allData.skills = allData.skills.filter((skill) => skill != title);
  } catch (e) {
    console.log(e);
  }
};
inputSkills.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    let value = e.target.value.trim();
    if (!value) return false;
    allData.skills.push(value);
    parentSkill.innerHTML = "";
    allData.skills.forEach((skill) => {
      const li = document.createElement("li");
      li.innerHTML = `<div class="skill" data-title="${skill}">
                            <p class="titleSkill">${skill}</p>
                            <div onClick="removeSkill('${skill}')" id="removeSpecial" class="removeSpecial"><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L16 16" stroke="white" stroke-linecap="round"/>
                                <path d="M16 1L8.5 8.5L1 16" stroke="white" stroke-linecap="round"/>
                                </svg>
                            </div>
                        </div> `;
      parentSkill.appendChild(li);
    });
    this.value = "";
    setLisnk("skills", JSON.stringify(allData.skills));
  }
});
function selectExpiriens(value) {
  value = value.split("-");
  if (Number.isNaN(Number(value[0]))) {
    allData.expiriens = [];
    url.searchParams.delete("expiriens");
    return;
  }
  allData.expiriens = [value[0], value[1] ? value[1] : null];
  setLisnk("expiriens", JSON.stringify(allData.expiriens));
  return;
}
const firstAndLastName = document.getElementById("firstAndLastName");
$("#firstAndLastName").on("input", () => {
  try {
    let value = firstAndLastName.value
      .trim()
      .split(" ")
      .filter((elem) => {
        return elem.trim() !== "";
      });

    allData.firstName =
      value[0][0].toUpperCase() + value[0].slice(1, value[0].length);
    allData.lastName =
      value[1][0].toUpperCase() + value[1].slice(1, value[1].length);

    firstAndLastName.value = `${allData.firstName || ""} ${
      allData.lastName || ""
    }`;
    setLisnk("name", allData.lastName);
    setLisnk("surname", allData.firstName);
  } catch (e) {
    return false;
  }
});

let setLisnk = (nameQueryParam, valueQueryParam) => {
  console.log(nameQueryParam, valueQueryParam);
  url.searchParams.delete(nameQueryParam);
  url.searchParams.append(nameQueryParam, valueQueryParam);
  console.log(url.search);
  document
    .querySelector(".sendForm")
    .setAttribute("href", "/specialists" + url.search);
};

const listItems = document.querySelectorAll(".listSpecialMy li");
const parentListSpecial = document.querySelector(".ParentlistSpecial");
input.addEventListener("input", function () {
  const filter = input.value.toUpperCase();
  let found = false;

  listItems.forEach(function (item) {
    // Get the label text and convert it to uppercase for case-insensitive comparison
    const label = item.querySelector("label").textContent.toUpperCase();

    // If the input text is found in the label, display the item and set found to true
    if (label.indexOf(filter) > -1) {
      item.style.display = "block";
      found = true;
    } else {
      item.style.display = "none";
    }
  });

  // If no items found, hide the parent container; otherwise, show it
  if (!found || filter.length == 0) {
    parentListSpecial.style.display = "none";
  } else {
    parentListSpecial.style.display = "block";
  }
});
document.getElementById("searchCity").addEventListener("input", function (e) {
  let value = e.target.value;
  allData.city = value;
  setLisnk("city", allData.city);
});
function select(title) {
  input.value = "";
  parentListSpecial.style.display = "none";
  $(".allSpecial").append(`<div class="selectedSpecial">
    <p>${title}</p>
    <div id="removeSpecial" class="removeSpecial"><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L16 16" stroke="white" stroke-linecap="round"/>
        <path d="M16 1L8.5 8.5L1 16" stroke="white" stroke-linecap="round"/>
        </svg>
        </div>
</div>`);
  allData.job.push(title);
  allData.job = [...new Set(allData.job)];
  setLisnk("job", JSON.stringify(allData.job));
}

$(".allSpecial").on("click", ".removeSpecial", function () {
  allData.job = allData.job.filter((elem) => {
    return elem !== $(this).parent().find("p").text();
  });
  $(this).parent().remove();
  console.log(url.search);
});

function makeInFuture(element) {
  $(element).addClass("addingFavorite");
}

// Функция для удаления класса
function removeFuture(element) {
  $(element).removeClass("addingFavorite");
}

document.querySelectorAll(".inFav").forEach(function (item) {
  item.addEventListener("click", function () {
    let id = this.getAttribute("data-id");
    fetch("/api/favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "augwod89h1h9awdh9py0y82hjd",
      },
      body: JSON.stringify({ id }),
    })
      .then((obj) => obj.json())
      .then((obj) => {
        if (obj.result) {
          makeInFuture(item);
        } else {
          removeFuture(item);
        }
      });
    // if (item.classList.contains("addingFavorite")) {
    // } else {
    // }
  });
});
