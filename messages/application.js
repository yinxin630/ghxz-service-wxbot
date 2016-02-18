'use strict';

const BasicMessage = require('./basicMessage.js');
const Ele = require('../models/ele.js');

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
    
    * handle(replyFunction) {
        try {
            const allEleResults = yield Ele.find();
            
            const insertedEles = yield Ele.create({
                href: this.href,
                index: allEleResults.length
            });
            
            if (!insertedEles) {
                NativeConsole.log(`create new ele red packet action return undefined.`);
                replyFunction('红包收录失败，请联系管理员！');
                return;
            }
            NativeConsole.log(`store new red packet success: ${insertedEles}`);
            replyFunction('您的红包已被收录，谢谢参与！');
        }
        catch(err) {
            if (err.errmsg.match('duplicate key error collection')) {
                replyFunction('该红包已存在，谢谢参与！');
                return;
            }
            NativeConsole.log('store new red packet fail！' + err);
        }
    }
}