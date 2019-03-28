---
layout: post
title: Prometheus 的学习笔记
tags: 软件架构 大数据 GoLang
categories: 架构
---

* TOC
{:toc}

# 序言
笔者昨天去了技术沙龙，感觉众多东西不会，赶紧学起来。Prometheus到底是什么鬼呢？笔者一听到这个，感觉就是希腊的神。废话过后，开始搞起，今天就是学这个了。 **Prometheus !**

# 大纲
## 定义
先下个定义吧，什么是普罗米修斯？普罗米修斯是泰坦【Titans】巨人之一。![捂脸][wulian]这个当然是乱扯的。<br />
言归正传：**Prometheus** 是一套开源的 **监控** ， **报警** 和 **时间序列** 数据库的组合。笔者还以为他是某种具体的技术，原来其实是一种 **解决方案** ，一种 **架构**。


## 解析
先上一张图压压惊：<br />
![普罗米修斯整体架构][prometheus] <br />

~~~
特性：
  · 高维度数据模型
  · 自定义查询语言
  · 可视化数据展示
  · 高效的存储策略
  · 易于运维
  · 提供各种客户端开发库
  · 警告与报警
  · 数据导出
~~~


· 监控系统【基础设施-服务器-业务-用户体验】

> 主动监控 <br/>
&nbsp;&nbsp;&nbsp;&nbsp;业务上线前，按照运维指定的标准，预先埋点。具体实现方式，通过日志向本地代理上报。

> 被动监控<br/>
&nbsp;&nbsp;&nbsp;&nbsp;对主动监控的补充，从外围进行黑盒监控，通过主动监测业务功能可用性，进行监控，比如定期ping业务端口。

> 旁路监控<br/>
&nbsp;&nbsp;&nbsp;&nbsp;主动监控和被动监控，是从内部对业务，对系统进行监控，内部的平稳运行并不能保证用户的使用，体验都是正常的。所以，仍然需要通过舆情监控，第三方监控等数据，来间接监控真实环境的服务质量。



· 再上一张图压压惊

![普罗米修斯架构][prometheus.jpg]

~~~
组件说明：
1. Prometheus server：支持通过配置文件、文本文件、zookeeper、consul、DNS SRV lookup等方式指定抓取目标。支持很多方式的图标可视化，例如十分精美的Grafana，自带的Promdash，以及自身提供的模板引擎等等，还提供HTTP API的查询方式，自定义所需要的输出。
2. Alertmanager：是独立于Prometheus的一个组件，可以支持Prometheus的查询语句，提供十分灵活的报警方式。
3. PushGateway：这个组件是支持Client主动推送metrics到PushGateway，而Prometheus只是定时去Gateway上抓取数据。
4. exporters：支持其他数据源的指标导入到Prometheus，支持数据库、硬件、消息中间件、存储系统、http服务器、jmx等
5. prometheus_cli：命令行工具
6. PromDash：使用rails开发的dashboard，用于可视化指标数据
服务过程：Prometheus daemon负责定时去目标上抓取metrics【指标】 数据，每个抓取目标需要暴露一个http服务的接口给它定时抓取。
基本原理：通过HTTP 协议周期性抓取被监控组件的状态，这样做的好处是任意组件只要提供 HTTP 接口就可以接入监控系统，不需要任何 SDK 或者其他的集成过程。这样做非常适合虚拟化环境比如 VM 或者 Docker 。
~~~


## 求索

**Prometheus** 是一套开源的 **监控** & **报警** & **时间序列数据库** 的组合，起始是由SoundCloud公司开发的。随着发展，越来越多公司和组织接受采用Prometheus，社会也十分活跃，他们便将它独立成开源项目，并且有公司来运作。google SRE的书内也曾提到跟他们BorgMon监控系统相似的实现是Prometheus。**现在最常见的Kubernetes容器管理系统中，通常会搭配Prometheus进行监控**。


## 用途
Prometheus具有多种模式的可视化数据，可集成Grafana可视化工具。

或者内置PromDash界面，启动后打开http://localhost:9090【默认9090端口】即可访问内置的PromDash监控界面


# 总结
Prometheus是一套开源的监控系统，它将所有信息都存储为时间序列数据；因此实现一种Profiling监控方式，实时分析系统运行的状态、执行时间、调用次数等，以找到系统的热点，为性能优化提供依据。



↓
→ 简而言之，**Prometheus** 是一个 **定时** **抓取** 接口 **数据** **存入时序数据库** 并 **支持图表化查询和预警** 的一个 **Go语言** 编写的 **监控系统**。


**（以上，仅代表个人观点。无论对错，欢迎交流。^_^ ）**



[wulian]: {{ "/2017-07-11-wulian.png" | prepend: site.imgrepo }}
[prometheus]: {{ "/2017-07-31-prometheus.png" | prepend: site.imgrepo }}
[prometheus.jpg]: {{ "/2017-07-31-prometheus.jpg" | prepend: site.imgrepo }}
