const { v4 } = require("uuid");

const sendSkill = async (title) => {
  try {
    let result = await fetch(
      `https://api.hh.ru/suggests/skill_set?text=${title}`
    );
    if (!result.ok) {
      throw new Error(`Ошибка запроса: ${result.status}`);
    }
    result = await result.json();

    // Создаем новый массив с объектами без id
    const newItems = result.items.map((item) => {
      return { text: item.text }; 
    });
    result.items = newItems; // Заменяем исходный массив
    console.log(result);
    return result;
  } catch (e) {
    return { error: "Ошибка при запросе или создании навыка" };
  }
};

module.exports = { sendSkill };

// console.log(result);

// // Проверка, существует ли навык в базе данных
// const existingSkill = await SkillScheme.findOne({ title });
// if (existingSkill) {
//   return { error: "Навык существует" };
// }

// // Создание и сохранение нового навыка
// const newSkill = new SkillScheme({ id: v4(), title });
// const savedSkill = await newSkill.save();
