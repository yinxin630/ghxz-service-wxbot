'use strict';

const Basic = require('./basic.js');
const Packet = require('../models/packet.js');
const checkDomain = require('../utils/domain.js');

module.exports = class App extends Basic {
    constructor(messageDom, messageFrom) {
        super(messageDom, messageFrom);
        
        const result = checkDomain(messageDom.href);
        if (result) {
            this.href = decodeURIComponent(result.href);
            this.packetType = result.type;
        }
        else {
            this.href = 'undefined';
            this.packetType = 'undefined';
        }
        
        this.title = messageDom.children[0].textContent;
        this.image = messageDom.children[1].src;
        this.content = messageDom.children[2].textContent;
    }
    
    toString() {
        return `应用消息：from -> [${this.from}] | href -> [${this.href}] | title -> [${this.title}] | image -> [${this.image}] | content -> [${this.content}]`;
    }
    
    * handle(replyFunction) {
        try {
            const packetCount = yield Packet.find({type: this.packetType}).count();
            
             NativeConsole.log('before create.');
            const insertedResult = yield Packet.create({
                href: this.href,
                type: this.packetType,
                index: packetCount,
            });
            NativeConsole.log('end create.');
            
            if (!insertedResult) {
                NativeConsole.log(`create new red packet action return undefined.`);
                replyFunction('红包收录失败，请联系管理员！');
                return;
            }
            replyFunction('您的红包已被收录，谢谢参与！');
        }
        catch(err) {
            NativeConsole.log('store new red packet fail！' + err);
            if (err.errmsg.match('duplicate key error collection')) {
                replyFunction('该红包已存在，谢谢参与！');
                return;
            }
        }
    }
}