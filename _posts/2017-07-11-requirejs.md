---
layout: detail
title: requirejs使用心得
tags: 前端 模块化 
categories: 框架
---

* TOC
{:toc}


# 瞎想
一个网站为什么这么久没整出来，除了是业务的不清楚，迷茫，还有就是重构，重构，。。。。为什么以前写的代码这么差，!_! 没办法了，太菜了。 可是，以前写的代码能不能复用呢。 以前写的前端的资源是否可以模块化管理起来呢。赶紧谷歌一波，没错，就你了，requirejs！。

## 引言 模块化的选择
一直以来，我们都习惯使用script这个html标签来载入javascript脚本，这种方式
有两个缺点：<br />
1.无法在js程序中直接管理相依性，必须在html中做处理<br />
2.虽然目前新的浏览器能够以非同步的方式来载入js，但是旧型浏览器还是
会有阻塞问题，每次遇到&lt;script&gt;，页面都必须停下来等待脚本下载并执行，这会
停止页面绘制，带来不好的用户体验。<br />
如果能模块化管理，是不是很美好～![模块化][modules]

# 大纲

## requirejs 介绍

### requirejs 是什么？

requirejs 是一个JavaScript模块加载器。它非常适合在浏览器中使用，但它也可
以用在其他脚本环境，就像 Rhino and Node。使用 requirejs 加载模块化脚本将提高代码的加载速度和质量。

## 兼容性

浏览器的兼容情况如下:
IE 6+ .......... 兼容 ✔
Firefox 2+ ..... 兼容 ✔ Safari 3.2+ .... 兼容 ✔ Chrome 3+ ...... 兼容 ✔ Opera 10+ ...... 兼容 ✔

## 深入理解 requirejs

### 安装

#### requirejs 下载

https://github.com/requirejs/requirejs
或者
到官网下载 http://requirejs.org/

#### requirejs的引入
&lt;script  src="require.js"  type="text/javascript" data-main="statics/js/main" &gt;&lt;/script&gt;

### 机制
![运行机制][howRun]
在整个require中，主要的方法就两个：require和define。

#### define函数
我们先来聊聊define：
![define函数][define]

#### require回归
![define函数][define]

#### require 与 define 递归加载依赖
![递归加载][regetSelf]

### requirejs使用说明

&lt;script  src="require.js"  type="text/javascript" data-main="statics/js/main" &gt;&lt;/script&gt;<br/>
data-main入口文件；<br/>
使用requirejs之前要配置信息，全局变量：<br/>
require.config（参数说明）：<br/>
1. **appDir**应用程序的顶级目录,如果这个选项被开启的话，那么你的脚本文件是这个目录路径下的一个子目录。 <br/>
2. **baseUrl** 所有模块的查找根路径<br/>
3. **paths**; 以baseUrl为锚点寻找文件；没有配置appDir和baseUrl，路径以入口文件的目录为根目录。
![我的路径配置][myPaths]<br/>
4. **Shim**（初始化声明依赖，或者导出变量）![我的配置][myShim]<br/>
5. **mainConfigFile** （RequireJS的主配置文件。）<br/>
6. **Map** （不同版本，协同）<br/>
...（其他参数不常见，要用自己搜索吧&lt;_&lt;）

### requirejs打包
如果遇到大项目，分散的js脚本，多次的http请求会造成浪费，为了提升性能，
Requirejs提供了打包的功能，根据node命令，可以将依赖的多个js文件合并成
一个，命令如下：<br/>
**node r.js -o baseUrl=../ name= out=built.js**（你得装[nodejs][nodejs]&lt;_&lt;）

## 为什么选择 requirejs

### 背景
1.网站逐渐转化为Web apps，功能的模块化是必要的 <br />
2.代码复杂度逐渐提高 <br />
3.组装变的困难 <br />
4.开发者想要分离的JS文件/模块 <br />
5.部署时可以把代码优化成几个HTTP请求 <br />

### AMD与CMD抉择
随着浏览器功能越来越完善，前端已经不仅仅是切图做网站，前端在某些方面已经媲美桌面应用。越来越庞大的前端项目，越来越复杂的代码，前端开发者们对于模块化的需求空前强烈。后来node出现了，跟随node出现的还有commonjs，这是一种js模块化解决方案。浏览器环境不同于Node，浏览器中获取一个资源必须要发送http请求，从服务器端获取，采用同步模式必然会阻塞浏览器进程出现假死现象。后来出现无阻塞加载脚本方式在开发中广泛应用，在此基础结合commonjs规范，前端模块化迎来了两种方案：AMD（异步模块定义）、CMD（通用模块定义）。<br />
谁更有能成为未来的异步模块标准？SeaJS 遵循 CMD 规范，RequireJS 遵循 AMD 规范，先从这两种不同的格式说起。 <br />
**差异**： <br />
	**依赖声明方式**：cmd是懒执行；amd是预执行； <br />
**弊端**： <br />
	**cmd**:不能直接压缩;模块书写有额外约定; <br />
	**amd**:书写不友好；模块内部与 NodeJS 的 Modules 有一定的差异; <br />
**<span style="color:red">amd和cmd都是异步加载模块化，根据个人的习惯，选择，并没有绝对好坏 !</span>**

## 实例 [myWebsite][myWebsite]



**（以上，仅代表个人观点。无论对错，欢迎交流。^_^ ）**

[myWebsite]: {{ "http://bakerstreet.club" }}
[nodejs]: {{ "http://nodejs.org" }}
[modules]: {{ "/2017-07-10-modules.png" | prepend: site.imgrepo }}
[howRun]: {{ "/2017-07-10-howRun.png" | prepend: site.imgrepo }}
[define]: {{ "/2017-07-10-define.png" | prepend: site.imgrepo }}
[regetSelf]: {{ "/2017-07-10-regetSelf.png" | prepend: site.imgrepo }}
[myPaths]: {{ "/2017-07-10-mypaths.png" | prepend: site.imgrepo }}
[myShim]: {{ "/2017-07-10-myShim.png" | prepend: site.imgrepo }}
