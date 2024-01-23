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
  