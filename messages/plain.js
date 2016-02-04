'use strict';

const BasicMessage = require('./basicMessage.js');

module.exports = class Plain extends BasicMessage {
    constructor(messageDom, messageFrom) {
        super(messageDom, messageFrom);
        
        this.text = messageDom.firstElementChild.textContent;
    }
    
    toString() {
        return `文本消息：from -> [${this.from}] | text -> [${this.text}]`;
    }
    
    handle(reply) {
        reply(this);
    }
}