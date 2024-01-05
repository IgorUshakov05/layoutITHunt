// Select the input field
const input = document.getElementById('specialisationSelect');
// Select all the list items
const listItems = document.querySelectorAll('.listSpecialMy li');
// Select the parent container
const parentListSpecial = document.querySelector('.ParentlistSpecial');
let allData = {
    special: '',
    expirience: ['JavaScript'],
    level: '',
    salary: {
        min: 0,
        max: 0,
        agreement: false
    },
    description: ''
}
// Add event listener for input changes
input.addEventListener('input', function() {
    const filter = input.value.toUpperCase();
    let found = false;

    listItems.forEach(function(item) {
        // Get the label text and convert it to uppercase for case-insensitive comparison
        const label = item.querySelector("label").textContent.toUpperCase();

        // If the input text is found in the label, display the item and set found to true
        if (label.indexOf(filter) > -1) {
            item.style.display = "block";
            found = true;
        } else {
            item.style.display = "none";
        }
    });

    // If no items found, hide the parent container; otherwise, show it
    if (!found || filter.length == 0) {
        parentListSpecial.style.display = "none";
    } else {
        parentListSpecial.style.display = "block";
    }
});

function select(pic,title) {
    $('.boxSelection').css('display', 'flex')
    $('.titleJobItem').text(title)
    $('.noneMake').toggle()
    $('.selectImg').attr('src',pic)
    allData.special = title
    makeOneVisible()
}

$('input[name="interest"]').change(function () {
    allData.wayOfWorking = [];

    // Проходим по всем выбранным чекбоксам и добавляем их значение в массив
    $('input[name="interest"]:checked').each(function () {
        allData.wayOfWorking.push($(this).val());
    });
    makeOneVisibleTwoStage()
});

$('input[name="Level"]').change(function () {
    allData.level = $('input[name="Level"]:checked').val();

    // Выводим результат в консоль (можно изменить на ваше действие)
    makeOneVisibleTwoStage()

});

$('input[name="zarplata"]').change(function () {
    // Обновляем переменную allData.salary.agreement в зависимости от выбранной радиокнопки
    allData.salary.agreement = ($('input[name="zarplata"]:checked').val() === 'true');

    // Выводим результат в консоль (можно изменить на ваше действие)
    makeOneVisibleTwoStage();
});

$('.canesSelect').on('click', () => {
    $('.boxSelection').css('display', 'none')
    $('.titleJobItem').text('')
    $('.noneMake').toggle()
    allData.special = ''
    $('.selectImg').attr('src','')
    makeOneVisible()
})

$('#min').on('input', () => {
    allData.salary.min = $('#min').val()
    makeOneVisibleTwoStage()
})
$('#max').on('input', () => {
    allData.salary.max = $('#max').val()
    makeOneVisibleTwoStage()
})

function removePlaceholder() {
    $('.placeholderMy').remove()
}

function toggleFormat(type) {
    if (type === 'bold') {
        $('.boldenText').toggleClass('activeEdit');
        $('.placeholderMy').remove();
        if ($('.boldenText').hasClass('activeEdit')) {
            $('.cursiveText').removeClass('activeEdit');
            $('#output').append(`<b>${handleInput()}</b>`);
            console.log("have");
        } else {
            // Убираем курсив, если класса 'activeEdit' нет
            $('#output').append('<span></span>');
            console.log("No have");
        }
        setFocusAtEnd(document.getElementById('output'));
    } else if (type === 'italic') {
        $('.cursiveText').toggleClass('activeEdit');
        $('.placeholderMy').remove();

        // Проверяем конкретный класс 'activeEdit'
        if ($('.cursiveText').hasClass('activeEdit')) {
            $('.boldenText').removeClass('activeEdit');
            $('#output').append(`<i>${handleInput()}</i>`);
            console.log("have");
        } else {
            // Убираем курсив, если класса 'activeEdit' нет
            $('#output').append('<span>.</span>');
            console.log("No have");
        }
        
        setFocusAtEnd(document.getElementById('output'));
    }
}

function handleInput() {
    let outputContent = $('#output').text(); // Используем text(), чтобы получить только текст, а не HTML
    allData.description = outputContent;
    makeOneVisibleLastStage()
    $('.tips').text(`Осталось символов: ${3000 - outputContent.length}`);
    if (outputContent.length >= 3000) {
        // Если достигнут, ограничиваем ввод
        $('#output').text(outputContent.substring(0, 3000));
    }
    return outputContent;
}

// Добавляем обработчик события input для отслеживания изменений в тексте
$('#output').on('input', handleInput);

// Добавляем обработчики событий для отслеживания изменений через ctrl+a и удаления текста
$('#output').on('keyup', function (event) {
    if (event.ctrlKey && (event.key === 'a' || event.key === 'A')) {
        handleInput();
    }
});

$('#output').on('keydown', function (event) {
    if (event.key === 'Backspace' || event.key === 'Delete') {
        handleInput();
    }
});

function createList() {
    $('.listText').toggleClass('activeEdit');
}

function setFocusAtEnd(element) {
    var range, selection;
    if (document.createRange) {
        range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    } else if (document.selection) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.collapse(false);
        range.select();
    }
}
 
$('#nextStageTwo').on('click',() => {

})

const makeOneVisible = () => {
    if (allData.special !== '' && allData.expirience.length !== 0) {
        $('#nextStageTwo').removeAttr('disabled')
    }
    else {
        $('#nextStageTwo').attr('disabled',true)
    }
}

const makeOneVisibleTwoStage = () => {
    if (allData.level !== '' && (allData.salary.max && allData.salary.min || allData.salary.agreement)) {
        $('#nextStageThree').removeAttr('disabled')
    }
    else {
        $('#nextStageThree').attr('disabled',true)
    }
}

const makeOneVisibleLastStage = () => {
    if (allData.description.length >= 10) {
        $('#nextStageFinalyAndEnd').removeAttr('disabled')
    }
    else {
        $('#nextStageFinalyAndEnd').attr('disabled',true)
    }
}

//Первый экран
$('#nextStageTwo').on('click',() => {
    $('.oneStage').height('0')
    $('#progress').attr('value', '30')
    $('.twoStage').height('fit-content')
})

//Первый экран - на первый экран
$('#toOneStage').on('click', () => {
    $('.oneStage').height('fit-content')
    $('#progress').attr('value', '30')
    $('.twoStage').height('0')
})

//Второй экран
$('#nextStageThree').on('click',() => {
    $('.twoStage').height('0')
    $('#progress').attr('value', '90')
    $('.threeStage').height('fit-content')
})


$('#toThreeStage').on('click', () => {
    $('.twoStage').height('fit-content')
    $('#progress').attr('value', '60')
    $('.threeStage').height('0')
})



//Финал!
$('#nextStageFinalyAndEnd').on('click', () => {
    $('.threeStage').height('0')
    $('#progress').attr('value', '100')
    $('.lineCreateLevel').addClass('filalyProgress');
    $('.finalyStage').height('fit-content')
})