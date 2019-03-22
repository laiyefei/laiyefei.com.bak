---
layout: post
title: 迈出DBA之路（三） Oracle GoldenGate 部署与使用笔记【扩展】
tags: DBA windows oracle 笔记
categories: 数据库 运维
---

* TOC
{:toc}

# 序言

还是要去部署Oracle GoldenGate，笔者前面安装失败了，近来很忙，然而，还是需要继续折腾。这里记录一些 **部署** 以及 **错误** 笔记，方便后面的查询。俗话说，**好记性不如烂笔头** 就是这个意思。

# 大纲
本章将记录部署以及报错记录。

## 部署笔记
分两个子标题吧，也好锚定；在这里，笔者已经当作 **环境正确安装Oracle** 了。

### 通用命令

~~~

* 一般已经有生产环境了，笔者这里记录的是全空的部署，从创建Oracle账号开始吧
  > sqlplus / as sysdba
  > archive log list;【查看是否归档模式，ogg需要归档模式】
    ps. 若无归档【笔者也没试过，环境已经是归档的，不敢保证可行性】
    > shutdown immediate;
      Database closed
      Database dismounted
      ORACLE instance shutdown
    > startup mount;
      ORACLE instance started
      ...
      Database mounted
    > alter database archivelog;
      Database altered.
    > alter database open;
      Database altered.
  > select supplemental_log_data_min from v$database;【查看数据库日志】
    ps. 如果返回NO【需要打开数据库日志】
    > alter database add supplemental log data;
      Database altered;
  > create tablespace[表空间名]
  > logging
  > datafile [路径.dbf]
  > size [需要指定大小]【例：50m】
  > autoextend on 【打开自动扩展空间】
  > next [扩展大小]【例：50m】 maxsize [最大]【例：2048m】
  > extent management local;【本地管理表空间】
  > create user [帐户名] profile default
  > identified by [密码] default tablespace [表空间]
  > account unlock;【需要对账户解锁】
  > grant connect, resource to [账号]
  > grant dba to [账号]

* 具体端操作
· 源端
  > ggsci【打开ggsci】
  > create subdirs 【创建子文件夹】
  > edit params mgr 【编辑管理进程控制文件】
      【
          -- 指定端口
          PORT 7809    
      】
  > edit params [抽取进程名] 【若不存在新建，例：ogg_get】
      【
          extract [ogg_get]  
          dynamicresolution
          SETENV(NLS_LANG="AMERICAN_AMERICA.ZHS16GBK")
          SETENV(ORACLE_SID=[实例名])
          userid [账号], password [密码]
          exttrail [OGG目录/dirdat/自定义名称]
          table [用户].*;【若有映射，需要配置映射】
      】
  > add extract ogg_get, tranlog, begin now【添加抽取进程】
  > edit params [投递进程名] 【若不存在新建，例：ogg_send】
      【
         extract ogg_send
         dynamicresolution
         SETENV(ORACLE_SID=[实例名])
         userid [用户名], password [密码]
         SETENV(NLS_LANG="AMERICAN_AMERICA.ZHS16GBK")
         rmthost [目标端ip], mgrport [目标端主进程端口], compress
         rmttrail [目标端OGG目录/dirdat/自定义名称]
         table [账号].*;
      】
  > add extract ogg_send, exttrailsource [源端OGG目录/dirdat/之前的自定义名称]
  > add rmttrail [目标端路径/dirdat/之前的自定义名称], extract ogg_send
  > start mgr
  > start ogg_get
  > start ogg_send
  > ...

