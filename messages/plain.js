'use strict';

const BasicMessage = require('./basicMessage.js');
const Keyword = require('../utils/keyword.js');
const Packet = require('../models/packet.js');
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
        const whichUsageIndex = {
            ele: 'eleUsageIndex',
            didi: 'didiUsageIndex',
        }
        
        let packetType = '';
        if (Keyword.matchEle(this.text)) {
            packetType = 'ele';
        }
        else if (Keyword.matchDidi(this.text)) {
            packetType = 'didi';
        }
        else {
            replyFunction(`我不认识这个指令：${this.text}`);
        }
        
        let userResult = yield User.findOne({nickname: this.from});
        if (!userResult) {
            userResult = yield User.create({
                nickname: this.from,
            });
        }
        
        const packetUsageIndex = userResult[whichUsageIndex[packetType]];
        const availablePacket = yield Packet.findOne({
            type: packetType,
            usageCount: {
                $lt: 10
            },
            index: {
                $gt: packetUsageIndex
            }
        });
        
        if (!availablePacket) {
            replyFunction('无可用红包，请等待他人分享，欢迎多多分享哦~');
            return;
        }
        replyFunction(`赏你一个红包，快去订餐吧:${availablePacket.href}`);
        
        userResult[whichUsageIndex[packetType]] = availablePacket.index;
        yield userResult.save();
        
        availablePacket.usageCount++;
        yield availablePacket.save();
    }
}