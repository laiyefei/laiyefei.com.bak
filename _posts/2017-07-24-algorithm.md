---
layout: post
title: 基本功之算法的修炼（一） 【B-树】
tags: 基础 算法
categories: 数学
---

* TOC
{:toc}

# 序言
有一个众人皆知的公式：<br />
~~~
程序 = 数据结构 + 算法
~~~
足以见得，对于一个程序来说，算法的地位是相当重要的。高手过招，往往一招见胜负，一个好的算法，不仅体现出高手的气质，更能展现逼格。我的理解是算法就相当于应用数学，显然，学好算法，不仅能锻炼逻辑思维，而且很实用。那么，《基本功之算法修炼》系列，旨在笔者学习记录一些笔记，将来也好翻阅，学习。

# 大纲
今天，聊的是B-树，其实这就是B树【笔者之前也念“B减树”，还好纠正了，差点丢人现眼。】。

## 定义
B-tree 即 B-树，就是B树，很多人翻译的时候，保留了-，看到-不要潜意识以为是减号【← _ ← 虽然，笔者潜意识也是看成减号，赶紧纠正，赶紧纠正...】。B 就是balance的意思，就是平衡树。<br />
B-树是一种多路搜索树【不一定是二叉树】。**1970** 年，R.Bayer和E.mccreight提出了一种适用于外查找的树，他是一种平衡多叉树，称为B树【或者B-树，B_树】，一棵m阶B树【balanced tree of order m】是一棵平衡的m路搜索树。那么，什么是平衡树呢？**平衡树** 是一类数据结构，一类改进的二叉查找树。一般的二叉查找树的查询复杂度是跟目标结点到树根的距离（即**深度**）有关，因此当结点的深度普遍较大时，查询的均摊复杂度会上升，为了更高效的查询，平衡树应运而生了。在这里，平衡指所有叶子的**深度趋于平衡**，更广义的是指在树上所有可能查找的**均摊复杂度偏低**。<br/>
B树（英语：B-tree）是一种自平衡的树，能够保持数据有序。这种数据结构能够让查找数据、顺序访问、插入数据及删除的动作，都在对数时间内完成。B树为系统大块数据的读写操作做了优化。B树减少定位记录时所经历的中间过程，从而加快存取速度。B树这种数据结构可以用来描述外部存储。这种数据结构常被应用在数据库和文件系统的实现上。

## 解析

### 整体解说

那么，B树有什么特征呢？一棵m阶B树，或者是一颗**空树**，或者**满足以下条件**：<br/>
1. 根节点至少有两个子女。<br/>
2. 每个非根节点有[M/2, M]个孩子。<br />
3. 每个非根节点有[(M/2)-1, M-1]个关键字，并且以升序排序。<br/>
4. key[i] 和 key[i+1]之间的孩子节点的值介于两者之间。<br/>
5. 所有叶子节点在同一层。<br/>

**B树** 是一棵 **向上生长** 的树，当一个节点的关键字个数达到上限后，就会进行分裂，同时**向上**产生一个新节点，**分裂** 得到两个子节点和一个父节点。父节点只有原来中间的一个key值，两个子节点平分原来剩下的key和孩子，使得条件满足上面的2～5。说得很抽象，直接上图：<br/>
![B树的分裂原理][BTree]<br />

另外 **B树** 与二叉树和红黑树一样，将卫星数据和关键字都存放在同一个结点中，其中：<Br/>
1. 每个节点的属性
  1). x.n: 每个节点包含关键字的个数；
  2). x.key1, x.key2,...x.keyn 以升序排列
  3). x.leaf 表示x节点是否叶子节点
  4). x.ci: 每个节点还包含x的n+1个孩子的指针x.c1, x.c2, x.c3...x.cn+1
2. x中的关键字对存储在各子树中的关键字范围加以分割。
3. 每个叶子节点具有相同的高度，为树的高度。
4. 我们可以为每课B树规定一个最小度树：T，那么每个节点所包含的关键字个数的范围：T-1 ～ 2T-1，所包含的孩子节点个数为T～2T。当结点关键字个数为2T-1时，该节点满。（根节点至少包含一个关键字，而其他节点至少包含T-1个关键字。）
5. B树的高度： **h <= logt(n + 1) / 2** ;

