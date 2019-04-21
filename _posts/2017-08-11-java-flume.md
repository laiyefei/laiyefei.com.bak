---
layout: detail
title: java 学习历程 (六) 【Flume框架】
tags: java
categories: 框架
---

* TOC
{:toc}

# 序言

没啥序言，就是上次看到大数据不懂这个框架，就学习一波了。

# 大纲

## 定义

**Flume** 是cloudera公司开源的一款 **分布式**，可靠地进行大量 **日志数据采集**、**聚合** **和并** **转移** 到存储中；通过 **事务** 机制提供了可靠的消息传输支持，自带 **负载均衡** 机制来支撑水平扩展；并且提供了一些默认组件供直接使用。

## 解析

### 架构

![整体架构][flume-iframe]

~~~
1. Source负责日志流入，比如从文件、网络、Kafka等数据源流入数据，数据流入的方式有两种轮训拉取和事件驱动；
2. Channel负责数据聚合/暂存，比如暂存到内存、本地文件、数据库、Kafka等，日志数据不会在管道停留很长时间，很快会被Sink消费掉；
3. Sink负责数据转移到存储，比如从Channel拿到日志后直接存储到HDFS、HBase、Kafka、ElasticSearch等，然后再有如Hadoop、Storm、ElasticSearch之类的进行数据分析或查询。
~~~

### 水平扩展

![水平扩展][x-Frame]

~~~
1. Agent和Web Server是部署在同一台机器；
2. Source使用ExecSource并使用tail命令采集日志；
3. Channel使用MemoryChannel，因为日志数据丢点也不算什么大问题；
4. Sink使用ElasticSearchSink写入到ElasticSearch，此处可以配置多个ElasticSearch服务器IP:PORT列表以便提升处理能力。
~~~

### 多个客户端缓冲聚合

![多个客户端缓冲聚合][BufferFrame]

~~~
1、首先是日志采集层，该层的Agent和应用部署在同一台机器上，负责采集如Nginx访问日志；然后通过RPC将日志流入到收集/聚合层；在这一层应该快速的采集到日志然后流入到收集/聚合层；
2、收集/聚合层进行日志的收集或聚合，并且可以进行容错处理，如故障转移或负载均衡，以提升可靠性；另外可以在该层开启文件Channel，做数据缓冲区；
3、收集/聚合层对数据进行过滤或修改然后进行存储或处理；比如存储到HDFS，或者流入Kafka然后通过Storm对数据进行实时处理。
~~~

## 求索

Flume框架和其它比较：

![Flume框架比较][flumevs]

## 用途

Flume目前常见的应用场景：

1. 日志 → → → Flume → → → 实时计算【如 Kafka + Storm】

2. 日志 → → → Flume → → → 离线计算【如 HDFS、HBase】

3. 日志 → → → Flume → → → ElasticSearch

# 总结

Flume框架，是基于日志采集数据，提供了分布式的策略，还有自带软负载均衡，易于水平扩展，有提供事务的可靠消息传输，整体上还是一个不错的解决方案。


**（以上，仅代表个人观点。无论对错，欢迎交流。^_^ ）**


[flume-iframe]:{{ "/2017-08-11-flume.png" | prepend: site.imgrepo }}
[x-Frame]: {{ "/2017-08-11-xFlume.png" | prepend: site.imgrepo }}
[BufferFrame]: {{ "/2017-08-11-bufferFrame.png" | prepend: site.imgrepo }}
[flumevs]: {{ "/2017-08-11-flumevs.png" | prepend: site.imgrepo }}
