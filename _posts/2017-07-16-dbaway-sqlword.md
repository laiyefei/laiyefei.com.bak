---
layout: post
title: 迈出DBA之路（二）揭开SQL语句的面纱 【Oracle篇】
tags: DBA oracle 脚本
categories: 数据库
---

* TOC
{:toc}

# 序言
笔者的工作内容是经常与SQL数据库打交道，那么明白这个SQL语句在数据库中的流转过程对笔者的重要性是可想而知的，尤其是笔者工作中用的是oracle数据库，那么就着笔者的oracle环境，以及搜集各种资料，跟大家一起聊聊SQL语句吧。<br />
笔者的学习是毫无章法的，这里想到什么就写什么，而不是系统的去先学xxxx再学xxxx，所以，想到SQL语句，先不管那些内置函数什么的（用到再去查API就是了嘛 ←_←），先弄懂SQL语句本身，笔者感觉是更重要的。废话不多说，直接上大纲。

# 大纲
数据库水很深，今天笔者旨在和大家粗浅讨论SQL语句的情况（后期学深入之后再聊吧。←_←）。

## 定义
SQL语句就是一种用**SQL语言**写出来的句子。（←_←...说了一句废话。）他的存在就是用来与数据库交互的，因为数据库这个软件编译后，要让人使用它，必然会留出**接口**用来交流。那么，你需要说一种他认识的话，那就SQL语言了。<br />
SQL语言，就是Structured Query Language，即 结构化查询语言。

* 一些概念及情况

~~~
DCL【数据控制语言（DataBase Control Language）】
	1). GRANT【许可】 授权语句
		· 给角色或用户授权操作对象 = GRANT <操作1>, <操作2>, ... ON <对象1>, <对象2>, ... TO <角色1 | 用户1>, <角色2 | 用户2>, ...
		· 给角色或用户授权角色或权限 = GRANT <角色1 | 权限1>, <角色2 | 权限2>, ... TO <角色1 | 用户1>, <角色2 | 用户2>, ...
		· 给角色或用户授权角色或权限并且授予系统权限 = GRANT <角色1 | 权限1>, <角色2 | 权限2>, ... TO <角色1 | 用户1>, <角色2 | 用户2>, ... WITH ADMIN OPTION;
		· 给角色或用户授权角色或权限，并允许传递 = GRANT <角色1 | 权限1>, <角色2 | 权限2>, ... TO <角色1 | 用户1>, <角色2 | 用户2>, ... WITH GRANT OPTION;
		注：
		* 操作【INSERT | UPDATE | DELETE | RULE | ALL】
		* 权限【unlimited tablespace】
	2). REVOKE【撤销】 削权语句
		· 基本语法 = REVOKE <实体权限名 | ALL> ON <实体名> FROM <用户名 | 角色名>

DDL【数据定义语言（Data Definition Language）】
	1). CREATE【创建】
		- 基本结构 = CREATE TABLE <表名>
				(
					<列名1> <数据类型> <约束1>, <约束2>, ...
					<列名2> <数据类型> <约束1>, <约束2>, ...
					...
				)
		注：* 约束：PRIMARY KEY【主键】,
			   UNIQUE【唯一】,
			   NOT NULL【非空】,
			   CHECK【检查】,
			   FOREIGN KEY【外键】
	2). ALTER【改变】
		- 基本结构1 = ALTER TABLE <表名> ADD COLUMN <字段名> <数据类型> <约束>
		- 基本结构2 = ALTER TABLE <表名> ADD CONSTRAINT <约束名>
		- 基本结构3 = ALTER TABLE <表名> DROP COLUMN <字段名>
		- 基本结构4 = ALTER TABLE <表名> DROP CONSTRAINT <约束名>
		- 基本结构5 = ALTER TABLE <表名> MODIFY <字段名> <数据类型>
		- 基本结构6 = ALTER TABLE <表名> RENAME COLUMN <当前列名> TO <新列名>
		- 基本结构7 = ALTER <TABLE (表名) | INDEX (索引)> RENAME TO <新表名>

	3). DROP【放弃】
		- 基本结构1 = DROP USER <用户名> 【CASCADE】; -- 删除用户【及连带数据】
		- 基本结构2 = DROP INDEX <索引>;
		- 基本结构3 = DROP TABLE <表名>;

	4). TRUNCATE【截断, 清除表】
		- 基本结构 = TRUNCATE TABLE <表名>;

DQL【数据查询语言（Data Query Language）】
	基本结构 = SELECT <字段> + FROM <表或视图> + WHERE <查询条件>;

