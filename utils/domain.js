'use strict'

const Types = require('../config/types.js');

module.exports = function (url) {
    for (let key in Types) {
        for (let regex of Types[key].domains) {
            let result = url.match(regex);
            if (result) {
                return {
                    href: result,
                    type: key,
                };
            }
        }
    }
    return undefined;
}