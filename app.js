'use strict';

const Electron = require('electron');

const app = Electron.app;
const BrowserWindow = Electron.BrowserWindow;

app.on('window-all-closed', function() {
    app.quit();
});

app.on('ready', function() {
    var mainWindow = new BrowserWindow({
        width: 1000,
        height: 768,
        webPreferences: {
			nodeIntegration: false,
			preload: __dirname + '/preload.js',
		}
    });
    
    mainWindow.loadURL('https://wx.qq.com/?lang=zh_CN');
    
    // var content = mainWindow.webContents;
    
    mainWindow.on('closed', function() {
        console.log('window closed.');
    });
});