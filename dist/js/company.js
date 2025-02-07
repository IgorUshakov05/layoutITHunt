let url = new URL(window.location.href);
const link_url = document.getElementById("send");
const Load = () => {
  link_url.setAttribute("href", url.search);
};
const input_special = document.getElementById("special");

Load();
const changeURL = (name, value) => {
  if (
    value === null ||
    value === undefined ||
    value === 0 ||
    value == "[]" ||
    value == []
  ) {
    console.log(dataSearch);

    url.searchParams.delete(name);
    link_url.search = url.search;
    return;
  }
  url.searchParams.delete(name);
  url.searchParams.append(name, value);
  link_url.search = url.search;
};
let dataSearch = {
  special: JSON.parse(url.searchParams.get("special")) || [],
  skills: JSON.parse(url.searchParams.get("skills")) || [],
  price: {
    minPrice: url.searchParams.get("price_min") || 0,
    maxPrice: url.searchParams.get("price_max") || 0,
  },
};

input_special.addEventListener("input", function (e) {
  let searchValue = e.target.value;
  if (!searchValue || searchValue.length <= 1) {
    document.querySelector(".specialList").style.display = "none";
    return;
  }
  document.querySelector(".specialList").style.display = "";
  const allItems = document.querySelectorAll(".optionsSelectSpecItem");
  if (allItems.length <= 0) {
    document.querySelector(".specialList").style.display = "none";
    return;
  }
  const regex = new RegExp(searchValue, "i");
  for (const item of allItems) {
    let dataTitle = item.getAttribute("data-title");
    if (regex.test(dataTitle)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  }
});

document.querySelectorAll(".specialItem").forEach((item) => {
  item.addEventListener("click", function (e) {
    input_special.value = "";
    if (dataSearch.special.includes(item.getAttribute("data-title")))
      return false;
    dataSearch.special.push(item.getAttribute("data-title"));
    document.querySelector(".specialList").style.display = "none";
    selectedSpecialList.style.display = "flex";
    let appendItem = `<div class="selectedSpecial forRemove" onClick="removeSpecial('${item.getAttribute(
      "data-title"
    )}')" data-title="${item.getAttribute("data-title")}">
                    <p>${item.getAttribute("data-title")}</p>
                    <div class="removeSpecial">
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1L16 16"
                          stroke="white"
                          stroke-linecap="round"
                        />
                        <path
                          d="M16 1L8.5 8.5L1 16"
                          stroke="white"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                  </div>`;
    selectedSpecialList.insertAdjacentHTML("afterbegin", appendItem);
    changeURL("special", JSON.stringify(dataSearch.special));
  });
});
