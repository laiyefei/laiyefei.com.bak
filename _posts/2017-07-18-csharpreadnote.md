---
layout: detail
title: CSharp 研读笔记（二）【撩动WCF】
tags: CSharp windows
categories: 框架
---

* TOC
{:toc}

# 序言
WCF 一个既陌生又熟悉的技术，笔者用过编码过，但是似乎又觉得很陌生，朦胧并不美，笔者还是想深入撩解下这个技术。<br />
老规矩，笔者已经习惯的思维框架。（←_← ...）<br />

# 大纲
掌握了思维的形式，思维的框架，进行补充，思考问题应该会越来越全面吧，至少笔者这么想的。（反正笔者就是这么想的。。！_ ！）

## 定义
~~~
WCF【Windows Communication Foundation】 是由微软开发的一些列支持数据通信的应用程序框架，
可以翻译成windows通讯开发平台。
~~~
* 一些概念
~~~
DCOM【分布式组件对象模型】：是一系列微软的概念和程序接口，利用这个接口，客户端程序对象能够请求来自网络中另一台计算机上的服务器程序对象。
Microsoft .NET Remoting：提供了一种允许对象通过应用程序域与另一个对象进行交互的框架。【有点像DCOM的升级版】
WebService：是一个平台独立的，低耦合的，自包含的、基于可编程的web的应用程序，可使用开放的XML（标准通用标记语言下的一个子集）标准来描述、发布、发现、协调和配置这些应用程序，用于开发分布式的互操作的应用程序。
Socket：网络上的两个程序通过一个双向的通信连接实现数据的交换，这个连接的一端称为一个socket。编程接口（API），对TCP/IP的封装，TCP/IP也要提供可供程序员做网络开发所用的接口，这就是Socket编程接口。
SOAP 【简单对象访问协议】：交换数据的一种协议规范，是一种轻量的、简单的、基于XML（标准通用标记语言下的一个子集）的协议，它被设计成在WEB上交换结构化的和固化的信息。SOAP使用基于XML的数据结构和超文本传输协议(HTTP)的组合定义了一个标准的方法来使用Internet上各种不同操作环境中的分布式对象。【SOAP 可以和现存的许多因特网协议和格式结合使用，包括超文本传输协议（HTTP），简单邮件传输协议（SMTP），多用途网际邮件扩充协议（MIME）。它还支持从消息系统到远程过程调用（RPC）等大量的应用程序】
WSDL【WebServicesDescriptionLanguage（Web服务描述语言）】：用来描述如何访问具体的接口。
UDDI【UniversalDescriptionDiscovery andIntegration（统一描述、发现和集成）】：用来管理，分发，查询webService。
MSMQ【MicroSoft Message Queuing（微软消息队列）】：是在多个不同的应用之间实现相互通信的一种异步传输模式，相互通信的应用可以分布于同一台机器上，也可以分布于相连的网络空间中的任一位置。
~~~

## 解析
**WCF**是微软为了实现**SOA**而出现的框架，它是对微软之前的多种分布式技术的**继承**和**扩展**。
**WCF**整合了原有的windows**通讯**的.net Remoting，WebService，Socket，MSMQ的机制，并融合有HTTP和FTP的相关技术。<br />
**微软想将不同的分布式技术整合起来，提供了一个统一的编程模型。**<br />
windows平台上开发**分布式**应用的最佳实践方式，可以简单归结为以下四大部分：<br />
1. 网络服务的协议 【用什么网络协议开发客户端接入】<br />
2. 业务服务的协议 【声明服务提供哪些业务】<br />
3. 数据类型声明 【客户端与服务端通信的数据部分进行统一化】<br />
4. 传输安全性的相关定义 <br />

由于各个通信方法的设计方法不同，而且彼此之间也有相互的重叠性，对于开发人员来说，不同的选择会有不同的程序设计模型，而且必须要重新学习，让开发人员在使用中有许多不便。同时，面向服务架构(Service-Oriented Architecture) 也开始盛行于软件工业中，因此微软重新查看了这些通信方法，并设计了一个统一的程序开发模型，对于数据通信提供了最基本最有弹性的支持，这就是 Windows Communication Foundation。<br />
通信双方的**沟通方式**，由合约来订定。通信双方所遵循的通信方法，由**协议绑定**来订定。通信期间的安全性，由双方约定的安全性层次来订定。<br />
下面就先介绍**WCF**的配置文件：
~~~
<?xml version="1.0" encoding="utf-8" ?>  
<configuration>  
  <!-- 部署服务库项目时，必须将配置文件的内容添加到   
  主机的 app.config 文件中。System.Configuration 不支持库的配置文件。-->  
  <system.serviceModel>  
    <!--配置服务节点Start-->  
    <services>  
      <!--配置某一服务，在这里可以指定服务名称-->  
      <service name="WCFDemo.Service1">  
      </service>  
    </services>  
    <!--配置服务节点End-->  
    <!--配置绑定节点Start-->  
    <bindings>  
      <basicHttpBinding></basicHttpBinding>  
      <mexHttpBinding></mexHttpBinding>  
      <wsHttpBinding></wsHttpBinding>  
    </bindings>  
    <!--配置绑定节点End-->  
    <!--配置行为节点Start-->  
    <behaviors>  
      <serviceBehaviors>  
        <behavior>  
        </behavior>  
      </serviceBehaviors>  
    </behaviors>  
    <!--配置行为节点End-->  
    <!--路由设置Start-->  
    <routing>  
      <filters>  
        <filter name="filter1" filterType="Action"/>  
      </filters>  
    </routing>  
    <!--路由设置End-->     
  </system.serviceModel>  
</configuration>  
~~~

**WCF** 运行的原理如下：（一图胜千言 ←_←...）<br />
![WCF运行原理][WCF]

总之：<br />
~~~
Endpoint【终端】 = A【Address（地址）】B【Binding（绑定）】C【Contract（契约）】
~~~


## 求知
为什么选择WCF呢，一张图说明如下：<br />
![WCFwhy][WCFwhy]
所以，WCF同时也使得面向服务编程更加简单而统一了。 如果采用旧有的技术，由于各种技术的编程模型完全不一致，使得程序的迁移非常的困难。



## 创意
WCF可以用来：
~~~
1. 分散服务器压力，业务灵活变更
	由于业务较为庞杂，众多业务集在一台服务器上面，服务器会超负荷，而且，运行较为缓慢，
分散负载，可以使得业务的变更较为灵活，而且易于修改，模块之间的干扰降低了。
2. 复用
	如果某个合作伙伴也要类似或者相同的业务，可以复用已有的项目，不用重复造轮子。
~~~


# 总结
因此，WCF是微软的通信技术的整合，升级，降低了程序员在不同技术之间的学习成本，采用接口的方式将业务垂直分层，有秩，可以复用接口以及分散服务器压力，通信统一化，是windows平台开发分布式的最佳方式。

<br />
↓
→ 简而言之，**WCF**是微软**通信技术**的**整合**，主要用来开发**分布式**应用的寄托于宿主的**基础服务**。


**（以上，仅代表个人观点。无论对错，欢迎交流。^_^ ）**


[WCF]: {{ "/2017-07-18-wcf.png" | prepend: site.imgrepo }}
[WCFwhy]: {{ "/2017-07-18-wcfwhy.png" | prepend: site.imgrepo }}
