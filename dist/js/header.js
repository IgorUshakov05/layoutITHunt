$(document).ready(function() {
    const $burgerButton = $(".burger");
    const $mobileMenu = $(".mobile");
    const $main = $('main');
    const $openClose = $('.open-close');

    $burgerButton.on("click", function(event) {
        event.stopPropagation();
        $mobileMenu.toggle(); // Переключение видимости мобильного меню
        if ($mobileMenu.is(':visible')) {
            $('body').css('overflow-y', 'hidden'); // Заблокировать вертикальную прокрутку
        } else {
            $('body').css('overflow-y', 'auto'); // Восстановить вертикальную прокрутку
        }
        $burgerButton.toggleClass("rotate-burger"); // Добавление/удаление класса для поворота иконки бургера
    });


    $main.on('click touchstart', function () {
        $mobileMenu.css('display', 'none')
        $('body').css('overflow-y', 'auto');
        $burgerButton.removeClass('rotate-burger')
    })
    $('.open-close').on('click', function() {
        var paragraph = $(this).siblings('p');


        $(this).toggleClass('rotate')
         paragraph.toggleClass('some-class');
    });

    $(".response").click(function() {
        // Используем метод slideToggle() для плавного открытия/скрытия элемента с классом "request"
        $(this).find(".request").slideToggle();
        $(this).toggleClass("responseClick")
        $(this).find('.text > p').toggleClass('while')
    });

    $("#openModal").click(function() {
        $(".modal").css('display', 'flex');
    });
    // Обработчик для клика по кнопке "Назад"
    $('#backBtn').click(function() {
        $(".modal").css('display', 'none');
    });
    
    $('.openFilter').on('click', function() {
        $('.filt').toggleClass('clearFilt')
        // Получаем текущий текст внутри элемента <p>
        var currentText = $('.openFilter p').text();

        // Изменяем текст в зависимости от текущего значения
        if (currentText === 'Закрыть фильтр') {
            $('.openFilter p').text('Раскрыть фильтр');
        } else {
            $('.openFilter p').text('Закрыть фильтр');
        }
        });
            
    $(".showFull").on("click", function () {
        let descriptionVacansyText = $(this).prev(".descriptionVacansy");
        descriptionVacansyText.toggleClass("fullText");
        var buttonText = $(this).find(".showFullText");
        buttonText.text(function(i, text){
        return text === "Показать полностью" ? "Свернуть" : "Показать полностью";
            });
    });


    // if ($(window).width() <= 1100) {
    //     $('.filt').addClass('clearFilt');
    // }

    // // Добавляем обработчик изменения размера окна
    $(window).on('resize', function () {
        // Проверяем ширину окна и скрываем фильтр, если необходимо
        if ($(window).width() > 1100) {
            $('.filt').removeClass('clearFilt');
        }})

    

});