笔者更喜欢关注代码的实现，以下是c++的实现方式：
~~~
template <typename K, int M>
struct BTreeNode{
  K _key[M]; //关键字数组
  BTreeNode<K, M>* _sub[M + 1]; //指向孩子节点的指针数组
  BTreeNode<K, M>* _parent; //指向父节点的指针
  size_t _size; //该节点中已经插入的关键字的个数
  BTreeNode()
      :_parent(NULL)
      ,_size(0){
        size_t i = 0;
        for(i = 0; i < M; i++){
          _key[i] = K();
          _sub[i] = NULL;
        }
        _sub[i] = NULL;
      }
}
~~~

* 示例【B树的构造过程，插入6 10 4 14 5 11 15 3 2 12 1 7 8 8 6 3 6 21 5 15 15 6 32 23 45 65 7 8 6 5 4】：<br />
![B树的构造过程][BTreeBuild]

### 基本操作
直接上代码，简单明了：
1. 查询
~~~
i =1  
while i<=x.n and k> x.keyi  
   i++  
if i<=x.n and k = keyi  
  return (x,i)  
if x.leaf  
  return NULL  
else  
   Disk_Read(x,ci) //读取x的第i个孩子  
   return B_Tree_Search(x.ci, k)  
~~~

2. 插入
~~~
//TODO...
//在B_Tree中加入新的关键字，主要由BTree_Insert_NonFull来实现，确保每次插入时所访问的结点都是非满结点;  
//首先，若根结点为满，则分裂根结点  
void BTree_Insert_Node(p_B_Tree_Node *root,int k)  
{  
    B_Tree_Node *p = *root;  
    if(p->n == 2*T - 1) //如果根结点满  
    {  
        B_Tree_Node *newRoot =alloact_Node();  
        newRoot->child[0] = (*root);  
        newRoot->isLeaf = false;  
        *root = newRoot;  

        BTree_Child_Split(newRoot,0);  
        BTree_Insert_NonFull(newRoot,k);  
    }  
    else   
        BTree_Insert_NonFull(*root,k);  
}  
//TODO...
~~~

3. 删除

~~~

//TODO...

