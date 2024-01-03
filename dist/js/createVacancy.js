// Select the input field
const input = document.getElementById('specialisationSelect');
// Select all the list items
const listItems = document.querySelectorAll('.listSpecialMy li');
// Select the parent container
const parentListSpecial = document.querySelector('.ParentlistSpecial');
let allData = {
    special: ''
}
// Add event listener for input changes
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
    if (!found) {
        parentListSpecial.style.display = "none";
    } else {
        parentListSpecial.style.display = "block";
    }
});


function select(pic,title) {
    $('.boxSelection').css('display', 'flex')
    $('.titleJobItem').text(title)
    $('.noneMake').toggle()
    $('.selectImg').attr('src',pic)
    allData.special = title
}

$('.canesSelect').on('click', () => {
    $('.boxSelection').css('display', 'none')
    $('.titleJobItem').text('')
    $('.noneMake').toggle()
    allData.special = ''
    $('.selectImg').attr('src','')
})