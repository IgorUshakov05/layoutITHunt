var url;


  

function searchFavorite() {
    var input, filter, messages, i;
    input = document.getElementById('searchPeople');
    filter = input.value.toUpperCase().trim();
    messages = document.querySelectorAll('.myDady');

    messages.forEach((msg) => {
        var textElems = msg.querySelectorAll('.firstNameAndLastNameText, .specialnostText');
        var show = Array.from(textElems).some((elem) => {
            var text = elem.textContent || elem.innerText;
            return text.toUpperCase().includes(filter);
        });
        msg.style.display = show ? '' : 'none';
    });
}



$('.clickShow').on('click', function() {
    
    $(this).closest('.myVac').find('.descriptionVacansyProfile').toggle();
    $(this).closest('.myVac').find('.arrow').toggleClass('rotate');
    });

    $('.allSelect').on('click', function() {
        document.getElementById('searchPeople').value = ''
        messages = document.querySelectorAll('.myDady');
        messages.forEach((msg) => {
            msg.style.display =  '';
        });
    $('.inputSearchFavorite').toggle();
    $('.dadysIsNotActive').toggleClass('dadys')
    if ($('.inputSearchFavorite').is(':visible')) {
        $(this).find('span').text('Скрыть');
    } else {
        $(this).find('span').text('Показать всех');
    }
});

    $('.arrow').on('click', function() {
        $(this).closest('.myVac').find('.descriptionVacansyProfile').toggle();
        $(this).closest('.myVac').find('.arrow').toggleClass('rotate');
        
    });

    $('.closeVacancy').on('click', function() {
        $('.vacancyBox').toggle();
        $('.closeVacancy').toggleClass('rotate')
    });

    $('.closeFast').on('click', function() {
        $('.fastBox').toggle();
        $('.closeFast').toggleClass('rotate')
    });

    $('.canelss').on('click', function() {
        $('.blackBack').toggle()   
    })
    $('.removeUser').on('click', function() {
        $('.blackBack').toggle()
        url = ($(this).closest('.myDady').find('.inherit').attr('href')).slice(6)
     });
     $('#removeChatUser').on('click', () => {
        removeFavoriteUserFetch(url)
        console.log(url);
     })
     const removeFavoriteUserFetch = (urlUser) => {
        axios.post('/remove-favorite', {
            id: urlUser
          })
            .then(function (response) {
              console.log(response.data); // Вывод тела запроса
            })
            .catch(function (error) {
                if (error) {
                $('.descriptionRemove').text('Ошибка при удалении').css('color','red')
                setTimeout(() => {
                    window.location.reload()
                }, 2000)
            }

            });
     }
     