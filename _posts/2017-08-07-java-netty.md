---
layout: detail
title: java 学习历程 (五) 【Netty框架】
tags: java
categories: 框架
---

* TOC
{:toc}

# 序言
Netty 好几年前笔者就听过大名了，然而，技术业务方向与之擦肩而过，没去深究了。最近在学习dubbo，又看见了，本着好奇心，笔者还是有必要学习一番。

# 大纲

## 定义
**Netty** 是JBOSS提供的一个java开源框架。**Netty** 提供 **异步的**、**事件驱动** 的网络应用程序框架和工具，用以快速开发 **高性能**、**高可靠性** 的网络 **服务器** 和 **客户端** 程序。
**Netty** 可以用于建立TCP等底层的连接，基于Netty可以建立高性能的Http服务器。

## 解析

比较下传统的IO和Netty，先上代码：

传统：
```java
//...
InputStream oIS = new FileInputStream("file.test.bin");
int iByte = oIS.read();//当前线程等待结果到达，直到遇到错误。
//...
```

使用NIO：
```java
//...
while(true){
  oSelector.select();//从多个通道请求事件
  Iterator oIT = oSelector.selectedKeys().iterator();
  while(oIT.hasNext()){
    SelectorKey oSK = (SelectionKey) oIT.next();
    handleSelectorKey(oSK);//logic do
    oIT.remove();
  }
}
//...
```

千言万语不如图：

![netty处理请求][netty]

示例：

```java
Channel oC = //TODO...
ChannelFuture oCF = oC.write(oData);
oCF.addListener(
  new ChannelFutureListener(){
    @override
    public void operationComplete(ChannelFuture oCF) throws Exception{
      if(!oCF.isSuccess()){
        oCF.cause().printStacktrace();
        //...
      }
      //...
    }
  }
);
//...
oCF.sync();
```
引入观察者模式之后：
```java
//服务端
public class EchoServer {

    private final int port;

    public EchoServer(int port) {
        this.port = port;
    }

    public void run() throws Exception {
        // Configure the server.
        EventLoopGroup bossGroup = new NioEventLoopGroup();
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            ServerBootstrap b = new ServerBootstrap();
            b.group(bossGroup, workerGroup).channel(NioServerSocketChannel.class).option(ChannelOption.SO_BACKLOG, 100)
                   .handler(new LoggingHandler(LogLevel.INFO)).childHandler(new ChannelInitializer<SocketChannel>() {
                       @Override
                       public void initChannel(SocketChannel ch) throws Exception {
                           ch.pipeline().addLast(
                           // new LoggingHandler(LogLevel.INFO),
                                   new EchoServerHandler());
                       }
                   });

            // Start the server.
            ChannelFuture f = b.bind(port).sync();

            // Wait until the server socket is closed.
            f.channel().closeFuture().sync();
        } finally {
            // Shut down all event loops to terminate all threads.
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }   
}


//逻辑处理
public class EchoServerHandler extends ChannelInboundHandlerAdapter {

    private static final Logger logger = Logger.getLogger(EchoServerHandler.class.getName());

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        ctx.write(msg);
    }

    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) throws Exception {
        ctx.flush();
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        // Close the connection when an exception is raised.
        logger.log(Level.WARNING, "Unexpected exception from downstream.", cause);
        ctx.close();
    }
}


//调用
new EchoServer(9999).run();


```

```java
//客户端
public class EchoClient {
    private final String host;
    private final int port;
    private final int firstMessageSize;

    public EchoClient(String host, int port, int firstMessageSize) {
        this.host = host;
        this.port = port;
        this.firstMessageSize = firstMessageSize;
    }

    public void run() throws Exception {
        // Configure the client.
        EventLoopGroup group = new NioEventLoopGroup();
        try {
            Bootstrap b = new Bootstrap();
           b.group(group).channel(NioSocketChannel.class).option(ChannelOption.TCP_NODELAY, true).handler(new ChannelInitializer<SocketChannel>() {
                @Override
                public void initChannel(SocketChannel ch) throws Exception {
                   ch.pipeline().addLast(
                   // new LoggingHandler(LogLevel.INFO),
                           new EchoClientHandler(firstMessageSize));
                }
            });

            // Start the client.
            ChannelFuture f = b.connect(host, port).sync();

            // Wait until the connection is closed.
            f.channel().closeFuture().sync();
        }
        finally {
            // Shut down the event loop to terminate all threads.
            group.shutdownGracefully();
        }
    }
}


//逻辑处理
public class EchoClientHandler extends ChannelInboundHandlerAdapter {

    private static final Logger logger = Logger.getLogger(EchoClientHandler.class.getName());

    private final ByteBuf firstMessage;

    /**
     * Creates a client-side handler.
     */
    public EchoClientHandler(int firstMessageSize) {
        if (firstMessageSize <= 0) {
            throw new IllegalArgumentException("firstMessageSize: " + firstMessageSize);
        }
        firstMessage = Unpooled.buffer(firstMessageSize);
        for (int i = 0; i < firstMessage.capacity(); i++) {
            firstMessage.writeByte((byte) i);
        }
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        ctx.writeAndFlush(firstMessage);
        System.out.print("active");
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        ctx.write(msg);
        System.out.print("read");
    }

    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) throws Exception {
        ctx.flush();
        System.out.print("readok");
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        // Close the connection when an exception is raised.
        logger.log(Level.WARNING, "Unexpected exception from downstream.", cause);
        ctx.close();
    }
}

//调用
new EchoClient("http://sherlock.help", 9999, "Hello").run();

```



