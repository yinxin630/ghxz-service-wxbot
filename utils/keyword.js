const keyWords = {
    ele: ['ele', '饿了么', 'eleme'],
    didi: ['didi', '滴滴'],
}

module.exports = {
    matchEle: function(text) {
        return keyWords.ele.find(x => x === text) !== undefined;
    },
    
    matchDidi: function(text) {
        return keyWords.didi.find(x => x === text) !== undefined;
    }
}