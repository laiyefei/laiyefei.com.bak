---
layout: detail
title: 迈出DBA之路（一）学会 Oracle GoldenGate 【Windows篇】
tags: DBA windows oracle
categories: 数据库
---

* TOC
{:toc}

# 序言
额，今天聊些什么呢，笔者劳累了一天，都是在搞Oracle GoldenGate，好吧，那就聊聊OGG吧，记个笔记。

# 大纲
先实验，后思考，再实践，再...，从实验中来，到实践中去，是笔者一贯的想法与作风，那么，现在笔者就这样和大家来学习OGG吧。

## 实验
在进行科学实验的时候，往往有以下几个步骤：
~~~
1. 提出问题
2. 猜想与假设
3. 制定计划，设计实验
4. 进行实验，收集证据
5. 分析数据，得出结论
6. 评估
7. 交流与合作
~~~

### 提出问题
~~~
1. OGG 是怎么部署的？
2. ... （←_←...笔者想不出问题了）  
~~~

### 猜想与假设
~~~
1. OGG 作为Oracle插件，可能要安装Oracle，而且只能Oracle用吧；
2. 也许Oracle安装好就带了，也许需要去下载；
3. ... （←_←...笔者又想不出问题了）
~~~

### 制定计划，设计实验
→ 实验计划
~~~
1. 谷歌啊；
2. 百度啊；
3. ...(←_←...这两个计划就够了)
~~~

→ 设计实验
~~~
实验环境
	- 硬件
		1. 处理器： Intel(R) Core(TM) i3-2130 CPU @ 3.40GHz 3.40 GHz；（！_ ！我跟你说，不要嫌弃这个处理器，i3莫秒全 ）
		2. 内存（RAM）： 8.00GB；
		3. 显卡（←_←...好像没什么关系）
		4. ... （←_←...没思路了）
	- 软件
		1. VMware Workstation 11.1.1 build-2771112
		1. 源端：操作系统 windows2008 R2 x64；Oracle 11g 服务端； Oracle 11g 客户端；
		2. 目标端： win10 企业版；Oracle 11g 服务端； Oracle 11g 客户端；
		3. plsql 安装包；
实验计划
	1. 目标端：安装虚拟机；
	2. 源　端：安装操作系统；
	3. 源　端：Oracle 11g服务端；Oracle 11g客户端；安装plsql；
	3. 目标端：Oracle 11g服务端；Oracle 11g客户端；安装plsql；
	7. 源　端：安装OGG；
	8. 目标端：安装OGG；
~~~

### 进行实验，收集证据
实验步骤
~~~
	 1. 开机； （←_← 废话，电脑当然要先打开了。）
	 2. 虚拟机指定操作系统；打开虚拟机；
	 3. 安装操作系统 windows2008 R2 x64
	 4. 源　端：安装 Oralce 11g服务端；
	 5. 源　端：安装 Oracle 11g客户端；
	 6. 源　端：安装 plsql；
	 7. 目标端：安装 Oracle 11g服务端；
	 8. 目标端：安装 Oracle 11g客户端端；
	 9. 目标端：安装 plsql；
	10. 接下来就是安装OGG了。本文冲着OGG，就只说OGG，其他安装就省略了（其他应该没难度，反正windows下的，识字应该懂。 ←_←）。
~~~

证据收集
* OGG 安装过程。【笔者这里以windows操作系统为例。linux一些指令，自行搜索吧。 ←_←】 <br />
	1. 去官网下载安装包。<br />![下载OGG][downOGG]<br />
	2. <br />![安装步骤1][installOGG1]<br />
	3. <br />![安装步骤2][installOGG2]<br />
	4. <br />![安装步骤3][installOGG3]<br />
	5. <br />![安装步骤4][installOGG4]<br />
	6. <br />![安装步骤5][installOGG5]<br />
	7. (→_← 笔者这边打开报错了，能力有限，以后解决了再写一篇扩展，深入了。)<br />

### 分析数据， 得出结论
~~~
	1. 通过下载安装包，可以知道，OGG支持异库。
	2. OGG不是Oracle的扩展插件，而是基于日志的结构化数据复制备份软件。
	3. ...(←_← 失败了，没结论了。)
~~~

### 评估
~~~
	· 系统知识理解得不够，对于报错一脸茫然，需要加强对操作系统的学习。
 	· 毅力不够，没有坚持去解决。
 	· 能力还欠缺，路漫漫...（→_← 没人评估，只好自己评估。）
~~~

### 交流与合作
欢迎读者关注 [Github][github] 与我交流。

## 思考
思考问题，每个人都有自己的思考方式，笔者喜欢从四个维度来思考，分别是： what？ how？ why？ do？

### 是什么？
**Oracle GoldenGate** 【直译：oracle黄金门】 是一个实现异构 IT 环境间数据**实时数据集成**和**复制**的综合软件包。该产品集支持高可用性解决方案、实时数据集成、事务更改数据捕获、运营和分析企业系统之间的**数据复制**、**转换**和**验证**。Oracle GoldenGate 12c 通过简化配置和管理、加强与 Oracle Database 的集成、支持云环境、扩展异构性以及增强安全性，实现了高性能。

