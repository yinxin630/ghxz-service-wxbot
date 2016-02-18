'use strict';

const BasicMessage = require('./basicMessage.js');
const Keyword = require('../utils/keyword.js');
const Ele = require('../models/ele.js');
const User = require('../models/user.js');

module.exports = class Plain extends BasicMessage {
    constructor(messageDom, messageFrom) {
        super(messageDom, messageFrom);
        
        this.text = messageDom.firstElementChild.textContent;
    }
    
    toString() {
        return `文本消息：from -> [${this.from}] | text -> [${this.text}]`;
    }
    
    * handle(replyFunction) {
        // NativeConsole.log('handle text:', this.text);
        
        // if (Keyword.matchEle(this.text)) {
        //     var userResult = yield User.findOne({nickname: this.from});
        //     if (!userResult) {
        //         userResult = yield User.create({
        //             nickname: this.from,
        //             usageIndex: 0
        //         });
        //     }
            
        //     NativeConsole.log('已用数量：' + userResult.usageIndex);
            
        //     const updatedResult = yield Ele.update({nickname: this.from}, {usageIndex: userResult.usageIndex - 1});
            
        //     return;
        // }
        replyFunction(this.text);
    }
}