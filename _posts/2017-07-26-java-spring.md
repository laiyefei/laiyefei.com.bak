---
layout: detail
title: java 学习历程 (三) 【Spring框架】
tags: java
categories: 框架
date: 2017-07-26
---

* TOC
{:toc}

# 序言
**Spring框架** 就是 Spring + 框架，意为春天的框架，那么大牛为什么要这样命名呢，肯定有他的道理，好了，笔者意淫完毕。以下就来学习一翻。

# 大纲

## 定义
**Spring框架** 是一个java的开源框架，是为了解决 **企业应用程序开发复杂性** 而创建的。是一个 **轻量级** **控制反转**【IOC】和 **面向切面**【AOP】的 **容器** **框架**。

~~~
轻量：从大小和开销两方面而言Spring都是轻量的。完整的Spring框架可以在一个大小只有1MB多的JAR文件里面发布。并且Spring所需的处理开销也是微不足道的。此外Spring是非侵入式的【Spring应用中的对象不依赖于Spring的特定类】。
控制反转：Spring通过一种称为控制反转的技术促进了松耦合。当应用了IOC，一个对象依赖的其他对象就会通过被动的方式传递进来，而不是这个对象自己创建或者查找依赖对象。你可以认为IOC与JNDI相反【不是对象从容器里面查找依赖，而是容器在对象初始化时不等对象请求就主动把依赖传递给他】。
面向切面：Spring提供了面向切面编程的丰富支持，允许通过分离应用的业务逻辑与系统级服务【例如 审计（auditing）和 事务（transaction）管理】进行内聚性的开发。应用对象只实现他们应该做的【完成业务逻辑】而已。他们并不负责其他的系统级关注点【例如 日志或事务支持】。
容器：Spring包含并管理应用对象的配置和生命周期，在这个意义上他是一种容器，你可以配置你的每个bean如何被创建【基于一个可配置原型（prototype）】，你的bean可以创建一个单独的实例或者每次需要时都生成一个新的实例【以及他们是如何相互关联的】。然而，Spring不应该被混同于传统的重量级的EJB容器【他们经常是庞大与笨重的，难以使用】。
框架：Spring可以将简单的组件配置、组合成为复杂的应用。在Spring中，应用对象被声明式地组合【典型地是在一个XML文件里】。Spring也提供了很多基础功能【事务管理、持久化框架集成等等】，将应用逻辑的开发留给了使用者。
~~~

## 解析

Spring 框架是一个分层架构，是由7个良好的模块组成的。Spring模块构建在核心容器之上，核心容器定义了 **创建** **配置** 和 **管理** bean【可重用组件】的方式，如图所示：


![Spring框架模块展示][spring-framework]

Spring 框架的每个模块【或组件】可以单独存在，或者与其他一个或多个模块联合实现。每个模块的功能如下：

~~~
Spring Core【核心容器】：核心容器提供 Spring 框架的基本功能。核心容器的主要组件是 BeanFactory，它是工厂模式的实现。BeanFactory 使用控制反转 （IOC） 模式将应用程序的配置和依赖性规范与实际的应用程序代码分开。
Spring Context【Spring上下文】：Spring上下文是一个配置文件，向Spring框架提供上下文信息。Spring上下文包括企业服务，例如 JNDI，EJB，电子邮件，国际化，校验和调度功能。
Spring AOP：通过配置管理特性，Spring AOP模块直接将面向切面的编程功能，集成到了Spring框架中。所以，可以使Spring框架管理的任何对象支持AOP，Spring AOP模块为基于Spring的应用程序中的对象提供了事务管理服务，通过使用Spring AOP，不用依赖EJB组件，就可以将声明性事务管理集成到应用程序中。
Spring DAO：JDBC DAO 抽象层提供了有意义的异常层次结构，可用该结构来管理异常处理和不同数据库供应商抛出的错误信息。异常层次结构简化了错误处理，并且极大地降低了需要编写的异常代码数量【例如 打开和关闭连接】。Spring DAO 的面向JDBC的异常遵从通用的DAO异常层次结构。
Spring ORM：Spring 框架插入了若干个ORM框架，从而提供了ORM的对象关系工具，其中包括JDO，Hibernate和iBatis SQL Map。所有这些都遵从Spring的通用事务和DAO异常层次结构。
Spring Web：Web上下文模块建立在应用程序上下文模块之上，为基于Web的应用程序提供了上下文。所以，Spring框架支持与Jakarta Struts 的集成。Web模块还简化了处理多部分请求以及将请求参数绑定到域对象的工作。
Spring MVC：MVC框架是一个全功能的构建Web应用程序的MVC实现。通过策略接口，MVC框架变成为高度可配置的，MVC容纳量大量视图技术【包括：JSP，Velocity，Tiles，iText，POI】。
~~~
Spring框架的功能可以用在任何J2EE服务器中，大多数功能也适用于不受管理的环境。Spring的核心要点是：支持不绑定到特定J2EE服务的可重用业务和数据访问对象。毫无疑问，这样的对象可以在不同J2EE环境【Web或EJB】，独立应用程序，测试环境之间重用。


