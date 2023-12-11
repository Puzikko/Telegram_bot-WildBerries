const { token } = require("../../env");
const { awaitResolve } = require("../../general/awaitResolve");
const TelegramApi = require("node-telegram-bot-api");

const bot = new TelegramApi(token);

const buttonsWithDateOrders = (chatId, arrayOfDates = []) => { //! блок с inline_buttons для запроса заказов на сегодня или вчера
	const button = {
		reply_markup: JSON.stringify({ //? преобразуем в JSON-формат 
			inline_keyboard: [
				[{ text: 'Сегодня: ' + arrayOfDates[0], callback_data: ['orders', arrayOfDates[0]].join('|') }, //? 1-ая кнопка
				{ text: 'Вчера: ' + arrayOfDates[1], callback_data: ['orders', arrayOfDates[1]].join('|') }], //? 2-ая кнопка
				// [{ text: 'Информация из интервальной функции', callback_data: ['ordersAtInterval'].join('|') }] //? 3-я кнопка
			]
		})
	}

	bot.sendMessage(chatId, 'Выберите дату:', button)
};

const buttonsWithDateSales = (chatId, arrayOfDates = []) => { //! блок с inline_buttons для запроса продаж или ABC-нализа
	const button = {
		reply_markup: JSON.stringify({ //? преобразуем в JSON-формат 
			inline_keyboard: [
				[{ text: 'Сегодня: ' + arrayOfDates[0], callback_data: ['sales', arrayOfDates[0]].join('|') }], //? 1-ая кнопка				
				[{ text: 'ABC-анализ за текущий месяц', callback_data: ['salesABCanalysis', arrayOfDates[1]].join('|') }], //? 2-ая кнопка
				[{ text: 'ABC-анализ за прошлый месяц', callback_data: ['salesABCanalysis', arrayOfDates[2]].join('|') }] //? 2-ая кнопка
			]
		})
	}

	bot.sendMessage(chatId, 'Выберите дату:', button)
};

const saveAndSendOrders = (orders = [], arrID = [], chatId, translateOrders) => {
	if (orders.length === arrID.length) return arrID;
	let copyOfOrdersID = [...arrID]; //? копирует массив ID с имеющимися заказами

	const filteringOrders = orders.filter(x => { //? отфильтровывается в новый массив объекты заказа
		if (copyOfOrdersID.includes(x.odid) === false) {
			return x; //? если такого ID не было записано
		}
	})

	filteringOrders.sort((a, b) => { //? Сортировка массива по возрастанию
		return Date.parse(a.date) - Date.parse(b.date); //? переводим даты и время в мс и сравниваем
	});

	const transformedOrders = transformArray(filteringOrders.map(x => { //? трансформируем объект в нужный формат
		return JSON.parse(JSON.stringify(x)) //! передаём копию объекта (иначе изменит объект заказа в filteringOrders)
	}));
	awaitResolve(chatId, transformedOrders, arrID.length, translateOrders)//? кастомная функция для отправки сообщений последовательно
	return [...arrID, ...filteringOrders]; //? возврат нового массива с ID
}



const transformArray = (response = []) => {
	return response.map(obj => {
		delete obj.lastChangeDate; //?vvv
		delete obj.incomeID;
		delete obj.countryName;
		delete obj.oblastOkrugName;
		delete obj.regionName;
		delete obj.isSupply;
		delete obj.isRealization;
		delete obj.spp;
		delete obj.priceWithDisc;
		delete obj.odid;
		delete obj.gNumber;
		delete obj.sticker;
		delete obj.srid;
		if (obj.isCancel === false) {
			delete obj.isCancel;
			delete obj.cancelDate;
		} //? ^^^^^^ удаление указанных ключей со свойствами
		return obj; //? возврат объекта
	});
}

const translateOrders = {
	date: '📅 🕔',
	supplierArticle: '🎁',
	techSize: 'Размер',
	barcode: 'Бар-код',
	totalPrice: '💲',
	priceWithDiscount: '💰',
	discountPercent: '📉, %',
	warehouseName: '🚚',
	oblast: '🏛',
	incomeID: 'Номер поставки (от продавца на склад)',
	odid: 'Уникальный идентификатор позиции заказа',
	nmId: 'Артикул WB',
	subject: 'Предмет',
	category: 'Категория',
	brand: 'Бренд',
	orderType: 'Тип заказа',
	finishedPrice: 'Цена для покупателя 💲',
	isCancel: 'Отмена заказа ❌',
	cancelDate: '📅 🕔 ❌',
	gNumber: 'Номер заказа',
	sticker: 'Цифровое значение стикера',
	srid: 'Уникальный идентификатор заказа',
};

module.exports.translateOrders = translateOrders;
module.exports.transformArray = transformArray;
module.exports.saveAndSendOrders = saveAndSendOrders;
module.exports.buttonsWithDateOrders = buttonsWithDateOrders;
module.exports.buttonsWithDateSales = buttonsWithDateSales;