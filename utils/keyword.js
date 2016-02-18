const keyWords = {
    ele: ['ele', '饿了么', 'eleme'],
}

module.exports = {
    matchEle: function(text) {
        return keyWords.ele.find(x => x === text) !== undefined;
    }
}