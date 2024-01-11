let infoAbautCompany = {
    title: "",
    photo: "",
    description: ""
}

document.getElementById('descriptionCompany').addEventListener('input', function() {
    if (this.value.length > 250) {
        this.value = this.value.slice(0, 250);  // Обрезаем до 250 символов, если превышено
    }
    const remainingCharacters = 250 - this.value.length;
    document.getElementById('reminder').textContent = `Осталось символов: ${Math.max(0, remainingCharacters)}`;
});



