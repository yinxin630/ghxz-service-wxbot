'use strict';

module.exports = class BasicMessage {
    constructor(messageDom, messageFrom) {
        this.type = messageDom.attributes.getNamedItem('class').textContent;
        this.from = messageFrom;
    }
    
    toString() {
        return `type -> [${this.type}]`;
    }
}