//delete  
/*
subNode,当前结点，以它为根的树中删除k
1.看k是否存在于以subNode为根的子树中，不存在则返回；存在则继续
2.看k是否存在于当前结点：（1）存在且该节点为叶子节点，则直接删除k;(2)存在且该节点为内部节点，分情况讨论；（3）不存在，则找出以它的孩子x.ci为根的子树中包含k,
Different Case:
1.存在于当前结点，且该结点为内部结点：
case 1:该结点中前于k的子结点y中有至少包含T个元素，则找出k'替换k,并递归地删除k';
case 2:该结点中前于k的子结点z中有只包含T-1个元素，但大于k的子结点中有至少包含T个元素，同上找出k'替换k,递归地删除k';
case 3：以上两个子结点均只包含T-1个元素，那么将k与z子结点中的元素均归并到y中。再递归删除k
2.k不存在于当前的结点中,存在于以它的孩子x.ci为根的子树中。
case 1:若x.ci中至少包含有T个元素，递归找删除k
case 2:若x.ci中只有T-1个元素，而x.ci-1或x.ci+1中至少有T个元素，刚将x中合适的元素取出来给x.ci,x.ci-1或x.ci+1中合适的元素取出来给x,递归删除k
case 3：若x.ci-1和x.ci+1中均只有T-1个元素，那么将x.ci-1与x.ci合并，或另外两个合并，并将x中合适的元素作为它们的中间关键字。
*/  
void BTree_delete_key(B_Tree_Node *subNode, int k)  
{  
    int index = 0;  
    B_Tree_Node *deleteNode = NULL;  
    if((deleteNode = searchNode(subNode,k,index)) == NULL)  
        return;  
    int keyIndex = -1;  
    for(int i=0;i<subNode->n;i++)  
    {  
        if(k == subNode->keys[i])  
        {  
            keyIndex = i;  
            break;  
        }  
    }  
     //如果在当前结点，且当前结点为叶子结点，则直接删除k  
    //OK******************************  
    if(keyIndex != -1 && subNode->isLeaf)  
    {  
        for(int i=keyIndex;i<subNode->n-1;i++)  
        {  
            subNode->keys[i] = subNode->keys[i+1];  
        }  
        (subNode->n)--;  
    }  
    //如果在当前结点中，且当前结点不为叶子结点  
    else if(keyIndex != -1 && subNode->isLeaf!= true)  
    {  
        B_Tree_Node *processorNode = subNode->child[keyIndex];  
        B_Tree_Node *succssorNode = subNode->child[keyIndex+1];  
        //如果小于k的孩子结点关键字数大于T  
        if(processorNode->n >= T)  
        {  
            int k1 = processorNode->keys[processorNode->n-1];  
            subNode->keys[keyIndex] = k1;  
            BTree_delete_key(processorNode,k1);  
        }  
        //如果大于k的孩子结点关键字数大于T  
        else if(succssorNode->n >=T)  
        {  
            int k1 = succssorNode->keys[0];  
            subNode->keys[keyIndex] = k1;  
            BTree_delete_key(succssorNode,k1);  
        }  
        //如果两个孩子结点关键字数均不大于T,则将k与右孩子结点的关键字归并到左孩子中  
        else  
        {  
            for(int j=0;j<T-1;j++)  
            {  
                //processorNode->keys[T-1] = k;这里最好不要使用T表示，因为如果是根结点的话，可能它的关键字数不为T  
                processorNode->keys[processorNode->n] = k;  
                processorNode->keys[processorNode->n+1+j] = succssorNode->keys[j];  
            }  

            processorNode->n = 2*T -1 ;  
            //将subNode->child[keyIndex+1]的孩子传给左邻孩子  
            if(!processorNode->isLeaf)  
            {  
                for(int j=0;j<T;j++)  
                {  
                    processorNode->child[T+j] = succssorNode->child[j];  
                }  
            }  
            //修改subNode中的key值  
            for(int j = keyIndex;j<subNode->n-1;j++)  
            {  
                subNode->keys[j] = subNode->keys[j+1];  
            }  
            subNode->n = subNode->n - 1;  
            delete succssorNode;  
            BTree_delete_key(processorNode,k);  


        }  

    }  
    else if(keyIndex == -1) //不在当前结点中  
    {  
        int childIndex = 0;  
        B_Tree_Node *deleteNode = NULL;  
        //寻找合适的子孩子，以该子孩子为根的树包含k  
        for(int j = 0;j<subNode->n;j++)  
        {  
            if(k<subNode->keys[j])  
            {  
                childIndex = j;  
                deleteNode = subNode->child[j];  
                break;  
            }  
        }  
        //如果该子孩子的关键字数小于T,考虑那两种情况  
        if(deleteNode->n <= T-1)  
        {  
            //deleteNode的左兄弟结点  
            B_Tree_Node *LeftNode = subNode->child[childIndex-1];  
            //deleteNode的右兄弟结点  
            B_Tree_Node *RightNode = subNode->child[childIndex+1];  
            //如果左兄弟结点关键字数大于T,将父结点中的第childIndex-1个元素送给deleteNode,将Left中的最大元素送给父结点，  
            if(childIndex>=1 && LeftNode->n >= T)  
            {  
                for(int i = deleteNode->n;i>0;i--)  
                {  
                    deleteNode->keys[i] = deleteNode->keys[i-1];  
                }  
                deleteNode->keys[0] = subNode->keys[childIndex];  
                subNode->keys[childIndex] = LeftNode->keys[LeftNode->n - 1];  
                (LeftNode->n)--;  
                (deleteNode->n)++;  
                BTree_delete_key(deleteNode,k);  
            }  
            //如果右兄弟关键字大于T,将父结点中的第childIndex个元素送给deleteNode,将Right中的最小元素送给父结点，  
            else if(childIndex<subNode->n && RightNode->n >= T)  
            {  
                deleteNode->keys[deleteNode->n] = subNode->keys[childIndex];  
                subNode->keys[childIndex] = RightNode->keys[0];  
                for(int i=0;i<RightNode->n-1;i++)  
                    RightNode[i] = RightNode[i+1];  
                (RightNode->n)--;  
                (deleteNode->n)++;  
                BTree_delete_key(deleteNode,k);  
            }  
            //如果左兄弟和右兄弟的关键字数均不在于T,则将左兄弟或右兄弟与其合并  
            else   
            {  
                if(childIndex>=1)//左兄弟存在，合并  
                {  
                    //将keys合并  
                    for(int i=0;i<deleteNode->n;i++)  
                    {  
                        LeftNode->keys[LeftNode->n+i] = deleteNode->keys[i];  
                    }  
                    //如果非叶子结点，则将叶子也合并  
                    if(!deleteNode->isLeaf)  
                    {  
                        for(int i=0;i<deleteNode->n+1;i++)  
                        {  
                            LeftNode->child[LeftNode->n+1+i] = deleteNode->child[i];  
                        }  

                    }  
                    LeftNode->n = LeftNode->n + deleteNode->n;  

                    //调整subNode的子节点  
                    for(int i = childIndex;i<subNode->n;i++)  
                    {  
                        subNode->child[i] = subNode->child[i+1];  
                    }  
                    BTree_delete_key(LeftNode,k);  
                }  
                else //合并它和右兄弟  
                {  
                    //将keys合并  
                    for(int i=0;i<RightNode->n;i++)  
                    {  
                        deleteNode->keys[i+deleteNode->n] = RightNode->keys[i];  
                    }  
                    //如果非叶子结点，则将叶子合并  
                    if(!deleteNode->isLeaf)  
                    {  
                        for(int i = 0;i<RightNode->n+1;i++)  
                        {  
                            deleteNode->child[deleteNode->n + 1 + i] = RightNode->child[i];  
                        }  
                    }  
                    deleteNode->n = deleteNode->n + RightNode->n;  

                    //调整subNode的子节点  
                    for(int i = childIndex+1;i<subNode->n;i++)  
                    {  
                        subNode->child[i] = subNode->child[i+1];  
                    }  
                    BTree_delete_key(deleteNode,k);  
                }  
            }  

        }  
        BTree_delete_key(deleteNode,k);  
    }  
}  
//TODO...
~~~


