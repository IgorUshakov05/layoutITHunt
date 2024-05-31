let input = document.getElementById('searchInput');
input.addEventListener('input', function(e) {
    let value = e.target.value;

    // Получаем все элементы сообщений
    let messages = document.querySelectorAll('.boxMessage');
    input.focus()

    // Фильтруем сообщения, оставляя только те, в которых есть введенный текст
    let filteredMessages = Array.from(messages).filter(message => {
        let messageText = message.querySelector('.hisMessage').textContent;
        return messageText.includes(value);
    });

    // Скрываем все сообщения
    messages.forEach(message => message.style.display = 'none');

    // Показываем отфильтрованные сообщения
    filteredMessages.forEach(message => message.style.display = 'flex');
    document.getElementById('score').innerText = filteredMessages.length
    // Если введенный текст пустой, показываем все сообщения
    if (value === '') {
        messages.forEach(message => message.style.display = 'flex');
        document.getElementById('score').innerText = '0'
    
    }
});

document.addEventListener('keydown', (e) => {
    console.log(e.key)
})


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

document.addEventListener('keydown', function(searchInputevent) {
    if (event.ctrlKey && event.code === 'KeyF') {
        event.preventDefault();
        input.focus()
        console.log('Вы нажали Ctrl + F');
        // Показ всех сообщений
        document.getElementById('score').innerText = '0'
    
        $('.searchMessageModalWindow').addClass('showModalWind')
        $('.whereMyMessage').eq(0).addClass('crest').eq(0).html(close)
        $('.openMethodsMEnu').addClass('crest').html(close)
        $('.windowMethodsChatMobile').removeClass('showModalWind')
    }
    if(event.code === 'Escape') {
        event.preventDefault();
        document.getElementById('score').innerText = '0'
        let messages = Array.from(document.querySelectorAll('.boxMessage'));
        messages.forEach((msg) => {
                msg.style.display = '';
        });
    input.value = ''
    $('.searchMessageModalWindow').removeClass('showModalWind')
    $('.whereMyMessage').eq(0).removeClass('crest').html(ScaleGlass)
    $('.openMethodsMEnu').html(etc).removeClass('crest')
    $('.windowMethodsChatMobile').removeClass('showModalWind')
    }
});


//При наатии на лупу ПК

$('.whereMyMessage').eq(0).on('click', () => {
// При закрытии
if($('.whereMyMessage').hasClass('crest')) {
    input.focus()

    // Показ всех сообщений
    let messages = Array.from(document.querySelectorAll('.boxMessage'));
        messages.forEach((msg) => {
                msg.style.display = '';
        });
        document.getElementById('score').innerText = '0'
    input.value = ''
    $('.searchMessageModalWindow').removeClass('showModalWind')
    $('.whereMyMessage').eq(0).removeClass('crest').html(ScaleGlass)
    $('.openMethodsMEnu').html(etc).removeClass('crest')
    $('.windowMethodsChatMobile').removeClass('showModalWind')
}
// При открытии
else {
    $('.searchMessageModalWindow').addClass('showModalWind')
    $('.whereMyMessage').eq(0).addClass('crest').eq(0).html(close)
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
        $('.whereMyMessage').eq(0).addClass('crest').html(close)
        $('.searchMessageModalWindow').addClass('showModalWind')
        $('.windowMethodsChatMobile').removeClass('showModalWind')
    })

    $('#closeMenu').on('click', () => {
        $('.windowMethodsChatMobile').removeClass('showModalWind')
    })