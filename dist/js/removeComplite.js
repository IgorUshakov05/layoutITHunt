const next = document.getElementById('remove')



next.addEventListener('click', ()=> {
   try {
    goNextStage()
   } catch (e) {
      console.log(e)
      return e
   }
})
function goNextStage() {
    document.getElementById('oneStage').remove()
    document.getElementById('twoStage').style.display = "block"
}


const back = document.getElementById('back')


back.addEventListener('click', ()=> {
   try {
    goLastStage()
   } catch (e) {
      console.log(e)
      return e
   }
})
function goLastStage() {
    window.location.reload()
}