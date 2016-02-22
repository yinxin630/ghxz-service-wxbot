'use strict';

const Basic = require('./basic.js');

module.exports = class Card extends Basic {
    constructor(messageDom, messageFrom) {
        super(messageDom, messageFrom);
        
        this.nickname = messageDom.querySelector('.card_bd > .info > .display_name').textContent;
    }
    
    toString() {
        return `好友请求消息：from -> [${this.from}] | nickname -> [${this.nickname}]`;
    }
    
    handle(messageDom, document) {
        messageDom.click();
        let userCard = document.querySelector('#mmpop_profile > .profile_mini > .profile_mini_bd > .nickname_area');
        userCard.children[0].click();
    }
}