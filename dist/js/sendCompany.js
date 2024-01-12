const formData = new FormData();

document.getElementById('nameCompany').addEventListener('input', function() {
    if (this.value.length > 100) {
        this.value = this.value.slice(0, 100);  // Обрезаем до 100 символов, если превышено
    }
    formData.set('title', this.value);  // Обновляем значение 'title' в formData
    console.log(formData.get('description'));
    console.log(formData.get('title'));
    console.log(formData.get('image'));
});


document.getElementById('descriptionCompany').addEventListener('input', function() {
  if (this.value.length > 250) {
    this.value = this.value.slice(0, 250);  // Обрезаем до 250 символов, если превышено
  }
  const remainingCharacters = 250 - this.value.length;
  formData.set('description', this.value);  // Обновляем значение 'description' в formData
  console.log(formData.get('description'));
  console.log(formData.get('image'));
  console.log(formData.get('title'));
  document.getElementById('reminder').textContent =` Осталось символов: ${Math.max(0, remainingCharacters)}`;
});



document.getElementById('imageUpload').addEventListener('change', function() {
    const file = this.files[0];  // Получаем выбранный файл
  
    formData.append('image', file, file.name);  // Добавляем файл в FormData для отправки на сервер
  
    // Прежде всего, создадим функцию для изменения размера изображения
    function resizeImage(src, maxWidth, maxHeight, callback) {
      const image = new Image();
  
      image.onload = function() {
        let width = image.width;
        let height = image.height;
  
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
  
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
  
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);
  
        // Преобразовываем изображение обратно в файл или Data URL
        canvas.toBlob(function(blob) {
          callback(blob);
        });
      };
  
      image.src = src;
    }
  
    // Обрабатываем выбранное изображение
    const reader = new FileReader();
    reader.onload = function(e) {
      const fileName = file.name;
      resizeImage(e.target.result, 400, 400, function(resizedImage) {
        // Отображаем обрезанное и сжатое изображение
        const newFile = new File([resizedImage], fileName, { type: file.type });
        formData.set('image', newFile, newFile.name); // Заменяем оригинальный файл на сжатую версию
        document.getElementById('titleFile').innerText = newFile.name;
        document.getElementById('companyLogo').src = URL.createObjectURL(resizedImage);
        console.log(formData); // Выводим FormData в консоль
      });
    };
    reader.readAsDataURL(file);
  });