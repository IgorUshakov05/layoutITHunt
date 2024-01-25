$('.removeMySkill').on('click', () => {
    $('.mySkills').hide()
    $('.d-none').show()
})

$('.canelSkill').on('click', () => {
    console.log("Нажимается");
    $('.mySkills').show()
    $('.d-none').hide()
})
$('.topInfoExpiriensItem').on('click', function() {
    $(this).parent().find('.middleInfoExp').toggle();

    $(this).find('.MyVacExp').toggleClass('boldEn');
    $(this).find('.titleCompanyExp').toggleClass('boldEn');
    $(this).find('.timeJobAndShowAll').find('.TimeJob').toggleClass('boldEn');


    $(this).find('.timeJobAndShowAll').find('.expand').find('.rotatePls').toggleClass('rotate180');
  });
  
$('.onClick').on('click', function(){
    $(this).find('.myListOnClick').toggle()
    $(this).find('.rot').toggleClass('rotate180');
})

const addExpiriensModal = document.getElementById('addExpiriens')
const closeAddExpiriens = document.getElementById('closeAddExpiriens')
const openAddExpiriendModal = document.getElementById('openAddExpiriendModal')

closeAddExpiriens.addEventListener('click', () => {
    addExpiriensModal.close()
    $('.blackBack').css('display', 'none')
})

openAddExpiriendModal.addEventListener('click', () => {
    $('.blackBack').css('display', 'block')
    addExpiriensModal.show()
})


const addSkillButton = document.getElementById('addSkillButton')
const closeSkillModal = document.getElementById('closeSkillModal')
const addSkill = document.getElementById('addSkill')

closeSkillModal.addEventListener('click', () => {
    addSkill.close()
    $('.blackBack').css('display', 'none')
})

addSkillButton.addEventListener('click', () => {
    $('.blackBack').css('display', 'block')
    addSkill.show()
})


const addEdButton = document.getElementById('addEdButton')
const closeEduModal = document.getElementById('closeEduModal')
const addEuctionModal = document.getElementById('addEuctionModal')

closeEduModal.addEventListener('click', () => {
    addEuctionModal.close()
    $('.blackBack').css('display', 'none')
})

addEdButton.addEventListener('click', () => {
    $('.blackBack').css('display', 'block')
    addEuctionModal.show()
})


$('.eduSchool').on('click', function () {
    $(this).find('.paddAndBor').toggleClass('activeRm')
})

$('.butForSelectEdu').on('click', function () {
    $('.listEduRus').toggle()
    $(this).children('svg').toggleClass('rotate180');
})

