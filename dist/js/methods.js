const addToFavorites = document.getElementById('addToFavorites')

function makeInFuture() {
    addToFavorites.className = 'Infavorites addingFavorite'
}

function removeFuture() {
    addToFavorites.className = 'Infavorites'
}

$('.titleCompanyAndPhoto').on('click',() => {
    $('.descriptionCompanyInVacansy').toggle()
})

addToFavorites.addEventListener('click', () => {
    if(addToFavorites.classList[1] === 'addingFavorite') {
        removeFuture()    
    }
    else {
        makeInFuture()
    }
})