### 怎么样？
主要概念及作用
~~~
	1. GGSCI GGSCI是GoldenGate Software Command Interface 的缩写，它提供了十分丰富的 命令来对Goldengate进行各种操作，如创建、修改、监控GoldenGate进程等等。
	2. Manager进程
	（启动、监控、重启Goldengate的其他进程，报告错误及事件，分配数据存储空间，发布阀值报告等。）
	3. Extract进程
	（Extract运行在数据库源端，负责从源端数据表或者日志中捕获数据。【初始时间装载阶段|同步变化捕获阶段】）
	4. Pump进程：
	（if use trails文件 then (就会把trail以数据块的形式通过TCP/IP协议发送到目标端)
		else (直接投递到目标端)）
	5. Trail文件 （GoldenGate文件【事务信息更安全】，旨在防止单点故障）
	6. Replicat进程（解析为DML或DDL语句，然后应用到目标数据库中。）
	7. Checkpoints（读取和写入的检测点位置）
	8. Collector进程（源端extract进程初始化TCP/IP连接到目标端的collector进程）
~~~

分布情况
~~~
源端：
	1.Manager进程
	2.Trail文件
	3.Extract进程【抽取进程】
	4.Pump进程【数据泵进程(操作Trail文件)】
目标端：
	1.Manager进程
	2.Trail文件
	3.Replicat进程【交付进程】
	4.Collector进程【收集进程】
~~~

机制
* 整体把握 <br />
![整体把握][OGGHow1]
* 内部详解 <br />
![内部详解][OGGHow2]

### 为什么？
为什么选择OGG呢？（当然是因为他好了。←_← ）<br />
1. Golden Gate（简称OGG）提供异构环境下交易数据的实时捕捉、变换、投递。<br />
![交易数据好处][OGGWhy1]<br />
2. 异构环境。 <br />
![异构环境][OGGWhy2]<br />
3. 灵活的拓扑结构 <br />
![OGG拓扑结构][OGGWhy3]
4. OGG 的特性  

~~~
	1. 对生产系统影响小：实时读取交易日志，以低资源占用实现大交易量数据实时复制
	2. 以交易为单位复制，保证交易一致性：只同步已提交的数据
	3. 高性能
		· 智能的交易重组和操作合并
		· 使用数据库本地接口访问
		· 并行处理体系
	4. 灵活的拓扑结构：支持一对一、一对多、多对一、多对多和双向复制等
	5. 支持数据过滤和转换
		· 可以自定义基于表和行的过滤规则
		· 可以对实时数据执行灵活影射和变换
	6. 提供数据压缩和加密： 降低传输所需带宽，提高传输安全性
~~~


### 干什么？
OGG就是用来同步数据的，目前的使用情况及领域，如图：<br />
![OGG使用情况][OGGDo]


# 总结
前几篇文章没有总结，读者感觉像是没有尾巴，凡是要有头有尾，从这里开始，都加入了总结吧，也是笔者的认知，结论，以及想法分享，其中，不足与错误，需要交流，才能共同进步。
~~~
OGG 一款基于日志的数据同步软件，因为基于日志，所以有所偏差，达到准实时；因为基于日志，
所以对业务的影响降到最低，不直接操作业务库；他是在源端和目标端跑相应的进程，进程文件投
递与解析，用这种方式可以把数据库和服务器的压力分散，负载分离；存在双活模式，有灾备。
~~~
↓
→ 简而言之，一款就是**通过****日志**来**同步**数据的**软件**。

**（以上，仅代表个人观点。无论对错，欢迎交流。^_^ ）**


[github]: {{ "https://github.com/sherlock-help" }}
[GithubForOGGTool]: {{ "https://github.com/sherlock-help/Tools/blob/master/oracle/122012_ggs_Windows_x64_DB2400_64bit.zip" }}
[downOGG]: {{ "/2017-07-14-ogg.png" | prepend: site.imgrepo }}
[installOGG1]: {{ "/2017-07-14-installOGG1.png" | prepend: site.imgrepo }}
[installOGG2]: {{ "/2017-07-14-installOGG2.png" | prepend: site.imgrepo }}
[installOGG3]: {{ "/2017-07-14-installOGG3.png" | prepend: site.imgrepo }}
[installOGG4]: {{ "/2017-07-14-installOGG4.png" | prepend: site.imgrepo }}
[installOGG5]: {{ "/2017-07-14-installOGG5.png" | prepend: site.imgrepo }}
[OGGHow1]: {{ "/2017-07-14-OGGHow1.png" | prepend: site.imgrepo }}
[OGGHow2]: {{ "/2017-07-14-OGGHow2.png" | prepend: site.imgrepo }}
[OGGWhy1]: {{ "/2017-07-14-OGGWhy1.png" | prepend: site.imgrepo }}
[OGGWhy2]: {{ "/2017-07-14-OGGWhy2.png" | prepend: site.imgrepo }}
[OGGWhy3]: {{ "/2017-07-14-OGGWhy3.png" | prepend: site.imgrepo }}
[OGGDo]: {{ "/2017-07-14-OGGDo.png" | prepend: site.imgrepo }}
