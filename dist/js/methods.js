const addToFavorites = document.getElementById('addToFavorites')

function makeInFuture() {
    addToFavorites.className = 'Infavorites addingFavorite'
}

function removeFuture() {
    addToFavorites.className = 'Infavorites'
}

addToFavorites.addEventListener('click', () => {
    if(addToFavorites.classList[1] === 'addingFavorite') {
        removeFuture()    
    }
    else {
        makeInFuture()
    }
})