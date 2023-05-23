const { awaitResolve } = require("../../general/awaitResolve");

const saveAndSendOrders = (orders = [], arrID, chatId, translateOrders) => {
	const newArrayOfID = [...orders.map(x => x.odid)]; //? копирует массив ID с вновь прибывшими заказами

	const filteringArray = newArrayOfID.filter(x => { //? отфильтровывается в новый массив
		if (arrID.includes(x) === false) return x //? если такого ID не было записано
	})

	const filteringOrders = orders.filter(x => { //? отфильтровывается в новый массив объект заказа
		if (arrID.includes(x) === false) return x //? если такого ID не было записано
	})

	if (filteringArray.length > 0) {
		orders.map(x => {
			if (filteringArray.includes(x.odid)) { //? вновь прибывшие ID пересылаются сообщением
				awaitResolve(chatId, transformArray([x]), translateOrders)//? кастомная функция для отправки сообщений последовательно
			}
		})
	}

	return [...arrID, ...filteringArray]; //? возврат нового массива с ID
}

const transformArray = (response = []) => {
	return response?.map(obj => {
		delete obj.lastChangeDate; //?vvv
		delete obj.incomeID;
		delete obj.odid;
		delete obj.gNumber;
		delete obj.sticker;
		delete obj.srid;
		if (obj.isCancel === false) {
			delete obj.isCancel;
			delete obj.cancel_dt;
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
	isCancel: 'Отмена заказа',
	cancel_dt: 'Дата и время отмены заказа',
	gNumber: 'Номер заказа',
	sticker: 'Цифровое значение стикера',
	srid: 'Уникальный идентификатор заказа',
};

module.exports.translateOrders = translateOrders;
module.exports.transformArray = transformArray;
module.exports.saveAndSendOrders = saveAndSendOrders;