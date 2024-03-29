
const newObject = (obj) => { //! Образование нового объекта
    let copyObj = Object.entries(obj); //? Преобразование в массив из массивов "ключ, значение" [['key', 'val']]
    copyObj = copyObj.map(arr => {
        return arr[0] === 'date'
            ? ['date', changeDateForm(obj['date'])]
            : arr
    })

    const index1 = copyObj.findIndex((el) => el[0] === 'date'); //? Поиск нужного индекса
    copyObj.splice(index1 + 1, 0, ['⏱', addTimeSinceOrder(obj['date'])]); //? Добавление нового массива
    return Object.fromEntries(copyObj) //?  Преобразование обратно в объект
}

const changeDateForm = (date) => { //! Изменяем формат даты
    const arrayDate = date.split('T')[0].split('-');
    const arrayTime = date.split('T')[1].split(':');
    const newDateForm = `${arrayDate[2]}-${arrayDate[1]}  ${arrayTime[0]}:${arrayTime[1]}`;
    return newDateForm;
};

const addTimeSinceOrder = (date) => { //! Добавляем сколько прошло времени 
    const today = new Date;
    const ms = (Date.parse(today) - Date.parse(date));
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms - hours * 3600000) / 60000);
    const text = `${hours + 3} ч. ${minutes} мин.`; //? +3 из-за часового пояса
    return text;
};

module.exports.newObject = newObject;