---
layout: detail
title: 初探ELK
tags: 数据库 NoSQL java
categories: 运维
date: 2018-06-20
---

* TOC
{:toc}

# 序言
好久没写文章，写一篇文章，方便查找资料，运维部署吧（^ _ ^）。

笔者最近项目中在用ELK，那就写一些ELK的相关部署和记录一些指令吧。

# 大纲


## 部署

* linux【以CentOs7.3为例】【以5.2.2版本为例】

~~~
1. 部署 java 环境【jdk1.8+】
2. 下载 elasticsearch
	[cd <你的下载目录>]
	[wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.2.2.tar.gz]
3. 解压
	[tar -zxvf elasticsearch-5.2.2.tar.gz -C <你的目标目录>]
4. 修改系统相关文件
	1). vi /etc/sysctl.conf
		-> 添加内容
		fs.file-max=65536
		vm.max_map_count=262144
	   	-> sysctl -a[查看] -p[刷新]
	2). vi /etc/security/limits.conf
	    -> 添加内容
		*  soft  nofile  65536
		*  hard  nofile  131072
		*  soft  nproc   2048
		*  hard  nproc   4096
	3). vi /etc/security/limits.d/20-nproc.conf
		-> 修改
		* soft nproc 2048
5. 修改 elasticsearch 配置文件
	设置 
		cluster.name: <集群名称>
		node.name: <节点名称>
		path.data: <数据存放路径>
		path.logs: <日志存放路径>
		network.host: <ip地址>
6. 启动 ES 【测试】
	[cd <es路径>/elasticsearch-5.2.2/bin]
	[./elasticsearch -d]
7. 关闭 ES 【测试】
	[ps -ef | grep elastic]【查找PId】
	[kill -9 <PId>]
8. 下载 kibana
	[cd <你的下载目录>]
	[wget https://www.elastic.co/downloads/kibana]
9. 解压
	[tar -zxvf kibana-5.2.2-linux-x86_64.tar.gz -C <你的目标目录>]
10. 修改 kibana 配置文件
	[vi <你的目标目录>/config/kibana.yml]
		server.port: <端口>
		server.host: <ip地址>
		elasticsearch.url: <http://ip:端口>【部署的elasticsearch】
11. 安装 x-pack
	elasticsearch: <目标地址>/bin/elasticsearch-plugin install x-pack
	kibana: <目标地址>/bin/kibana-plugin install x-pack
12. 启动kibana
	1). 禁用 x-pack 插件 security
	2). 启动 es
	3). 启动 kibana
13. 下载logstash
14. 解压 tar -zxvf logstash.tar.gz -C <目标目录>
15. 启动logstash
	<目标目录>/bin/logstash -rf <目标目录>/config/production/search.config >> <配置的日志保存路径>/search-`date + %Y-%m-%d`.log 2 > &1 &
~~~

* windows【以5.2.0版本为例】

~~~
1. 部署java环境【jdk1.8+】
2. 下载elasticsearch 【https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.2.0.zip】
3. 安装 x-pack
	1). cd <存放地址>\elasticsearch-5.2.0\bin
	2). elasticsearch-service.bat install
4. 下载logstash 【https://artifacts.elastic.co/downloads/logstash/logstash-5.2.0.zip】
5. 下载kibana 【https://artifacts.elastic.co/downloads/kibana/kibana-5.2.0-windows-x86.zip】
6. 下载nssm 【https://nssm.cc/release/nssm-2.24.zip】 
	1). 解压nssm-2.24.zip 放在 logstash 中 bin 目录下
	2). 解压nssm-2.24.zip 放在 kibana 中 bin 目录下
7. 在 logstash 中 bin 目录下新建 run.bat 内容为 【logstash.bat -f ../config/logstash.conf】
8. cmd 进入 logstash 中 bin 目录下运行 [nssm install logstash]【出现窗口】
	1). Application
		选择Path: <logstash目录>\bin\run.bat
		选择Startup directory: <logstash目录>\bin
	2). Details
		输入Display name: logstash
	3). Dependencies
		输入elasticsearch-service-x64
	4). 点击 Install service