这些概念，笔者看着也烦，直接上代码：

* 包说明：

~~~
1. spring.jar 【包含有完整发布模块的单个jar 包；这个在 版本3.03 之后不再提供！想要该包的同学，把dist目录下的jar全部解压开，在打包成spring.jar即可。】
2. org.springframework.aop 【包含在应用中使用Spring的AOP特性时所需的类。】
3. org.springframework.asm 【Spring独立的asm程序, Spring2.5.6 的时候需要 asmJar 包，3.0开始提供他自己独立的 asmJar。】
4. org.springframework.aspects 【提供对 AspectJ 的支持，以便可以方便的将面向方面的功能集成进 IDE 中，比如 Eclipse AJDT。】
5. org.springframework.beans 【所有应用都要用到的，它包含访问配置文件、创建和管理 bean 以及进行 Inversion of Control / Dependency Injection（IoC/DI）操作相关的所有类。】
6. org.springframework.context.support 【包含支持缓存Cache（ehcache）、JCA、JMX、 邮件服务（Java Mail、COS Mail）、任务计划Scheduling（Timer、Quartz）方面的类。】
7. org.springframework.context 【为 Spring 核心提供了大量扩展。可以找到使用 Spring ApplicationContext 特性时所需的全部类，JDNI 所需的全部类，UI 方面的用来与模板（Templating）引擎如 Velocity、FreeMarker、JasperReports集成的类，以及校验 Validation 方面的相关类。】
8. org.springframework.core 【包含 Spring 框架基本的核心工具类，Spring 其它组件要都要使用到这个包里的类，是其它组件的基本核心。】
9. org.springframework.expression 【Spring表达式语言。】
10. org.springframework.instrument.tomcat 【Spring3.0 对Tomcat的连接池的集成。】
11. org.springframework.instrument 【Spring3.0 对服务器的代理接口。】
12. org.springframework.jdbc 【包含对 Spring 对 JDBC 数据访问进行封装的所有类。】
13. org.springframework.jms 【提供了对 JMS 1.0.2/1.1 的支持类。】
14. org.springframework.orm 【包含 Spring 对 DAO 特性集进行了扩展，使其支持 iBATIS、JDO、OJB、TopLink， 因为 hibernate 已经独立成包了，现在不包含在这个包里了。这个jar文件里大部分的类都要依赖 spring-dao.jar 里的类，用这个包时你需要同时包含 spring-dao.jar 包。】
15. org.springframework.oxm 【Spring 对 Object/XMl 的映射支持,可以让 Java 与 XML 之间来回切换。】
16. org.springframework.test 【对Junit等测试框架的简单封装。】
17. org.springframework.transaction 【为 JDBC、Hibernate、JDO、JPA 等提供的一致的声明式和编程式事务管理。】
18. org.springframework.web.portlet 【SpringMVC 的增强。】
19. org.springframework.web.servlet 【对 J2EE6.0 的 Servlet3.0 的支持。】
20. org.springframework.web.struts 【Struts 框架支持，可以更方便更容易的集成 Struts 框架。】
21. org.springframework.web 【包含 Web 应用开发时，用到 Spring 框架时所需的核心类，包括自动载入 WebApplicationContext 特性的类、Struts 与 JSF 集成类、文件上传的支持类、Filter 类和大量工具辅助类。】

~~~


* HelloWorld 实例

  · HelloWorld.java

  ```java

  package com.core.Test

  public class HelloWorld{
    private String message;
    public void setMessage(String sMessage){
      this.message = sMessage;
    }  
    public String getMessage(){
      return message;
    }
  }

  ```

  · Beans.xml

  ```XML

  <? xml version="1.0" encoding="UTF-8" ?>

  <beans xmlns="http://www.springframework.org/schema/beans"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.springframework.org/schema/beans
      http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

        <bean id="HelloWorld" class="Test.HelloWorld" >
          <property name="message" value="Hello World" />
        </bean>

  </beans>

  ```

  · Main.java

  ```java

  package com.core.Test;

  import org.springframework.context.ApplicationContext;
  import org.springframework.context.support.ClassPathXmlApplicationContext;

  public class Main {
     public static void main(String[] args) {
       //create context from xml
        ApplicationContext oAC = new ClassPathXmlApplicationContext("Beans.xml");
        //get obj from xml bean's id
        HelloWorld oHW = (HelloWorld)oAC.getBean("HelloWorld");
        //print message
        System.out.println(oHW.getMessage());
     }
  }

  ```