DML【数据操作语言（Data Manipulation Language）】
	1). 插入【INSERT】
		- 基本结构1 = INSERT INTO <表或某些视图> (字段1, 字段2, ...) VALUES (值1, 值2, ...)
		- 基本结构2 = INSERT INTO <表或某些视图> (select 字段1, 字段2, ... from <表或某些视图> where <查询条件>) VALUES (值1, 值2, ...) 【←_←...此写法好处不明，读者知道请告知哈，以后了解再解释。】
		- 基本结构3 = INSERT INTO <表或某些视图> (字段1, 字段2, ...) SELECT 字段1, 字段2, ... FROM <表或视图> WHERE <查询条件>
		- 基本结构4 = INSERT INTO <表或某些视图> SELECT 字段1, 字段2, ... FROM <表或视图> WHERE <查询条件>
		- 基本结构5 = INSERT ALL
				WHEN <条件1> THEN
				INTO <表或某些视图> values(字段1, 字段2, ...)
				WHEN <条件2> THEN
				INTO <表或某些视图> values(字段1, 字段2, ...)
				...
				SELECT 字段1, 字段2, ... FROM <表或某些视图> WHERE <查询条件>
	2). 更新【UPDATE】
		- 单表更新
			UPDATE <表或某些视图> SET 字段1 = 值1, 字段2 = 值2, ... WHERE <条件>
		- 多表关联更新
			· 传统方案【最慢】
				UPDATE <表或某些视图> a SET 字段1 =
				(SELECT b.字段1 FROM <表或某些视图> b WHERE b.字段2 = a.字段2)
				WHERE EXISTS
				(SELECT 1 FROM <表或某些视图> b.字段2 = a.字段2)
			· 更新中间视图【关联主键字段，速度较快】
				UPDATE (SELECT 字段1, 字段2 FROM <表或某些视图>) FROM <表明或某些视图> WHERE <条件>
			· MERGE更新法【关联字段非主键时，速度较快】
				MERGE INTO <表或某些视图> alias a
				USING (表|视图|子查询) alias b
				ON (<联合条件>)
				WHEN MATCHED THEN
				UPDATE
				SET 字段a1 = 值b1,
				字段a2 = 值b2
				WHEN NOT MATCHED THEN
				INSERT (字段a1, 字段a2, ...) VALUES (值b1, 值b2, ...)
			· 快速游标更新法【复杂逻辑时，效率很高】
				BEGIN
				FOR oITEM in (查询语句) LOOP  	-- 循环
				UPDATE <表或某些视图> SET ...   	-- 更新语句，可以取用 oITEM 的数据。
				WHERE ROWID = oITEM.ROWID 	-- 内置ROWID物理字段【不是ROWNUM】，快速定位。【选用】
				END LOOP;  			-- 结束循环
				END;
	3). 删除【DELETE】
		- DELETE FROM <表或某些视图> WHERE <条件>
		- TRUNCATE FROM <表或某些视图> WHERE <条件>
		注：
		   * DELETE 不释放空间，可以回滚。
		   * TRUNCATE 速度更快。

TCL【事务控制语言（Transaction Control Language）】
	1). SET TRANSACTION【设置事务】
		- 基本结构1 = SET TRANSACTION <参数>;
			注： * 参数说明：read only【只读】，read write【读写】，isolation level【隔离级别(serializable | read committed)】
		- 基本结构2 = SET TRANSACTION ISOLATION USE ROLLBACK SEGMENT <回滚段名>;
	2). COMMIT【提交】
		- 基本结构 = COMMIT; --【未提交的修改命令提交】
	3). SAVEPOINT【保存点】
		- 基本结构 = SAVEPOINT <保存点名>; --【在当前事务内部创建一个保存点】
	4). ROLLBACK【回滚】
		- 基本结构 = ROLLBACK  TO  SAVEPOINT  <保存点名>
~~~

* 记一些方便的系统表查询语句

~~~
select * from dba_roles;	--【查询数据库中所有角色】
select * from dba_users;	--【查询数据库中所有用户】
select * from dba_rules;	--【查询数据库中所有规则】
select * from dba_role_privs
 where grantee =
  UPPER(【用户名 | 角色名】);	--【查看具有的系统权限】
select * from user_tables;	--【查看当前用户的所有表的详细信息（表空间，表的储存空间）】
select * from tabs;		--【查看当前用户的所有表名】
select * from user_objects;	--【查看当前用户的数据库对象】
select * from user_constraints; --【查看当前用户的约束】
... 【select * from <user|all>_<英语单词>】(←_← 假装公式)
~~~

