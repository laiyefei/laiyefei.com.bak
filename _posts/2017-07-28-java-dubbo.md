---
layout: post
title: java 学习历程 (四) 【Dubbo框架】
tags: java
categories: 框架
---

* TOC
{:toc}

# 序言
Dubbo框架，好像挺火的，本来阿里已经放弃维护了，现在又要维护，说明，还是存在一定的价值的，废话不多说，还是学一学吧，就算将来这框架过时了，但是毕竟思想还在。

# 大纲

## 定义

**Dubbo** 是一个 **分布式** 服务框架，致力于提供 **高性能** 和 **透明化** 的RPC远程服务调用方案，以及SOA服务治理方案。

~~~
核心部分包括：
  远程通讯：提供对多种基于长连接的NIO框架抽象封装，包括多种线程模型，序列化，以及“请求-响应”模式的信息交换方式。
  集群容器：提供基于接口方法的透明远程过程调用，包括多协议支持，以及软负载均衡，失败容错，地址路由，动态配置等集群支持。
  自动发现：基于注册中心目录服务，使服务消费方能动态的查找服务提供方，使地址透明，使服务提供方可以平滑增加或减少机器。
~~~

## 解析

### 示例

先上Demo【来自官网】

* DemoService.java【定义服务接口（该接口需单独打包，在服务提供方和消费方共享）】

```java
package com.alibaba.dubbo.demo;

public interface DemoService {
    String sayHello(String name);
}
```

→ Provider 实现

* DemoServiceImpl.java【服务提供方实现接口（对服务消费方隐藏实现）】

```java
package com.alibaba.dubbo.demo.provider;
import com.alibaba.dubbo.demo.DemoService;

public class DemoServiceImpl implements DemoService {
    public String sayHello(String name) {
        return "Hello " + name;
    }
}
```

* dubbo-demo-provider.xml【用Spring配置声明暴露服务】

```java
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:dubbo="http://code.alibabatech.com/schema/dubbo"
    xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://code.alibabatech.com/schema/dubbo http://code.alibabatech.com/schema/dubbo/dubbo.xsd">

    <!-- 提供方应用信息，用于计算依赖关系 -->
    <dubbo:application name="demo-provider"  />

    <!-- 使用multicast广播注册中心暴露服务地址 -->
    <dubbo:registry address="multicast://224.5.6.7:1234" />

    <!-- 用dubbo协议在20880端口暴露服务 -->
    <dubbo:protocol name="dubbo" port="20880" />

    <!-- 声明需要暴露的服务接口 -->
    <dubbo:service interface="com.alibaba.dubbo.demo.DemoService" ref="demoService" />

    <!-- 和本地bean一样实现服务 -->
    <bean id="demoService" class="com.alibaba.dubbo.demo.provider.DemoServiceImpl" />

</beans>
```

* Provider.java【加载Spring配置】

```java
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Provider {
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(new String[] {"META-INF/spring/dubbo-demo-provider.xml"});
        context.start();

        System.in.read(); // 按任意键退出
    }
}
```

→ Consumer 实现

* dubbo-demo-consumer.xml【通过Spring配置引用远程服务】

```java
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:dubbo="http://code.alibabatech.com/schema/dubbo"
    xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://code.alibabatech.com/schema/dubbo http://code.alibabatech.com/schema/dubbo/dubbo.xsd">

    <!-- 消费方应用名，用于计算依赖关系，不是匹配条件，不要与提供方一样 -->
    <dubbo:application name="demo-consumer"  />

    <!-- 使用multicast广播注册中心暴露发现服务地址 -->
    <dubbo:registry address="multicast://224.5.6.7:1234" />

    <!-- 生成远程服务代理，可以和本地bean一样使用demoService -->
    <dubbo:reference id="demoService" interface="com.alibaba.dubbo.demo.DemoService" />

</beans>
```

* Consumer.java 【加载Spring配置，并调用远程服务（也可以使用IoC注入）】

```java
import org.springframework.context.support.ClassPathXmlApplicationContext;
import com.alibaba.dubbo.demo.DemoService;

public class Consumer {
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(new String[] {"META-INF/spring/dubbo-demo-consumer.xml"});
        context.start();

        DemoService demoService = (DemoService)context.getBean("demoService"); // 获取远程服务代理
        String hello = demoService.sayHello("world"); // 执行远程方法

        System.out.println( hello ); // 显示调用结果
    }
}
```


### 整体架构

![dubbo总体架构图][dubbo-framework]

如图：

