'use strict'

const Types = require('../config/types.js');

module.exports = function (text) {
    for (let key in Types) {
        if (Types[key].keywords.find(x => x === text) !== undefined) {
            return key;
        }
    }
    return undefined;
}