* AOP
  · 业务逻辑
    ```java
    package com.core.Test;
    //spring need
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;
    //business
    import com.core.dao.UserDao;
    import com.core.pojo.User;
    import com.core.service.UserService;

    @service
    public class UserServiceImpl implements UserService {

        @Autowired
        private UserDao userDao;

        @override
        public void addUser(User oUser){
            //do insert
            userDao.insertUser(oUser);

            //after insert
            System.out.println("添加成功！");
        }

        @override
        public void deleteUser(String sUserId){
            //do delete
            userDao.deleteUser(sUserId);

            //after delete
            System.out.println("删除成功！");
        }

    }

    ```

  · 切面代码
    ```java
    package com.core.transaction;
    //spring need
    import org.aspectj.lang.ProceedingJoinPoint;
    //business
    import com.core.pojo.User;

    public class TransactionTest{
      //前置通知
      public void beforeTransaction(){
        //TODO..
        System.out.println("事务执行前...");
      }
      //后置通知
      public void afterTransaction(){
        //TODO..
        System.out.println("事务执行后...");
      }
      //环绕通知
      public void aroundTransaction(ProceedingJoinPoint oJP) throws Throwable{
        //TODO..
        System.out.println("事务执行前...");

        //business
        oJP.proceed();

        //TODO..
        System.out.println("事务执行后...");
      }
    }
    ```

  · [配置文件]【beans.xml】
    ```xml
    <? xml version="1.0" encoding="UTF-8" ?>

    <beans xmlns="http://www.springframework.org/schema/beans"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

          <bean id="TransactionTest" class="com.core.transaction.TransactionTest" >
            <aop:config>
              <aop:pointcut expression="execution(* com.core.service.*.*.*(..))" id="tt" />
              <aop:aspect ref = "TransactionTest">
                <aop:before method="beforeTransaction" pointcut-ref="tt" />
                <aop:after-returning method="afterTransaction" pointcut-ref="tt"/>

                <!-- 环绕通知 -->
                <aop:around method="around" pointcut-ref="tt"/>

              </aop:aspect>
            </aop:config>
          </bean>
    </beans>

    ```
  · 执行文件
    ```java
    public void run(){
        //read xml info
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("beans.xml");
        //create obj
        UserService oUS = applicationContext.getBean(UserService.class);
        User oUser = new User();
        //TODO..
        oUser.setAge(28);
        //...

        //run function
        oUS.addUser(oUser);
        oUS.deleteUser(oUser.UserId);
    }
    ```

  ·· 基于配置文件的切面方式：
    ```java
    package com.core.transaction;
    //spring need
    import org.aspectj.lang.ProceedingJoinPoint;
    import org.aspectj.lang.annotation.AfterReturning;
    import org.aspectj.lang.annotation.Around;
    import org.aspectj.lang.annotation.Aspect;
    import org.aspectj.lang.annotation.Before;
    import org.aspectj.lang.annotation.Pointcut;

    @Aspect
    public class TransactionTest {

        @Pointcut(value="execution(* com.core.service.*.*.*(..))")
        public void point(){
            //TODO..
        }

        @Before(value="point()")
        public void before(){
            System.out.println("提交事务前...");
        }

        @AfterReturning(value = "point()")
        public void after(){
            System.out.println("提交事务后...");
        }

        @Around("point()")
        public void around(ProceedingJoinPoint oPJ) throws Throwable{
            //TODO..
            System.out.println("环绕前..");

            //business
            oPJ.proceed();

            //TODO..
            System.out.println("环绕后...");
        }
    }
    ```

