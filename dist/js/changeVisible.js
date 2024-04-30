window.onload = function() {
  $('.openContent').on('click', function() {
    $('.contentList').toggleClass('d-onnone')
    $(this).toggleClass('rotate')
 })
 
 
 $('.itemPolicy a').on('click', function () {
   console.log($(this).attr('href'));
   $('.activeLinkPrivacy').removeClass('activeLinkPrivacy')
   $(this).parent().addClass('activeLinkPrivacy')
   $('.policyTitleActive').removeClass('policyTitleActive')
   $(`${$(this).attr('href')}`).find('h1').addClass('policyTitleActive')
   $('.contentList').toggleClass('d-onnone')
    $('.openContent').toggleClass('rotate')
 })

 const makActive = (id) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Если произошло пересечение, выполняем скрипт
      if (entry.isIntersecting) {
        $(".policyTitleActive").removeClass("policyTitleActive");
        $(".activeLinkPrivacy").removeClass("activeLinkPrivacy");
        document.querySelector(id).childNodes[1].className =
          "policyTitle policyTitleActive";
          document.querySelector(`a[href='${id}']`).parentElement.className = 'itemPolicy activeLinkPrivacy'
        console.log("Элементы пересеклись!");
      }
    });
  }, {
    // root: document.querySelector('.touchLine'),
    rootMargin: "-50%",
    threshold: 0,
  });

  observer.observe(document.querySelector(`${id}`));
  
};

makActive("#enter");
makActive("#get");
makActive("#what");
makActive("#protection");
makActive("#yourRules");
makActive("#storageData");
makActive("#removeAccount");
makActive("#contactInformation");
makActive("#rulesPolice");
makActive("#useCookie");
makActive("#accord");
makActive("#LegalDiscretion");

}


