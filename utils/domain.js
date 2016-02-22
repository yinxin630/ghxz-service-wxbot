'use strict'

const domains = {
    ele: [
        /https?%3A%2F%2F.*.ele.[^&]*/,
    ],
    didi: [
        /https?%3A%2F%2F.*.xiaojukeji.[^&]*/,
    ],
}

module.exports = {
    matchEle: function(url) {
        for (let regex of domains.ele) {
            let result = url.match(regex);
            if (result) {
                return result;
            }
        }
        return null;
    },
    
    matchDidi: function(url) {
        for (let regex of domains.didi) {
            let result = url.match(regex);
            if (result) {
                return result;
            }
        }
        return false;
    }
}