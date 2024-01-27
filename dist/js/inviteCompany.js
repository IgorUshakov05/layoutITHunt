document.querySelectorAll('.inpCheck').forEach(function(item) {
    item.addEventListener('change', function() {
      document.querySelector('.lastSelect').classList.remove('selectedRadio');
      document.querySelector('.firstSelect').classList.remove('selectedRadio');
      let thisValue = this.value;
      if (thisValue === 'last') {
        document.querySelector('.lastSelect').classList.add('selectedRadio');
      } else {
        document.querySelector('.firstSelect').classList.add('selectedRadio');
      }
    });
  });

$('.reject').on('click', function () {
    $(this).css('display', 'none')
    $(this).parent().find('.responseD').css('display', 'none')
    $(this).parent().parent().find('.timeSeen').css('display', 'none')
    $(this).parent().parent().find('.InCompanyGren').css('display', 'none')
    $(this).parent().find('.canelRespons').css('display', 'block').removeClass('greenLight').addClass('redLight')
    $(this).parent().parent().find('.InCompanyRed').css('display', 'block')
})

$('.responseD').on('click', function () {
    $(this).css('display', 'none')
    $(this).parent().find('.reject').css('display', 'none')
    $(this).parent().parent().find('.timeSeen').css('display', 'none')
    $(this).parent().parent().find('.InCompanyRed').css('display', 'none')
    $(this).parent().find('.canelRespons').css('display', 'block').removeClass('redLight').addClass('greenLight')
    $(this).parent().parent().find('.InCompanyGren').css('display', 'block')
})

$('.canelRespons').on('click', function () {
    $(this).css('display', 'none')
    $(this).parent().find('.responseD').css('display', 'block')
    $(this).parent().find('.reject').css('display', 'block')
})