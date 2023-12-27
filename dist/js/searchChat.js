function searchChat() {
    var input, filter, messages, message, text, i;
    input = document.getElementById('SearchChat');
    filter = input.value.toUpperCase().trim();
    messages = Array.from(document.querySelectorAll('.itemChat'));

    messages.forEach((msg) => {
        message = msg.querySelector('.personName');
        text = message.textContent || message.innerText;
        console.log(messages)
        if (text.toUpperCase().indexOf(filter) > -1) {
            msg.style.display = '';
        } else {
            msg.style.display = 'none';
        }
    });

    // Apply styles to the parent container or an appropriate element
    var container = document.querySelector('.listPersonAll');
    if (filter.length === 0) {
        container.style.marginBottom = "10px";
    } else {
        container.style.marginBottom = "0";
    }
}