· 目标端
  > 需要先刷sql语句：chkpt_ora_create.sql
  > edit params mgr
     【
        port 7809; 【指定主端口】
        -- 主端口被占用，从以下选取
        -- dynamicportlist 7800-7909
        -- 自动启动 replicat 进程【确保配置了】
        -- autostart replicat ogg_rec
        -- 当replicat异常时会自动启动，每n mins尝试重启所有replicat进程，一共尝试m次
        -- autorestart replicat *, waitminutes [n], retries [m]
        -- mgr 进程每隔x个小时，检查 extract 延时情况，超过y分钟作为信息记录log中，超过z分钟作为警告记录log中
        -- lagreporthours x
        -- laginfominutes y
        -- lagcriticalminutes z
        -- 删除a天前的trail文件
        -- purgeoldextracts [OGG目录/dirdat/*], usecheckpoints, minkeepdays a
     】
  >  edit params ogg_rec
     【
        replicat ogg_rec
        SETENV(NLS_LANG="AMERICAN_AMERICA.ZHS16GBK")
        SETENV(ORACLE_SID=[实例名])
        userid [帐户名], password [密码]
        assumetargetdefs
        reperror default, discard
        discardfile [OGG目录名/dirrpt/自定义名称], append, megabytes 50【可自变】
        dynamicresolution
        MAP [源用户名].*, target [目标用户名].*;【根据关系映射】
     】
  > add replicat ogg_rec, exttrail [OGG目录/dirdat/之前那个自定义名称], checkpointtable ogg_receive.checkpoint
  > start mgr
  > start ogg_rec
  > ...

~~~

### windows
~~~
1. ogg安装包解压缩
2. 保证环境变量
3. cd 目录
4. 打开 ggsci.exe
~~~

### linux

~~~
1. root 登录
2. vi /etc/sudoers
     找到root，复制一行，添加oracle all权限
3. tar xvf [路径] 【ogg安装包解压缩】
4. sudo ./ggsci 【进入目录，打开ogg目录内ggsci】
     ps. 如果报错，建立软连接。ln -s [文件地址] [目标地址]
~~~


## 错误日志记录

~~~

· 用户不存在 【关键字：ORA-01918】
    问题分析：根据分析日志可以确定是目标端不存在该用户导致的故障。
    问题处理：
        1. 如果不需要同步该用户，可以在目标端去掉掉映射该用户,再重启进程。【例如去掉：MAP KINGSTAR.*, TARGET CRMKINGSTAR.*;】
        2. 在目标端手工创建该用户,再重启进程。

· 表不存在【关键字：does not exist】
    问题分析：根据分析日志可以确定是目标端不存在该表导致的故障。
    问题处理：
        1. 如果不需要同步该表，可以在目标端排除掉该表,再重启进程。【例如添加：MAPEXCLUDE OLAP.TB_FT_OFSTK_CLIENT_BY_DAY】
        2. 在目标端手工创建该表, 异构数据库还需要重新生成表结构定义文件，再重启进程。

· 数据库索引失效【关键字：such index is in unusable state】
    问题分析：数据库索引失效引起的故障。
    问题处理：
        1. 重建这个有问题的索引，再重启进程，故障排除。

· 表结构不一致【关键字：Error mapping 】
    问题分析：出现该问题一般都是由于同步的源和目标表结构不一致，包括表字段和索引。
    问题处理：
        1. 如果是表字段不一致，需要修改表字段，异构数据库还需要重新生成表结构定义文件，再重启进程。
        2. 如果是索引不一致，需要重建索引，异构数据库还需要重新生成表结构定义文件，再重启进程。

· 磁盘空间不足【关键字：No space left on device】
    问题分析：根据分析日志可以确定是磁盘空间不足导致的故障。
    问题处理：
        1. 划分足够的磁盘空间，再重启进程。

· TCP/IP故障【关键字：TCP/IP error 10060 】
    问题分析：根据分析日志可以确定是不能连接到远程主机，包括ip地址或端口号。
    问题处理：
        1. 需要打通能够连接到远程主机IP和端口，再重启进程。

· 数据库不能连接【关键字：OCI Error during OCIServerAttach】
    问题分析：这种故障是数据库不能连接导致goldengate进程异常。
    问题处理：
        1. 需要先解决数据库异常，再重启进程。

· 表空间不足【关键字：exceeded max bytes】
    问题分析：没有自动扩展表空间【unable to extend】
    问题处理：
        1. 找到相关对象存储的表空间；【select owner,table_name,tablespace_name from dba_tables】
        2. 执行表空间扩展；【ALTER TABLESPACE [表空间]] ADD DATAFILE [文件.dbf] SIZE 100K AUTOEXTEND ON NEXT 10K MAXSIZE 100K;】

· 网络传输问题【关键字：network communication】
    问题分析：网络对接与进程的问题
    问题处理：
        1. 手工去KILL掉相应的锁进程，再重新启动进程。
        2. 不需理会，大概2小时后会自动释放该锁进程。
        3. goldengate 10.4.0.76 会解决锁问题。

· 参数变量配置不正确【关键字：recognize parameter argument】
    问题分析：进程参数文件配置不正确。
    问题处理：
        1. 检查参数配置文件，可能是进程名称与配置文件不一致或者是参数不正确，重启进程。

· 捕获进程不能为表添加补充日志【关键字：ORA-32588: supplemental logging attribute all column exists】
    问题分析：该表超过32个字段，并且该表没有唯一索引时会出现上面的异常；
    问题解决：
        1. 去掉参数“DDLOPTIONS ADDTRANDATA”。
        2. DELETE TRANDATA  用户.表
        3. 登录数据库执行: ALTER TABLE AXHT.BMBM2002 DROP SUPPLEMENTAL LOG DATA (ALL) COLUMNS

· 数据库补充日志（附加日志）没有打开【关键字：No minimum supplemental logging is enabled】
    问题分析：确定是源端oracle补充日志没有打开导致的故障，如果主键或唯一索引是组合的(复合的),就需要为表配置supplemental log,否则就不必,也就是说,如果所有表的主键是单列的,那根本就不必去理会它是什么意思，如果更新了主键中的部分字段,那supplemental log的作用就是把该记录其余的组成部分的数据也传输到目标机,否则目标机就存在不确定性。
    问题解决：
        1. 登录数据库，使用命令ALTER DATABASE ADD SUPPLEMENTAL LOG DATA打开补充日志。然后重新添加捕获进程和本地队列。

· 表补充日志（附加日志）没有打开【关键字：...No valid default archive log destination...】
    问题分析：根据分析日志可以确定是源端oracle补充日志没有打开导致的故障。
    问题解决：
        1. 登录数据库，使用命令ALTER DATABASE ADD SUPPLEMENTAL LOG DATA打开补充日志。

· DDL复制表没找到【关键字：check DDL installation】
    问题分析：根据分析日志可以确定是DDL复制操作已经打开，但没有找到安装复制DDL执行脚本产生的表GGS.GGS_DDL_HIST导致的故障。
    问题解决：
        1. 因为安装复制DDL是使用用户GGDDL，执行脚本后会在该用户产生跟踪goldengate运行的表，所以要实现支持DDL操作，在参数文件中登录数据库必须使用GGDLL和对应的密码登录。例如：USERID GGDDL@CRMDB,PASSWORD GGDDL。

~~~


# 总结

本文主要是笔者在部署 **Oracle GoldenGate** 中，遇到的问题，以及网上查找的一些错误日志，将来遇到错误，笔者将继续补充，这样方便排查问题，以及查看相应的部署命令。

**（以上，仅代表个人观点。无论对错，欢迎交流。^_^ ）**
