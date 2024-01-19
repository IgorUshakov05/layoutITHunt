$('.removeMySkill').on('click', () => {
    $('.mySkills').hide()
    $('.d-none').show()
})

$('.canelSkill').on('click', () => {
    console.log("Нажимается");
    $('.mySkills').show()
    $('.d-none').hide()
})