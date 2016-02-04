'use strict';

const BasicMessage = require('./basicMessage');

module.exports = class App extends BasicMessage {
    constructor(messageDom, messageFrom) {
        super(messageDom, messageFrom);
        
        this.href = decodeURIComponent(messageDom.href.match(/https%3A%2F%2F[^.]*.ele.me[^&]*/));
        this.title = messageDom.children[0].textContent;
        this.image = messageDom.children[1].src;
        this.content = messageDom.children[2].textContent;
    }
    
    toString() {
        return `应用消息：from -> [${this.from}] | href -> [${this.href}] | title -> [${this.title}] | image -> [${this.image}] | content -> [${this.content}]`;
    }
    
    handle(reply) {
        reply(this);
    }
}