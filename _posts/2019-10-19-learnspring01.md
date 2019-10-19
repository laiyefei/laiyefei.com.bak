---
layout: detail
title: 学透Spring【一】全局观
tags: spring java
categories: java
date: 2019-10-19
note: 经典框架spring之学习记录
---

* TOC
{:toc}
# 全局观望

## spring？

spring 不仅仅是一个框架，已经成为一种生态



## spring 模块介绍

~~~
1. spring-core 【依赖注入IOC与DI的最基本实现】
2. spring-beans 【Bean工厂与Bean的装配】
3. spring-context 【定义基础的spring上下文，主要是IOC容器】
4. spring-context-support 【对Spring IOC 容器的扩展支持，以及IOC子容器】
5. spring-context-indexer 【Spring的类管理组件和classpath扫描】
6. spring-expression 【Spring的表达式语言】
7. spring-aop 【面向切面编程的应用模块，整合Asm，CGLib，JDKProxy】
8. spring-aspects 【集成AspectJ】
9. spring-instrument 【动态Class Loading模块】
10. spring-jdbc 【Spring提供的JDBC抽象框架的主要实现模块，用于简化JDBC】
11. spring-tx 【Spring JDBC事务控制实现模块】
12. spring-orm 【主要集成Hibernate，Java Persistence API(JPA)和Java Data Objects(JDO)】
13. spring-oxm 【将java对象映射成XML数据，或者将XML数据映射成java对象】
14. spring-jms 【Java Messaging Service 能够发送和接受信息】
15. spring-web 【提供了最基础的web支持，主要建立于核心容器之上，通过Servlet或者Listeners来初始化IOC容器】
16. spring-webmvc 【实现了SpringMVC(model-view-controller)和web应用】
17. spring-websocket 【主要是与web前端的全双工通讯的协议】
18. spring-webflux 【一个新的非阻塞式的Reative Web框架，可以用来建立异步的，非阻塞，事件驱动的服务。】
19. spring-messaging 【从Spring4开始新加入的一个模块，主要职责是为Spring框架集成一些基础的报文传送应用。】
20. spring-test 【主要是为测试提供支持的。】
21. spring-framework-bom 【Bill of Materials. 解决Spring的不同模块依赖版本不同的问题。】
~~~

## Spring 模块依赖图

![Spring 模块依赖图][springmap]<br />






**（以上，仅代表个人观点。无论对错，欢迎交流。^_^ ）**



[springmap]: {{ "/2019-10-19-learnspring01.png" | prepend: site.imgrepo }}