## 解析
掌握了基本概念，看下原理：<br />
在**ORACLE数据库**系统架构下，SQL语句由**用户进程**产生，然后传到相对应的**服务端进程**，之后由**服务器进程执行**该SQL语句，如果是SELECT语句，服务器进程还需要将执行结果回传给用户进程。
SQL语句的执行过程如下：<br />
~~~
→ PARSE【剖析】 → BIND【绑定】 → EXECUTE【执行】 → FETCH【提取(select才需要)】
服务端进程执行SQL语句步骤：
	STEP 1：检查共享池是否有过相同的SQL语句，有【软解析】，没有【硬解析】。
		注：* 软解析直接返回执行计划，跳到绑定或执行阶段。以下以硬解析为例。
	STEP 2： 语法分析，衡量规范。
	STEP 3： 语义分析，权限检查。
	STEP 4： 化繁为简。【(视图 | 表达式)的转换】。
	STEP 5： 择优执行计划。【多个，选最佳的】。
	STEP 6： 存入缓存库。【SQL文本 | 解析树 | 执行计划 | 地址 | 哈希值】

	# 执行过程：【SELECT例】
	  step 1：检查所需的数据库是否已经被读取到缓冲区缓存中。如果已经存在缓冲区缓存，则执行STEP3；
	  step 2：若所需的数据库并不在缓冲区缓存中，则服务器将数据块从数据文件读取到缓冲区缓存中；
	  step 3：对想要修改的表取得的数据行锁定（Row Exclusive Lock），之后对所需要修改的数据行取得独占锁；
	  step 4：将撤销数据的Redo记录复制到日志缓冲区，产生数据行的撤销数据，将数据行修改的Redo记录复制到日志缓冲区，修改数据行；
	  step 5：产生数据修改的撤销数据；
	  step 6：复制数据修改的Redo记录到日志缓冲区；
	  step 7：修改数据行的内容，如果之前的缓冲为干净缓冲，则此时将变为脏缓冲。
~~~


## 求知
事实上，有很多你可能正在学习的很酷的新事物，似乎每12.8秒就有一项新技术出现，那到底为什么你要花费空闲时间学习一门像SQL这样又老又臭的语言呢？让我告诉你我的理由。<br />
~~~
为什么学习SQL：
	 1. 可移植 【厂商的每个新版本都符合ANSI/ISO SQL标准】
	 2. 从不改变 【核心没变，能够依赖这些知识】
	 3. 易于性能增益 【框架工具通常良好，数据库性能增益明显】
	 4. 更好的开发者 【集合而非迭代的方式思考】
	 5. 增进团队间的交流 【需求明确】
	 6. 工作保障 【技能多样化，职位依靠】
	 7. SQL真的不那么难 【一部分精简的核心知识】
	 8. 理解什么时候不适合数据库 【你不要用锤子去挖沟渠】
	 9. 易扩展，方便开发。 【分层，容易扩展而不用再编译】
	10. 让故障排除更简单 【问题隔离，排除故障】
	11. 生态系统 【存在大量工具】
	12. 存储空间规划好 【预先定义的存储结构文件，比NOSQL存储空间占用少】
	...（←_← ...）
~~~

## 创意
没什么好的创意，随便想几个了，SQL语句可以用来：<br />
	1. 让项目更加细粒化，反正数据库用SQL型的，驱动的开发成本不高，项目多个语言编写，交互统一标准的数据库，多好 ... （←_←...随便脑补）


# 总结
SQL语句，就是用**SQL语言**写的句子，数据库内部可以识别它，它**历史悠久**，**工具文档多**，**学习成本低**。 SQL数据库相比NOSQL体现在系统较为明确，数据结构清晰精确的独立项目，扩展伸缩性不够出色，但是，业务上完善，有健壮的数据完整性。技术无所谓好坏，**合适就好**，NOSQL虽然有松散的数据结构，细粒度的Cache读写出色，适合社交网络大量不定的组织数据，大流量的场景。SQL有**高稳定性能**，**功能强大**，对于一些传统的项目更为适合，SQL语句的学习对于满足标准的SQL数据库**成本**大大降低。

<br />
↓
→ 简而言之，SQL语句就是**关系型数据库**统一**用****SQL语言**来**交流**的**句子**。


**（以上，仅代表个人观点。无论对错，欢迎交流。^_^ ）**

[wulian]: {{ "/2017-07-16-wulian.jpg" | prepend: site.imgrepo }}