## 求索


* Netty 发展历史

~~~
jdk1.0-jdk1.3
     jdk1.0-jdk1.3的时候，java的IO类库还没有Unix网络编程中的概念，例如Pipe，Channel，Buffer和Selectro等。
jdk1.4
     2002年发布jdk1.4，新增了一个java.nio的包，里面提供了很多进行异步IO开发的API和类库
jdk1.7
     nio升级为nio2.0
~~~





* 传统 vs Netty

传统：

![Netty之前][netty.Pre]

~~~
缺陷
--------------------------------------------------------------------------------
1. 线程模型存在致命缺陷：一连接一线程的模型导致服务端无法承受大量客户端的并发连接；
2. 性能差：频繁的线程上下文切换导致 CPU 利用效率不高；
3. 可靠性差：由于所有的 IO 操作都是同步的，所以业务线程只要进行 IO 操作，也会存在被同步阻塞的风险，这会导致系统的可靠性差，依赖外部组件的处理能力和网络的情况。
================================================================================================================================================
采用NIO
--------------------------------------------------------------------------------
1. Nio 采用 Reactor 模式，一个 Reactor 线程聚合一个多路复用器 Selector，它可以同时注册、监听和轮询成百上千个 Channel，一个 IO 线程可以同时并发处理N个客户端连接，线程模型优化为1：N（N < 进程可用的最大句柄数）或者 M : N (M通常为 CPU 核数 + 1， N < 进程可用的最大句柄数)
2. 由于 IO 线程总数有限，不会存在频繁的 IO 线程之间上下文切换和竞争，CPU 利用率高
3. 所有的 IO 操作都是异步的，即使业务线程直接进行 IO 操作，也不会被同步阻塞，系统不再依赖外部的网络环境和外部应用程序的处理性能。
~~~

使用了NIO之后：

![NIO 服务端][netty.After1]

![NIO 客户端][netty.After2]

* 优点：

~~~
1. API使用简单，开发门槛低， 学习成本低。
2. 功能强大，预置了多种编解码功能，支持多种主流协议。【包括谷歌的 Protobuf、Jbossmarshalling、Java 序列化、压缩编解码、XML 解码、字符串编解码等，这些编解码框架可以被用户直接使用】
3. 定制能力强，可以通过ChannelHandler对通信框架进行灵活地扩展。
4. 性能高，通过与其他业界主流的NIO框架对比，Netty的综合性能最优。【更好的吞吐量，低延迟，更省资源，尽量减小不必要的内存拷贝】
5. 成熟、稳定，Netty修复了已经发现的所有JDK NIO BUG，业务开发人员不需要再为NIO的BUG而烦恼。【如：不再因过快、过慢或超负载连接导致OutOfMemoryError；不再有在高速网络环境下NIO读写频率不一致的问题】
6. 社区活跃，版本迭代周期短，发现的BUG可以被及时修复，同时，更多的新功能会加入。
7. 经历了大规模的商业应用考验，质量得到验证。在互联网、大数据、网络游戏、企业应用、电信软件等众多行业得到成功商用，证明了它已经完全能够满足不同行业的商业应用了。
~~~



## 用途

* 快速开发高性能、高可靠性的网络服务器和客户端程序
* 阿里分布式服务框架 Dubbo
* 游戏行业：账号登陆服务器、地图服务器之间可以方便的通过 Netty 进行高性能的通信
* 大数据领域：经典的 Hadoop 的高性能通信和序列化组件 Avro 的 RPC 框架
* 企业软件：企业和 IT 集成需要 ESB，Netty 对多协议支持、私有协议定制的简洁性和高性能是 ESB RPC 框架的首选通信组件。
* 通信行业

# 总结
**Netty** 是java的一个开源框架，第一个Netty2.0的版本是2004年6月出现的【笔者网上查了好久，大概是这个吧】，在java1.4【2003】出现New IO之后，由JBOSS提供的一个 **异步**，**事件驱动** 的网络应用程序框架。这样一个基于NIO的异步框架很好的解决了CPU空等待的问题，充分利用硬件的性能，还支持了多种协议，预置了多种编码功能，性能高，扩展性也不错，解决了传统的IO带来的问题，还经得起时间的考验【我不是在做广告。。。笔者还没用，等遇到什么问题再说吧】。整体上分为了三层结构，分别是 **网络调度层**，**职责链**，**业务逻辑层**，将底层与业务分隔开来，中间通过有序的管道传播，这样的结构也是可以借鉴的。

↓
→ 简而言之，**Netty** 就是 **基于NIO**，**稳定高性能** 用来 **管理通信** 的一个 **java开源框架**。


**（以上，仅代表个人观点。无论对错，欢迎交流。^_^ ）**

[netty]: {{ "/2017-08-07-netty.png" | prepend: site.imgrepo }}
[netty.Pre]: {{ "/2017-08-07-nettypre.png" | prepend: site.imgrepo }}
[netty.After1]: {{ "/2017-08-07-nettyafter1.png" | prepend: site.imgrepo }}
[netty.After2]: {{ "/2017-08-07-nettyafter2.png" | prepend: site.imgrepo }}
