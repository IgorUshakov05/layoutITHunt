let data = {
    inn: 0,
    img: ''
}
$('#nameCompany').on('input', function ()  {
    if ($('#nameCompany').val().length > 0) {
        $('.companyForSelect').css('display', 'block')
        $('#nameCompany').addClass('hasList')
    }
    else {
        $('.companyForSelect').css('display', 'none')
        $('#nameCompany').removeClass('hasList')
    }
})

// Используйте делегирование событий для обработки клика на динамически добавленных элементах
$('.seleced').on('click', function() {
    const companyTitle = $(this).closest('li').find('.companyTitle').text();  // Получаем текст заголовка компании
    const inn = $(this).closest('li').find('.inn').text();  // Получаем текст ИНН
    const src = $(this).closest('li').find('.picCompany img').attr('src');  // Получаем значение атрибута src изображения

    console.log(companyTitle, inn, src);  // Выводим результат в консоль
    data.inn = inn
    data.img = src
    $('.bigBox').append(`
    <div class="specialisationSelectInput selecteCompany"  style="margin-top: 12px;">
                            <div class="infoSelectCOmpany">
                                <div class="groupInfo">
                                
                                   <div class="picCompany">
                                <img width="39" height="39" src="${src}" alt="Выбранная компания">
                                </div>
                                <div class="titleCompanyAndINN">
                                <h1 class="companyTitle">${companyTitle}</h1>
                                <p class="inn">${inn}</p>
                                </div>
                                </div>
                                <div class="canelSelect">
                                <span class="selectNo">Отменить</span>
                                </div>
                                </div> 
                        </div>
                        `)
    $('.grupAbsolute').toggle();
    $('.companyForSelect').css('display', 'none')
    $('#nameCompany').val('');  // Присвоение значения полю ввода
    $('#toTwoStage').removeAttr('disabled')
});

$('#bigBox').on('click', '.selectNo', () => {
    $('.grupAbsolute').toggle();
    $('#toTwoStage').attr('disabled',true)
    data.inn = 0
    data.img = ''
    $('.selecteCompany').remove()
});


$('#toTwoStage').on('click', () => {
    if(data.inn==0) {
        return false
    }
    else {
        $('.here').attr('href',data.img)
    $('.windowFinally').css('display', 'flex')
    $('.data').css('height', '0').css('overflow', 'hidden')
    $('.createCompanyMain').css('background', "#5412E0").css('box-shadow', 'none')
    $('.addOrg').css('color','white')
}
})