~~~
dubbo 的框架整体上可以划分10层，
而最上面的Service层是留给实际想要使用Dubbo开发分布式服务的开发者实现业务逻辑的接口层。
图中左边淡蓝背景的为服务消费方使用的接口，
右边淡绿色背景的为服务提供方使用的接口，
位于中轴线上的为双方都用到的接口。
如下，每个层次的设计要点是：
1. 服务接口层【Service】：该层是与实际业务逻辑相关的，根据服务提供方和服务消费方的业务设计对应的接口和实现。
2. 配置层【Config】：对外配置接口，以 ServiceConfig 和 ReferenceConfig 为中心，可以直接 new 配置类，也可以通过 spring 解析配置生成配置类。
3. 服务代理层【Proxy】：服务接口透明代理，生成服务的客户端 Stub 和服务器端 Skeleton，以 ServiceProxy 为中心，扩展接口为 ProxyFactory。
4. 服务注册层【Registry】：封装服务地址的注册与发现，以服务 URL 为中心，扩展接口为 RegistryFactory、Registry 和 RegistryService。可能没有服务注册中心，此时服务提供方直接暴露服务。
5. 集群层【Cluster】：封装多个提供者的路由及负载均衡，并桥接注册中心，以 Invoker 为中心，扩展接口为 Cluster、Directory、Router 和 LoadBalance。将多个服务提供方组合为一个服务提供方，实现对服务消费方来透明，只需要与一个服务提供方进行交互。
6. 监控层【Monitor】：RPC 调用次数和调用时间监控，以 Statistics 为中心，扩展接口为 MonitorFactory、Monitor 和 MonitorService。
7. 远程调用层【Protocol】：封装 RPC 调用，以 Invocation 和 Result 为中心，扩展接口为 Protocol、Invoker 和 Exporter。Protocol 是服务域，它是 Invoker 暴露和引用的主功能入口，它负责 Invoker 的生命周期管理。Invoker 是实体域，它是 Dubbo 的核心模型，其它模型都向它靠扰，或转换成它，它代表一个可执行体，可向它发起 invoke 调用，它有可能是一个本地的实现，也可能是一个远程的实现，也可能一个集群实现。
8. 信息交换层【Exchange】：封装请求响应模式，同步转异步，以 Request 和 Response 为中心，扩展接口为 Exchanger、ExchangeChannel、ExchangeClient 和 ExchangeServer。
9. 网络传输层【Transport】：抽象 mina 和 netty 为统一接口，以 Message 为中心，扩展接口为 Channel、Transporter、Client、Server 和 Codec。
10. 数据序列化层【Serialize】：可复用的一些工具，扩展接口为 Serialization、 ObjectInput、ObjectOutput 和 ThreadPool。

层关系描述：
> 在RPC中，Protocol是核心层，也就是只要有Protocol + Invoker + Exporter就可以完成非透明的RPC调用，然后在Invoker的主过程上Filter拦截点。
> 图中的 Consumer 和 Provider 是抽象概念，只是想让看图者更直观的了解哪些类分属于客户端与服务器端，不用 Client 和 Server 的原因是 Dubbo 在很多场景下都使用 Provider、Consumer、Registry、Monitor 划分逻辑拓普节点，保持统一概念。
> 而 Cluster 是外围概念，所以 Cluster 的目的是将多个 Invoker 伪装成一个 Invoker，这样其它人只要关注 Protocol 层 Invoker 即可，加上 Cluster 或者去掉 Cluster 对其它层都不会造成影响，因为只有一个提供者时，是不需要 Cluster 的。
> Proxy 层封装了所有接口的透明化代理，而在其它层都以 Invoker 为中心，只有到了暴露给用户使用时，才用 Proxy 将 Invoker 转成接口，或将接口实现转成 Invoker，也就是去掉 Proxy 层 RPC 是可以 Run 的，只是不那么透明，不那么看起来像调本地服务一样调远程服务。
> 而 Remoting 实现是 Dubbo 协议的实现，如果你选择 RMI 协议，整个 Remoting 都不会用上，Remoting 内部再划为 Transport 传输层和 Exchange 信息交换层，Transport 层只负责单向消息传输，是对 Mina、Netty、Grizzly 的抽象，它也可以扩展 UDP 传输，而 Exchange 层是在传输层之上封装了 Request-Response 语义。
> Registry 和 Monitor 实际上不算一层，而是一个独立的节点，只是为了全局概览，用层的方式画在一起。

~~~

### 模块分包

![模块分包][dubbo-module]

~~~
dubbo-common 公共逻辑模块，包括Util类和通用模型。
dubbo-remoting 远程通讯模块，相当于Dubbo协议的实现，如果RPC用RMI协议则不需要使用此包。
dubbo-rpc 远程调用模块，抽象各种协议，以及动态代理，只包含一对一的调用，不关心集群的管理。
dubbo-cluster 集群模块，将多个服务提供方伪装为一个提供方，包括：负载均衡, 容错，路由等，集群的地址列表可以是静态配置的，也可以是由注册中心下发。
dubbo-registry 注册中心模块，基于注册中心下发地址的集群方式，以及对各种注册中心的抽象。
dubbo-monitor 监控模块，统计服务调用次数，调用时间的，调用链跟踪的服务。
dubbo-config 配置模块，是Dubbo对外的API，用户通过Config使用Dubbo，隐藏Dubbo所有细节。
dubbo-container 容器模块，是一个Standlone的容器，以简单的Main加载Spring启动，因为服务通常不需要Tomcat/JBoss等Web容器的特性，没必要用Web容器去加载服务。

分包与分层区别：
container为服务容器，用于部署运行服务，没有在层中画出。
protocol层和proxy层都放在rpc模块中，这两层是rpc的核心，在不需要集群时(只有一个提供者)，可以只使用这两层完成rpc调用。
transport层和exchange层都放在remoting模块中，为rpc调用的通讯基础。
serialize层放在common模块中，以便更大程度复用。
~~~