9. kibana.yml 文件修改
	注释掉以下两行
		elasticsearch.username: "elastic"
		elasticsearch.password: "changeme"
10. cmd 进入 kibana 中 bin 目录下运行 [nssm install kibana]【出现窗口】
	1). Application
		选择Path: <kibana目录>\bin\kibana.bat
		选择Startup directory: <kibana目录>\bin
	2). Details
		输入Display name: kibana
	3). Dependencies
		输入elasticsearch-service-x64
		输入logstash
	4). 点击 Install service
11. 启动kibana服务，依赖会启
~~~

## 定义

~~~
ELK = Elasticsearch + Logstash + Kibana
====================================================================================
Elasticsearch: 一个NoSQL数据库。
Logstash: 一个日志分析工具。
Kibana: 一个展示工具，用户操作界面。
~~~

## 描述

### elasticsearch 与 关系型数据库 概念对应

~~~
	名 称	   |	概 念	|	概 念	|	概 念	|	概 念	|
===================================================================================
 关系型数据库   |  DataBases	|	Tables	|	Rows	|	Columns	|
-----------------------------------------------------------------------------------
 ElasticSearch |  Indices   |	Types	| Documents |	Fields	|
-----------------------------------------------------------------------------------
~~~ 

### elasticsearch 操作语法
 
~~~
1.健康状况查询
	语法
		GET /_cluster/health
	返回值
		{
		   "cluster_name":          "elasticsearch",
		   "status":                "green", 
		   "timed_out":             false,
		   "number_of_nodes":       1,
		   "number_of_data_nodes":  1,
		   "active_primary_shards": 0,
		   "active_shards":         0,
		   "relocating_shards":     0,
		   "initializing_shards":   0,
		   "unassigned_shards":     0
		}
	说明
		* status 【字段指示着当前集群在总体上是否工作正常。它的三种颜色含义如下】：
			-> green 【所有的主分片和副本分片都正常运行。】
			-> yellow 【所有的主分片都正常运行，但不是所有的副本分片都正常运行。】	
			-> red 【有主分片没能正常运行。】
2.获取数据类型
	语法
		GET /{index}/_mapping/{type}
	返回值
		{
	  		"{index}": {
	    		"mappings": {
	      			"{type}": {
	        			"properties": {
	          				"字段名": {
	            				"type": "数据类型"
	          				},
	          				...
	          			}
	          		}
	          	}
          	}
      	}
