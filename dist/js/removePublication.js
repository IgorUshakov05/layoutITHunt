document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector(".removeVacancy")
    .addEventListener("click", function (e) {
      console.log(this.getAttribute("data-id"));
    });
});

function removePublic(id) {
  fetch("/api/removeVacancy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  });
}
