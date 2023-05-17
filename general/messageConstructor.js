
const messageConstructor = (object, translater) => {//? Маппинг по объекту
    return Object.keys(object)
        .map(key => {
            return !!translater[key]
                ? `${translater[key]}: ${object[key]}`
                : `${key}: ${object[key]}`
        })
        .join('\n')
};

module.exports.messageConstructor = messageConstructor;