## 求知
B树，是减少为了对磁盘的操作，上面看到当我们插入多个节点，它会进行多次的分裂，但当我们把M放到很大，那么它的高度就会成M的指数下降。
当 M=1024 的时候，三层可以容纳10亿个结点，换句话说，10亿结点我们只需要查找三次，对于每个节点中的key值，因为是有序的，采用二分查找不过10次，因此，在查找速度上是非常快的，也就减少了访问磁盘的次数。

## 创意
对B树的应用，主要都体现在B树的变形上的应用，这也是大多数数据库设计的底层实现。
* Windows：HPFS文件系统
* Mac：HFS，HFS+文件系统
* Linux：ResiserFS，XFS，Ext3FS，JFS文件系统
* 数据库：ORACLE，MYSQL，SQLSERVER等中

# 总结
本文介绍了文件系统和数据库系统中常用的B树，他通过对每个节点存储个数的扩展，使得对连续的数据能够进行较快的定位和访问，能够有效减少查找时间，提高存储的空间局部性从而减少IO操作。他广泛用于文件系统及数据库中。<br /
笔者认为，因为这种树维持着某些规则，那么树的改变时候，一些操作就在当时完成了，保持这种规律，前面多做一点工作，这样之后的操作中，必然降低了复杂度。

<br />
↓
→ 简而言之，**B树** 就是一种 **深度较低**，**多路查找** 的用来 **降低磁盘IO** 的 **树形数据结构**。


**（以上，仅代表个人观点。无论对错，欢迎交流。^_^ ）**




[BTree]:{{ "/2017-07-24-BTree.png" | prepend: site.imgrepo }}
[BTreeBuild]: {{ "/2017-07-24-BTreeBuild.gif" | prepend: site.imgrepo }}
