const input = document.getElementById('specialization')
const allData = {
    firstName: '',
    lastName:'',
    specials: [],
    skills: [],
    expiriens: ''
}
const listItems = document.querySelectorAll('.listSpecialMy li');
const parentListSpecial = document.querySelector('.ParentlistSpecial');
input.addEventListener('input', function() {
    const filter = input.value.toUpperCase();
    let found = false;

    listItems.forEach(function(item) {
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

function select(title) {
    input.value = ''
    parentListSpecial.style.display = "none";
    $('.allSpecial').append(`<div class="selectedSpecial">
    <p>${title}</p>
    <div id="removeSpecial" class="removeSpecial"><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L16 16" stroke="white" stroke-linecap="round"/>
        <path d="M16 1L8.5 8.5L1 16" stroke="white" stroke-linecap="round"/>
        </svg>
        </div>
</div>`)
allData.specials.push(title)
allData.specials = [...new Set(allData.specials)]
console.log(allData.specials)
}
$('.allSpecial').on('click', '.removeSpecial', function() {
    allData.specials = allData.specials.filter((elem) => {
        return elem !== $(this).parent().find('p').text()
    })
    $(this).parent().remove();
    console.log(allData.specials)
});