* Spring MVC
  · 配置文件【web.xml】
    ```xml
      <!--configure the setting of springmvcDispatcherServlet and configure the mapping-->
      <servlet>
        <servlet-name>springmvc</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
          <param-name>contextConfigLocation</param-name>
          <param-value>classpath:springmvc-servlet.xml</param-value>
        </init-param>
        <!-- <load-on-startup>1</load-on-startup> -->
      </servlet>

      <servlet-mapping>
        <servlet-name>springmvc</servlet-name>
        <url-pattern>/</url-pattern>
      </servlet-mapping>
    ```
  · 配置文件【springmvc-servlet.xml】
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:context="http://www.springframework.org/schema/context"
        xmlns:mvc="http://www.springframework.org/schema/mvc"
        xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
            http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.1.xsd
            http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc-4.1.xsd">                    

        <!-- scan the package and the sub package -->
        <context:component-scan base-package="test.SpringMVC"/>

        <!-- don't handle the static resource -->
        <mvc:default-servlet-handler />

        <!-- if you use annotation you must configure following setting -->
        <mvc:annotation-driven />

        <!-- configure the InternalResourceViewResolver -->
        <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver"
                id="internalResourceViewResolver">
            <!-- 前缀 -->
            <property name="prefix" value="/WEB-INF/jsp/" />
            <!-- 后缀 -->
            <property name="suffix" value=".jsp" />
            <!-- 在WEB-INF文件夹下创建名为jsp的文件夹，用来存放jsp视图。 -->
        </bean>
    </beans>
    ```
  · 控制器【Controller】
    ```java
    @Controller
    @RequestMapping("/mvc")
    public class mvcController {

        @RequestMapping("/hello", method = RequestMethod.GET)
        public String hello(ModelMap oModel){
            oModel.addAttribute("message", "Show Message in SpringMVC with Hello World");
            return "Hello World";
        }
    }

    //访问地址：http://localhost:8080/项目名/mvc/hello
    ```

  · 视图【View】
    ```html
    <html>  
      <body>  
        <div> MVC Test Message : ${message} </div>     
      </body>  
    </html>
    ···
  · 模型【Model】
    ```java
    package com.core.model;

    public class Users {

        private String userName;
        private String passWord;
        public String getUserName() {
            return userName;
        }
        public void setUserName(String sUserName) {
            this.userName = sUserName;
        }
        public String getPassWord() {
            return passWord;
        }
        public void setPassword(String sPassWord) {
            this.passWord = sPassWord;
        }
    }
    ```

## 求索

* 发展历史

~~~
1. 2000 年：Spring框架最开始的部分是Rod Johnson 为伦敦的金融界提供独立咨询业务时，写出来的。
2. 2001 年：Rod意识到J2EE需要简化。
3. 2002 年：Rod发表了《Expert One-on-One J2EE Design and Development》
4. 2003 年：一批自愿拓展Spring框架的程序员组成了团队，在Sourceforge上构建了一个项目
5. 2004 年：Spring框架首次在Apache2.0的使用许可中发布。
6. 2005 年：Spring因具有里程碑意义的新的版本的推出，更多功能的添加，从而得到了比2004年更高的采用率；Spring框架的开发人员成立了自己的公司，来提供对Spring的商业支持，其中最显著的就是与BEA的合作；第一个Spring会议在迈阿密举行，3天的课程吸引了300名开发人员。2006年6月在安特卫普召开的会议有400多名开发人员；
7. ...
~~~

* 好处

~~~
1. 轻量级的容器框架没有侵入性
2. 使用IoC容器更加容易组合对象直接间关系，面向接口编程，降低耦合
3. Aop可以更加容易的进行功能扩展，遵循ocp开发原则
4. 创建对象默认是单例的，不需要再使用单例模式进行处理
~~~


## 用途

* AOP使用场景
~~~
1. 权限【Authentication】
2. 缓存【Caching】
3. 内容传递【Context passing】
4. 错误处理【Error handling】
5. 懒加载【Lazy loading】
6. 调试【Debugging】
7. 记录跟踪，优化，校准【logging, tracing, profiling and monitoring】
8. 性能优化【Performance optimization】
9. 持久化【Persistence】
10. 资源池【Resource pooling】
11. 同步【Synchronization】
12. 事务【Transactions】
~~~

* IOC场景
~~~
1. 解耦组件之间复杂关系
2. 把资源获取的方向反转，让IoC容器主动管理这些依赖关系，将这些依赖关系注入到组件中，那么会让这些依赖关系的适配和管理更加灵活。
3. 如果耦合关系需要变动，并不需要重新修改和编译Java源码，这符合在面向对象设计中的开闭准则，并且能够提高组件系统设计的灵活性，如果结合OSGi的使用特性，还可以提高应用的动态部署能力。
4. 在某个容器系列中可以看到各种带有不同容器特性的实现，可以读取不同配置信息的各种容器，从不同I/O源读取读取配置信息的各种容器设计，更加面向框架的容器应用上下文的容器设计等。
~~~


# 总结

**Spring框架** 是通过 **容器工厂** 创建出对象的，这是一个松耦合的框架，可以通过在配置文件修改内容，从而修改创建的对象，这样也可以修改类的依赖，并且，还以通过配置文件进行方法层面上的编程，这样的方式可以极大的降低应用程序开发的复杂度。框架提供了持久层的支持，可以与其他的持久化框架很好的对接起来，贯穿于全部的web开发采用MVC的方式。

整体来说，就是在IOC容器的支撑下，根据配置文件反射出对象，并且执行相应的业务逻辑。

↓
→ 简而言之，**Spring框架** 是一个java的开源框架，是一个 **轻量级** **控制反转**【IOC】和 **面向切面**【AOP】的 **容器** **框架**。


**（以上，仅代表个人观点。无论对错，欢迎交流。^_^ ）**


[spring-framework]:{{ "/2017-07-26-spring.png" | prepend : site.imgrepo }}
