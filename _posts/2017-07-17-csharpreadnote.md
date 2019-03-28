---
layout: post
title: CSharp 研读笔记（一）【AOP编程】
tags: CSharp windows 思想
categories: 编程语言
---

* TOC
{:toc}

# 序言
工作许多年，从外行到入坑，笔者都是从事.net方向，不知是怎么入坑，既然贴上了，.net 标签，那么有必要完整的学习下相关的知识。 .net 作为微软的框架，它有着自己的开发语言c#（←_←...微软还想c++++，先不吐槽了）， 既然入坑了，那么有必要认真研究下c#，反正思想才是关键。笔者就从最近听见的AOP编程思想，认真研读下.net，不足之处，请指教了。

# 大纲
笔者已经习惯了思考框架，就从四个方向来学习，描述吧（←_←...）

## 定义
AOP【面向切面编程（Aspect-Oriented Programming）】。<br />
官方解释：
~~~
面向切面编程，是通过预编译方式和运行期动态代理，实现在不修改源代码的情况下，
给程序统一添加功能的一种技术。他是一种好的方法论，是对OOP编程的一种补充。
OOP是关注将需求功能划分为不同的并且相对独立，封装良好的类，并让它们有着属于自己的行为，依靠继承和多态等来定义彼此的关系；
AOP是希望能够将通用需求功能从不相关的类当中分离出来，能够使得很多类共享一个行为，一旦发生变化，不必修改很多类，而只需要修改这个行为即可。
~~~

## 解析
随着业务的增加，实现越来越多的业务逻辑，项目的增加，很难兼顾项目的所有细节【如：日志记录，重试，异常处理，操作计时】，代码要维护的边边角角更多了，拷贝堆积代码的方式，显然不仅徒耗工作量，又容易出错，又太low了，所以，需要将边边角角通用的琐碎的功能，统一模块管理起来。面向**切面**编程，就可以很好的处理这个问题。你可以很酷的实现它，比如：
~~~
[EnsureNonNullParameters] //参数不为空判断
[Log] //记录日志
[TimeExecution] //执行时间
[RetryOnceOnFailure] //失败重试一次
public void RunTesterDemo(string sParam1, string sParam2){
	//to do
	//...
}
~~~
从上面，你可以看出，这些琐碎需要执行的**通用功能**，与你的业务是分开的，编写业务逻辑可以明显分开，使得代码更美观，有条理，逻辑清晰。<br/>

AOP的实现方式主要有两个：<br />
1. 静态拦截<br />
这么装逼的名词，其实很简单，是通过接口实现的，笔者分析理解，并编写例子如下：
笔者从代码的执行流程，跟踪起来， 以类似CMD懒执行的方式讲述：<br />
~~~
· 执行入口：
    Tester oTester = new Tester() { IsActive = false };
    TesterProcessorDecorator oTPD = new TesterProcessorDecorator(new TesterProcessor());
    oTPD.Submit(oTester);
· Tester类
	public class Tester{
        public bool IsActive {get;set;}
        //...【笔者只是做测试】
    }
· TesterProcessorDecorator 类【装饰器，容器，装载切面】：
	public class TesterProcessorDecorator : ITesterProcessor{

        public TesterProcessorDecorator(ITesterProcessor oTesterProcessor){
            TesterProcessor = oTesterProcessor;
        }

        public void PreProceed(Tester oTester){
            Console.WriteLine("测试前。。。");
        }
        public void AfterProceed(Tester oTester){
            Console.WriteLine("测试后。。。");
        }

        ITesterProcessor TesterProcessor { get; set; }
        public void Submit(Tester oTester){
            PreProceed(oTester);
            TesterProcessor.Submit(oTester);
            AfterProceed(oTester);
        }
    }
· ITesterProcessor 【接口】：
	public interface ITesterProcessor{
        void Submit(Tester oTester);
    }
· TesterProcessor 【切面】：
	public class TesterProcessor : ITesterProcessor{
        public void Submit(Tester oTester) {
            Console.WriteLine("aop embed here and test success !");
            oTester.IsActive = true;
        }
    }
~~~
以上就是静态拦截的代码解析过程，静态代理，就是代码结构清晰，运行快，因为静态编译的东西，肯定更快嘛。<br />

2. 动态拦截 <br />
利用系统带的类，实现动态代理：
~~~
RealProxy 	  : using System.Runtime.Remoting.Proxies;
IMethodCallMessage: using System.Runtime.Remoting.Messaging;
~~~
仍然和静态代理一样，采用类似CMD规范的懒执行的方式去查看代码：<br />
~~~
· 执行入口：
	//动态代理
	DynamTester oDTester = new DynamTester() { Name = "sherlock", PassWord = "iamsherlocked" };
	DynamTesterProcessor oTP = TransparentProxy.Create<DynamTesterProcessor>();
	oTP.RegisterUser(oDTester);
· DynamTester类：
	public class DynamTester{
        public string Name { set; get; }
        public string PassWord { set; get; }
    	//...
    }
· TransparentProxy 类：
   public static class TransparentProxy{
        public static T Create<T>(){
            T instance = Activator.CreateInstance<T>();
            MyRealProxy<T> realProxy = new MyRealProxy<T>(instance);
            T transparentProxy = (T)realProxy.GetTransparentProxy();
            return transparentProxy;
        }
    }
· MyRealProxy 类：
    public class MyRealProxy<T> : RealProxy{
        private T _target;
        public MyRealProxy(T target) : base(typeof(T)){
            this._target = target;
        }
        public override IMessage Invoke(IMessage msg){
            PreProceede(msg);
            IMethodCallMessage callMessage = (IMethodCallMessage)msg;
            object returnValue = callMessage.MethodBase.Invoke(this._target, callMessage.Args);
            PostProceede(msg);
            return new ReturnMessage(returnValue, new object[0], 0, null, callMessage);
        }
        public void PreProceede(IMessage msg){
            Console.WriteLine("方法执行前");
        }
        public void PostProceede(IMessage msg){
            Console.WriteLine("方法执行后");
        }
    }
· DynamTesterProcessor 【切面】：
	public class DynamTesterProcessor : MarshalByRefObject, IDynamTesterProcessor{
        public void RegisterUser(DynamTester oDTester){
            Console.WriteLine("用户已注册。");
        }
    }
~~~
这就是动态代理，可以利用特性封装起来，然后逼格就高了，笔者就介绍到这里，以后用到再细细品味。


## 求知
为什么选择AOP？<br />
~~~
优势：
  · 将通用功能从业务逻辑中抽出来，可以省略大量代码，便于后期的维护和操作。
  · 软件设计时，抽出这些通用功能【切面】，可以降低软件的复杂度，统一维护一个模块，项目的主业务里面看不到这些模块。

劣势：
  ...【有坏处，干嘛还用，别管了，反正笔者也不知道←_←...】
~~~


## 创意
AOP编程的应用，大概可以有以下几种场景：
~~~
1. 日志记录，跟踪，优化，监控
2. 事务的处理，持久化【数据库连接池管理，系统统一认证，权限管理】
3. ...【系统通用的功能，都可以切入方法。】
~~~


# 总结
所以，AOP就是面向切面编程，将一些通用的东西，琐碎又广泛的通用功能，统一成模块管理起来，然后利用接口，切入方法中，使得工作量降低，业务逻辑代码清晰。

<br />
↓
→ 简而言之，AOP编程是一种**通过****接口**用来将**功能切面**切入方法中的**编程思想**。


**（以上，仅代表个人观点。无论对错，欢迎交流。^_^ ）**
