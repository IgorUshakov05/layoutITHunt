function searchMessages() {
    var input, filter, messages, message, text, i, matches;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase().trim();
    messages = Array.from(document.querySelectorAll('.boxMessage'));
    matches = 0;
        messages.forEach((msg) => {
            message = msg.querySelector('.hisMessage');
            text = message.textContent || message.innerText;
            if (text.toUpperCase().indexOf(filter) > -1) {
                msg.style.display = '';
                matches++;
            } else {
                msg.style.display = 'none';
            }
        });
        
        if((input.value.trim()).length === 0) {
            document.getElementById('score').innerText = '0';
        }
        else {
            document.getElementById('score').innerText = matches;
        }
    }
let close = `<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 1L9 9M17 17L9 9M9 9L17 1L1 17" stroke="#5412E0"/>
</svg>` //Крестик 

let etc = `<svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="2" cy="2" r="2" fill="#5412E0"></circle>
<circle cx="2" cy="8" r="2" fill="#5412E0"></circle>
<circle cx="2" cy="14" r="2" fill="#5412E0"></circle>
</svg>` //Три точки

let ScaleGlass = `<svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.5909 9.63636C18.5909 14.632 14.5411 18.6818 9.54547 18.6818C4.54979 18.6818 0.5 14.632 0.5 9.63636C0.5 4.64069 4.54979 0.590897 9.54547 0.590897C14.5411 0.590897 18.5909 4.64069 18.5909 9.63636Z" stroke="black"></path>
<path d="M15.4541 16.4546L20.4541 21.4546" stroke="black"></path>
</svg>` //Лупа


$('body').on('click', () => {
    $('body').css('overflow-y', 'hidden')
})

//При наатии на лупу ПК

$('.whereMyMessage').eq(0).on('click', () => {
// При закрытии
if($('.whereMyMessage').hasClass('crest')) {
    // Показ всех сообщений
    let messages = Array.from(document.querySelectorAll('.boxMessage'));
        messages.forEach((msg) => {
                msg.style.display = '';
        });
    $('.searchMessageModalWindow').removeClass('showModalWind')
    $('.whereMyMessage').eq(0).removeClass('crest').html(ScaleGlass)
    $('.openMethodsMEnu').html(etc).removeClass('crest')
    $('.windowMethodsChatMobile').removeClass('showModalWind')
}
// При открытии
else {
    $('.searchMessageModalWindow').addClass('showModalWind')
    $('.whereMyMessage').eq(0).addClass('crest').css('padding', '0').eq(0).html(close)
    $('.openMethodsMEnu').addClass('crest').html(close)
    $('.windowMethodsChatMobile').removeClass('showModalWind')
}
})


$('.openMethodsMEnu').on('click', () => {
    // При закрытии
    if($('.openMethodsMEnu').hasClass('crest')) {
        // Показ всех сообщений
        let messages = Array.from(document.querySelectorAll('.boxMessage'));
            messages.forEach((msg) => {
                    msg.style.display = '';
            });
        $('.searchMessageModalWindow').removeClass('showModalWind') 
        $('.whereMyMessage').eq(0).removeClass('crest').html(ScaleGlass)
        $('.openMethodsMEnu').removeClass('crest').html(etc)
        $('.windowMethodsChatMobile').removeClass('showModalWind')
    }
    // При модального окна снизу
    else {
    $('.windowMethodsChatMobile').addClass('showModalWind')
    }
    })

    $('.whereMyMessage').eq(1).on('click', () => {
        $('.openMethodsMEnu').addClass('crest').addClass('crest').html(close)
        $('.whereMyMessage').eq(0).addClass('crest').css('padding', '0').html(close)
        $('.searchMessageModalWindow').addClass('showModalWind')
        $('.windowMethodsChatMobile').removeClass('showModalWind')
    })

    $('#closeMenu').on('click', () => {
        $('.windowMethodsChatMobile').removeClass('showModalWind')
    })