### 依赖关系

![依赖关系][dubbo-relation]

~~~
图中小方块Protocol, Cluster, Proxy, Service, Container, Registry, Monitor代表层或模块，蓝色的表示与业务有交互，绿色的表示只对Dubbo内部交互。
图中背景方块Consumer, Provider, Registry, Monitor代表部署逻辑拓普节点。
图中蓝色虚线为初始化时调用，红色虚线为运行时异步调用，红色实线为运行时同步调用。
图中只包含RPC的层，不包含Remoting的层，Remoting整体都隐含在Protocol中。
~~~

### 调用链

![调用链][dubbo-extension]

### 时序图

* 暴露服务时序

![暴露服务时序][dubbo-export]

* 引用服务时序

![引用服务时序][dubbo-refer]

### 相关描述

* 领域模型

~~~
在Dubbo的核心领域模型中：
Protocol是服务域，它是Invoker暴露和引用的主功能入口，它负责Invoker的生命周期管理。
Invoker是实体域，它是Dubbo的核心模型，其它模型都向它靠扰，或转换成它，它代表一个可执行体，可向它发起invoke调用，它有可能是一个本地的实现，也可能是一个远程的实现，也可能一个集群实现。
Invocation是会话域，它持有调用过程中的变量，比如方法名，参数等。
~~~

* 基本原则

~~~
采用Microkernel + Plugin模式，Microkernel只负责组装Plugin，Dubbo自身的功能也是通过扩展点实现的，也就是Dubbo的所有功能点都可被用户自定义扩展所替换。
采用URL作为配置信息的统一格式，所有扩展点都通过传递URL携带配置信息。
~~~

## 求索

### 历史

随着互联网的发展，网站应用的规模不断扩大，常规的垂直应用架构已无法应对，分布式服务架构以及流动计算架构势在必行，亟需一个治理系统确保架构有条不紊的演进。

如图：

![dubbo发展历史][dubbo-history]

* 单一应用架构

  ~~~
  1. 当网站流量很小时，只需一个应用，将所有功能都部署在一起，以减少部署节点和成本。
  2. 此时，用于简化增删改查工作量的 数据访问框架【ORM】 是关键。
  ~~~

* 垂直应用架构

  ~~~
  1. 当访问量逐渐增大，单一应用增加机器带来的加速度越来越小，将应用拆成互不相干的几个应用，以提升效率。
  2. 此时，用于加速前端页面开发的 Web框架【MVC】 是关键。
  ~~~

* 分布式服务架构

  ~~~
  1. 当垂直应用越来越多，应用之间交互不可避免，将核心业务抽取出来，作为独立的服务，逐渐形成稳定的服务中心，使前端应用能更快速的响应多变的市场需求。
  2. 此时，用于提高业务复用及整合的分布式服务框架【RPC】是关键。
  ~~~

* 流动计算架构  

  ~~~
  1. 当服务越来越多，容量的评估，小服务资源的浪费等问题逐渐显现，此时需增加一个调度中心基于访问压力实时管理集群容量，提高集群利用率。
  2. 此时，用于提高机器利用率的资源调度和治理中心【SOA】 是关键。
  ~~~


## 用途

1. 透明化的远程方法调用，就像调用本地方法一样调用远程方法，只需简单配置，没有任何API侵入。

2. 软负载均衡及容错机制，可在内网替代F5等硬件负载均衡器，降低成本，减少单点。

3. 服务自动注册与发现，不再需要写死服务提供方地址，注册中心基于接口名查询服务提供者的IP地址，并且能够平滑添加或删除服务提供者。


# 总结

随着业务的扩张，与网站的发展，数据量越来越大是必然的，堆积硬件的又浪费又土的做法显然行不通，架构这时候就显得格外重要了，dubbo作为这样一个分布式的框架，有高性能和透明化的远程调用方案，以及SOA的助理方案，分工明细，扩展良好。然而，笔者也只是看看，具体等实地学习后才能评价。



**（以上，仅代表个人观点。无论对错，欢迎交流。^_^ ）**


[dubbo]:{{ "/2017-07-28-dubbo.png" | prepend: site.imgrepo }}
[dubbo-history]: {{ "/2017-07-28-dubbo-history.png" | prepend: site.imgrepo }}
[dubbo-framework]: {{ "/2017-07-28-dubbo-framework.jpg" | prepend: site.imgrepo }}
[dubbo-relation]: {{ "/2017-07-28-dubbo-relation.jpg" | prepend:site.imgrepo }}
[dubbo-module]: {{ "/2017-07-28-dubbo-modules.jpg" | prepend:site.imgrepo }}
[dubbo-extension]: {{ "/2017-07-28-dubbo-extension.jpg" | prepend: site.imgrepo }}
[dubbo-export]: {{ "/2017-07-28-dubbo-export.jpg" | prepend: site.imgrepo }}
[dubbo-refer]: {{ "/2017-07-28-dubbo-refer.jpg" | prepend: site.imgrepo }}