3.查询
	1). 获取indices所有文档
		语法
			查询所有
				GET /_search
				{}
			*分页查询
			 	GET /_search
			 	{
			 		"from": 30,
		  	 		"size": 10
			 	}
	2). 获取具体indices的内容
		语法 
			查询所有
				GET /{index}/_search
				{}
	3). 获取具体indices中type为某个具体值的内容
		语法
			查询所有
				GET /{index}/{type}/_search
				{}
	4). 常见查询条件
		4.1). bool查询
			语法
				GET /{index}/{type}/_search
				{
					//...
					"query" : {
						"bool" : {
							"must" : {
								"term" : {
									"{key}" ： "{value}"
								},
								"terms" : {
									"{key1}" : "{value1}",
									"{key2}" : "{value2}",
									"{key3}" : "{value3}",
									...
								}
							},
							"filter" : {
								"term" : {
									"{key}" ： "{value}"
								},
								"terms" : {
									"{key1}" : "{value1}",
									"{key2}" : "{value2}",
									"{key3}" : "{value3}",
									...
								}
							},
							"must_not" : {
								"term" : {
									"{key}" ： "{value}"
								},
								"terms" : {
									"{key1}" : "{value1}",
									"{key2}" : "{value2}",
									"{key3}" : "{value3}",
									...
								}
							},
							"should" : {
								"term" : {
									"{key}" ： "{value}"
								},
								"terms" : {
									"{key1}" : "{value1}",
									"{key2}" : "{value2}",
									"{key3}" : "{value3}",
									...
								}
							},
							"filter": {
					          "range": { "{key}": { "gte": "{value}" }} 
					        }
						}
					}
					//...
				}

		4.2). constant_score 查询[恒定分数查询]	
			语法
				GET /{index}/{type}/_search
				{
					//...
					"query" : {
			 "constant_score" : {
							"must" : {
								"term" : {
									"{key}" ： "{value}"
								},
								"terms" : {
									"{key1}" : "{value1}",
									"{key2}" : "{value2}",
									"{key3}" : "{value3}",
									...
								},
								"range" : {
									"{key}" : {
									  "from" : {value1},
									  "to" : {value2},
									  "include_lower" : true,
									  "include_upper" : true,
									  "boost" : 1.0
									}
								}
								//...
							},
							"filter" : {
								"term" : {
									"{key}" ： "{value}"
								},
								"terms" : {
									"{key1}" : "{value1}",
									"{key2}" : "{value2}",
									"{key3}" : "{value3}",
									...
								}
							},
							"must_not" : {
								"term" : {
									"{key}" ： "{value}"
								},
								"terms" : {
									"{key1}" : "{value1}",
									"{key2}" : "{value2}",
									"{key3}" : "{value3}",
									...
								}
							},
							"should" : {
								"term" : {
									"{key}" ： "{value}"
								},
								"terms" : {
									"{key1}" : "{value1}",
									"{key2}" : "{value2}",
									"{key3}" : "{value3}",
									...
								}
							},
							"filter": {
					          "range": { "{key}": { "gte": "{value}" }} 
					        }
						}
					}
					//...
				}
	   4.3). 按字段排序查询
	   		语法
				GET /{index}/{type}/_search
				{
					"query" : {
						//...
					},
					"sort" : {
						"{key}" : { 
							"order": "desc",
        					"mode" :  "min" //min, max, avg, sum 
						}
					}

				}	

	   4.4). 多层聚合查询
	   		语法
	   			GET {index}/{type}/_search
				{
				  "query" : {
				  	//...
				  },
				  "aggs" : {
				    "{showField1}" : {
				      "terms" : {
				        "field" : "{key}",
				        "size" : 2147483647,
				        "min_doc_count" : 1,
				        "shard_min_doc_count" : 0,
				        "show_term_doc_count_error" : false,
				        "order" : [
				          {
				            "{key1}" : "desc"
				          },
				          {
				            "{key2}" : "asc"
				          }
				        ]
				      },
				      "aggs" : {
				        "{showField2}" : {
				          "terms" : {
				            "field" : "{key}",
				            "size" : 2147483647,
				            "min_doc_count" : 1,
				            "shard_min_doc_count" : 0,
				            "show_term_doc_count_error" : false,
				            "order" : [
				              {
				                "{key1}" : "desc"
				              },
				              {
				                "{key2}" : "asc"
				              }
				            ]
				          },
				          "aggs" : {
				            "{showField3}" : {
				              "terms" : {
				                "field" : "{key}",
				                "size" : 2,
				                "min_doc_count" : 1,
				                "shard_min_doc_count" : 0,
				                "show_term_doc_count_error" : false,
				                "order" : [
				                  {
				                    "{key1}" : "desc"
				                  },
				                  {
				                    "{key2}" : "asc"
				                  }
				                ]
				              }
				            },
				            //...
				          }
				        }
				      }
				    }
				  }
				}
~~~



# 总结
本文仅仅记录日常使用的语法，以及笔者安装过程中的记录，es 初探。




**（以上，仅代表个人观点。无论对错，欢迎交流。^_^ ）**
