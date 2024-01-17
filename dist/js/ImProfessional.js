$('.removeMySkill').on('click', () => {
    $('.mySkills').hide()
    $('.d-none').show()
})

$('.canelSkill').on('click', () => {
    $('.mySkills').show()
    $('.d-none').hide()
})