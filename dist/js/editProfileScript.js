$('#description').on('input', () => {
    $('.scoreSymbol').text(`${description.value.length}/1000`);

    if (description.value.length >= 1000) {
        description.value = description.value.slice(0, 1000);
        return false;
    } else {
        return true;
    }
});


$("#specialist").on("input", function () {
    var inputValue = $(this).val().toLowerCase();
    if(inputValue.length===0) {
        $(".CitisGet").css('display', 'none')
        return false;
    }
    $(".CitisGet").css('display', 'block')
    $(".CitisGet li label").each(function () {
        var text = $(this).text().toLowerCase();
        if (text.includes(inputValue)) {
            $(this).parent().show();
        } else {
            $(this).parent().hide();
        }
    });
})

$("#specialist").on("keydown", function (e) {
    if (e.which === 9) {  // Check for Tab key
        e.preventDefault();
        $(".CitisGet li:visible:first label").click();
    }
});

$(".CitisGet li").on("click", function () {
    var labelText = $(this).find("label").text();
    $("#specialist").val(labelText);
    $(".CitisGet").hide();
});