# 光合新知服务机器人

## 功能

* 收集饿了么红包
* 为用户提供可用红包

## 安装

1. 下载项目 `git clone https://github.com/yinxin630/ghxz-service-wxbot`
2. 进入项目目录 `cd ghxz-service-wxbot`
3. 安装依赖 `cnpm install`
4. 配置MongoDB数据库，创建./config/mongodb.js，添加内容 `module.exports = 'mongodb://yourhost/yourdatabase'`

### 在CentOS服务器上安装

1. 执行上述安装步骤
2. 安装xvfb，`sudo yum install xorg-x11-server-Xvfb`
3. 执行 `Xvfb -ac -screen scrn 1280x2000x24 :9.0 & export DISPLAY=:9.0`
4. 安装丢失的依赖库，执行 `electron . --enable-logging`运行，提示缺少xxxlibrary，执行 `yum whatprovides xxx(替换为缺少的库)`，获取结果后执行`sudo yum install xxx(获取的包名)`，注意，64位机器，需要将包名末尾的.i686替换为.x86_64

## 运行

执行 `electron . --enable-logging`，如果未登录过帐号，复制终端中的二维码URL，在浏览器中打开并使用微信扫码登录。如果已经登录过帐号则会自动帐号，注意在其它地方的登录操作会取消当前登录状态。