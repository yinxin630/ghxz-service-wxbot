'use strict'

const sleep = require('./sleep.js');
const Electron = require('electron');
const Clipboard = Electron.clipboard;
const Plain = require('../messages/plain.js');
const App = require('../messages/app.js');
const Card = require('../messages/card.js');

module.exports = {
    getAllNewMessages() {
        let currentFormMessagesNumber = 0;
        const Message = this;
        
        return function* () {
            let messages = [];
            
            // 开始获取当前窗体消息
            let currentFormMessages = document.querySelectorAll('.you > .content > .bubble > .bubble_cont > *');
            let getMessages = yield * Message.getFormNewMessages(currentFormMessages.length - currentFormMessagesNumber);
            messages.push(...getMessages);
            currentFormMessagesNumber = currentFormMessages.length;
            
            // 开始获取其它窗体消息
            let newMessageReddots = document.querySelectorAll('.web_wechat_reddot_middle');
            for (let dIndex = 0; dIndex < newMessageReddots.length; dIndex++) {

                let reddotNumber = Number.parseInt(newMessageReddots.item(dIndex).textContent)
                let tempChatForm = newMessageReddots.item(dIndex).parentElement.parentElement;

                // 点击有新消息的联系人，延时是为了等待DOM渲染
                tempChatForm.click();
                yield sleep(50);

                let otherMessages = yield * Message.getFormNewMessages(reddotNumber);
                messages.push(...otherMessages);

                let currentFormMessages = document.querySelectorAll('.you > .content > .bubble > .bubble_cont > *');
                currentFormMessagesNumber = currentFormMessages.length;
            }
            return messages;
        }
    },

    * getFormNewMessages(count) {
        let messages = [];
        let currentFormMessages = document.querySelectorAll('.you > .content > .bubble > .bubble_cont > *');
        let messageFrom = document.querySelector('.title_name').textContent;

        for (let mIndex = 0; mIndex < count; mIndex++) {
            let tempNewMessage = currentFormMessages.item(currentFormMessages.length - count + mIndex);
            let newMessage = undefined;

            let type = tempNewMessage.attributes.getNamedItem('class').textContent;
            switch (type) {
                case 'plain': {
                    newMessage = new Plain(tempNewMessage, messageFrom);
                    yield * newMessage.handle(this.reply);
                    break;
                }
                case 'app': {
                    newMessage = new App(tempNewMessage, messageFrom);
                    yield * newMessage.handle(this.reply);
                    break;
                }
                case 'card': {
                    newMessage = new Card(tempNewMessage, messageFrom);
                    newMessage.handle(tempNewMessage, document);
                    break;
                }
            }
            messages.push(newMessage);
        }

        return messages;
    },
    
    showMessages(messages) {
        for (let message of messages) {
            NativeConsole.log('收到' + message);
        }
    },
    
    reply(text) {
        let editArea = document.querySelector('#editArea');
        let sendButton = document.querySelector('.btn_send');

        Clipboard.clear();
        Clipboard.writeText(text);
        editArea.focus();
        document.execCommand('paste');

        sendButton.click();
    }
}