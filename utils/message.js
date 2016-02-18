'use strict'

const sleep = require('./sleep.js');
const Electron = require('electron');
const Clipboard = Electron.clipboard;
const Plain = require('../messages/plain.js');
const App = require('../messages/app.js');
const Card = require('../messages/card.js');

module.exports = {
    getAllNewMessages() {
        var currentFormMessagesNumber = 0;
        const Message = this;
        
        return function* () {
            var messages = [];
            
            // 开始获取当前窗体消息
            var currentFormMessages = document.querySelectorAll('.you > .content > .bubble > .bubble_cont > *');
            var getMessages = yield * Message.getFormNewMessages(currentFormMessages.length - currentFormMessagesNumber);
            messages.push(...getMessages);
            currentFormMessagesNumber = currentFormMessages.length;
            
            // 开始获取其它窗体消息
            var newMessageReddots = document.querySelectorAll('.web_wechat_reddot_middle');
            for (var dIndex = 0; dIndex < newMessageReddots.length; dIndex++) {

                var reddotNumber = Number.parseInt(newMessageReddots.item(dIndex).textContent)
                var tempChatForm = newMessageReddots.item(dIndex).parentElement.parentElement;

                // 点击有新消息的联系人，延时是为了等待DOM渲染
                tempChatForm.click();
                yield sleep(50);

                var otherMessages = yield * Message.getFormNewMessages(reddotNumber);
                messages.push(...otherMessages);

                var currentFormMessages = document.querySelectorAll('.you > .content > .bubble > .bubble_cont > *');
                currentFormMessagesNumber = currentFormMessages.length;
            }
            return messages;
        }
    },

    * getFormNewMessages(count) {
        var messages = [];
        var currentFormMessages = document.querySelectorAll('.you > .content > .bubble > .bubble_cont > *');
        var messageFrom = document.querySelector('.title_name').textContent;

        for (var mIndex = 0; mIndex < count; mIndex++) {
            var tempNewMessage = currentFormMessages.item(currentFormMessages.length - count + mIndex);
            var newMessage = undefined;

            var type = tempNewMessage.attributes.getNamedItem('class').textContent;
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
        for (var message of messages) {
            NativeConsole.log('收到' + message);
        }
    },
    
    reply(text) {
        var editArea = document.querySelector('#editArea');
        var sendButton = document.querySelector('.btn_send');

        Clipboard.clear();
        Clipboard.writeText(text);
        editArea.focus();
        document.execCommand('paste');

        sendButton.click();
    }
}