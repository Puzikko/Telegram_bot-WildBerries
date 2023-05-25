const { awaitResolve } = require("../../general/awaitResolve");

const saveAndSendOrders = (orders = [], arrID = [], chatId, translateOrders) => {
	if (orders.length === 0) return arrID;
	let copyOrdersOrId = [...orders.map(x => x.odid)]; //? копирует массив ID с вновь прибывшими заказами

	const filteringArray = copyOrdersOrId.filter(x => { //? отфильтровывается в новый массив уникальный ID
		if (arrID.includes(x) === false) return x //? если такого ID не было записано
	})

	const filteringOrders = orders.filter((x, i) => { //? отфильтровывается в новый массив объекты заказа
		if (arrID.includes(x.odid) === false) {
			return { ...transformArray([x])[0] }; //? если такого ID не было записано
		}
	})
	awaitResolve(chatId, filteringOrders, arrID.length, translateOrders)//? кастомная функция для отправки сообщений последовательно

	return [...arrID, ...filteringArray]; //? возврат нового массива с ID
}

const transformArray = (response = []) => {
	return response.map(obj => {
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