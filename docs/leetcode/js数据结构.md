本文专门为前端工程师准备, 从 javascript 出发分析数据结构与算法,栈,队列,链表,集合,字典,树,图,堆,以及对应的 leetcode 题的练习,后续将不断更新相关内容

# js 数据结构与算法(栈,队列,链表,集合,字典,树,图,堆)

## 栈

### 栈的简介

- 一个先进后出的数据结构
- js 中没有栈,可以用 Array 实现对栈的所有功能

![$zUGHvrxkNQi#TCpwMKq#g==.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b92996f82df4d82b5985d611161efcf~tplv-k3u1fbpfcp-watermark.image?)

```js
const stack = [];
// 进栈
stack.push(1);
stack.push(2);
// 出栈
const item1 = stack.pop();
const item2 = stack.pop();
```

### 什么时候用

1. js 中基本数据类型存储栈内存中
2. js 执行时有执行栈,事件循环中将以次执行执行栈中的回调

## 队列

### 队列简介

- 一个先进先出的数据结构
- js 中没有队列,但是可以用 Array 实现对队列的所有功能

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21ee59a42c28468fa4dadc647b3c31b2~tplv-k3u1fbpfcp-watermark.image?)
使用数组模拟先进先出的场景

```js
const queue = [];
// 进队列
queue.push(1);
queue.push(2);

// 出队列
const itme1 = queue.shift();
const itme2 = queue.shift();
```

### 什么时候用

1. 食堂排队打饭
2. 所有先进先出的场景
3. js 异步中的任务队列
   一个 leetcode 题 第 933 题

## 链表

### 链表是什么

- 多个元素组成的列表
- 匀速存储不连续, 用 next 指针连在一起

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d5fc10c10e74d798b4f8958599544aa~tplv-k3u1fbpfcp-watermark.image?)

### 数组 vs 链表

- 数组:增删非收尾元素是往往需要移动元素
- 链表:增删非收尾元素,不需要移动元素,只需要更改 next 指针即可

### js 中的链表

- js 没有链表的数据结构
- 可以用 Object 模拟链表

```js

const a = { val: 'a' }
const b = { val: 'b' }
const c = { val: 'c' }
const d = { val: 'd' }
a.next = b
b.next = c
c.next = d

// 遍历
let point = a
while (point) {
    console.log(point.val)
    point = point.next
}

// 插入
(c-d)中插入d

const e = {val:'e'}
c.next = e
e.next = d


// 删除 (删除e)
c.next = d
```

leetcode 练习:第 83 题-删除链表重复元素

```js
var deleteDuplicates = function (head) {
  // 定义链表的一个头部的指针
  let p = head;
  while (p && p.next) {
    if (p.val === p.next.val) {
      // 删除链表的一项
      p.next = p.next.next;
    } else {
      // 不相同的时候再移动指针
      p = p.next;
    }
  }
  return head;
};
```

- 前端原型链的链表[ JavaScript 一文搞定理解原型与原型链](https://juejin.cn/post/6991381838698643470)
  手写一个 instanceof

```js
function myInstanceof(A, B) {
  // 遍历链表
  let p = A;
  while (p) {
    p = p.__proto__;
    // B的 prototype 属性是否出现在A实例对象的原型链上
    if (p === B.prototype) {
      return true;
    }
  }
  return false;
}
function Foo() {}
var f = new Foo();
console.log(myInstanceof(f, Foo)); // true
console.log(myInstanceof(f, Object)); // true
```

## 集合

### 集合简介

- 一种无序且唯一的数据结构
- ES6 中有集合, 名为 Set
- 集合常用操作: 去重,判断某元素是否在集合中,求交集

```js
// 去重
const arr = [1,1,2,3,4,3]
const arr2 = [...new Set(arr)]

// 判断元素是否在集合中
let set = new Set(arr)

// add 方法
set.add(1)
set.add('text')
set.add({a:1,b:2})

// has方法
const has =set.has(3)

// delete方法
set.delete(1)

// 获取size 方法
console.log(set.size)
// 求交集
const set2 = new Set([2,3])
const set3 new Set([...set]).filter(item => set2.has(item))

// 求差集
const set2 = new Set([2,3])
const set4 = new Set([...set]).filter(item => !set2.has(item))

// 数组转为set
set2 = new Set([1,2,3])

// 迭代方法 fot ..of
for (let item of set) console.log(item)
for (let item of set.keys())) console.log(item)
for (let item of set.values()) console.log(item)
for (let item of set.entrise()) console.log(item)
```

补充说明迭代
**内置迭代器:**

可迭代的对象，都内置以下 3 种迭代器

entries(): 返回一个迭代器，值为键值对

values(): 返回一个迭代器, 值为集合的值

keys(): 返回一个迭代器，值为集合中的所有键

```js
let userList = ['ghostwu', '悟空', '八戒'];

for (let name of userList.entries()) {
  console.log(name);
}

let set = new Set([10, 20, 30]);
for (let num of set.entries()) {
  console.log(num);
}

let map = new Map([
  ['name', 'ghostwu'],
  ['age', 22],
]);
for (let detail of map.entries()) {
  console.log(detail);
}
```

![y2lP#f9L1r0ZWXu#82u90g==.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61d6d6c3da034e7590ed594375c96530~tplv-k3u1fbpfcp-watermark.image?)

## 字典

### 字典简介

- 与集合相似, 字典也是一种存储为一值的数据结构, 但他是以**键值对**的形式存储
- ES6 中有字典-->Map(映射)
- 常见操作 增(`set`) 删(`delete`) 改(`set`) 查(`get`)

```js
const m = new Map();

//增
m.set('a', 'aaa');

// 删
m.delete('a');
m.clear();

// 改
m.set('a', 'aaaaa');

// 查
m.get('a');
```

使用 Map 取两个数组的交集

```js
var intersection = function (nums1, nums2) {
  // new Set(nums1) 去重
  return [...new Set(nums1)].filter((item) => nums2.includes(item));
};
```

## 树

### 树简介

- 一种分层数据的抽象模型
- 前端工作中常见的树包括:DOM 树,级联选择,树形控件....
- js 中没有树,但是可以用 Array 和 Object 构建树
- 树的常用操作: 深度/广度优先遍历 , 先中后序遍历
  **几个概念**：
- 拥有相同父节点的节点,互称为兄弟节点
- 节点的深度: 从根节点到该节点所经历的边的个数
- 节点的高度: 节点到叶节点的最长路径

**注意点**：

- 仅有唯一一个根节点，没有节点则为空树
- 除根节点外，每个节点都有并仅有唯一一个父节点
- 节点间不能形成闭环

### 树的深度/广度优先遍历

- 深度优先遍历： 尽可能深的搜索树的分支:递归 1. 访问根节点 2. 对根节点的 children 挨个进行深度优先遍历
  ![impicture_20210925_155733.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abc4e44885bd4a509c2568767a07d23d~tplv-k3u1fbpfcp-watermark.image?)

```js
const tree = {
  val: 'a',
  children: [
    {
      val: 'b',
      children: [
        {
          val: 'd',
          children: [],
        },
        {
          val: 'e',
          children: [],
        },
      ],
    },
    {
      val: 'c',
      children: [
        {
          val: 'f',
          children: [],
        },
        {
          val: 'g',
          children: [],
        },
      ],
    },
  ],
};
const dfs = (root) => {
  console.log(root.val);
  root.children.forEach(dfs);
};

dfs(tree);
```

打印结果

![impicture_20210925_161217.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd06e351615e4b979efe8fadc878611b~tplv-k3u1fbpfcp-watermark.image?)

- 广度优先遍历:先访问离根节点最近的节点
  1. 新建一个队列, 把根节点入队
  2. 把对头出队并访问
  3. 把对头的 children 挨个入队
  4. 重复第二,第三,直到队列为空

![impicture_20210925_155839.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/194c8c44b9dd424e95873e8c92f0106d~tplv-k3u1fbpfcp-watermark.image?)

```js
const bfc = (root) => {
  const q = [root];
  while (q.length > 0) {
    const n = q.shift();
    console.log(n.val);
    n.children.forEach((child) => {
      q.push(child);
    });
  }
};
```

打印结果:

![impicture_20210925_162636.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/915eacdea7da43e0bdb5195951af6968~tplv-k3u1fbpfcp-watermark.image?)

### 二叉树的先中后序遍历(深度优先)

#### 二叉树是什么?

![impicture_20210925_162952.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f10b85255194cd9b82947bc6d0e7e7e~tplv-k3u1fbpfcp-watermark.image?)

- 树中每个节点最多只能有两个子节点

- 在 js 中通常用 Object 来模拟二叉树

```js
const binaryTree = {
  val: 1,
  left: {
    val: 2,
    left: null,
    right: null,
  },
  right: {
    val: 3,
    left: null,
    right: null,
  },
};
```

#### 先序遍历算法

1. 访问`根`节点
2. 对根节点的`左`子树进行先序遍历
3. 对根节点的`右`子树进行先序遍历

遍历顺序如图
![impicture_20210925_171603.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc6a26e4d8a44f988da02488266f52b7~tplv-k3u1fbpfcp-watermark.image?)

定义一棵树

```js
const binaryTree = {
  val: 1,
  left: {
    val: 2,
    left: {
      val: 4,
      left: null,
      right: null,
    },
    right: {
      val: 5,
      left: {
        val: 7,
        left: null,
        right: null,
      },
      right: null,
    },
  },
  right: {
    val: 3,
    left: null,
    right: {
      val: 6,
      left: null,
      right: null,
    },
  },
};
```

递归版:

```js
const preorder = (root) => {
  if (!root) return;
  console.log(root.val);
  preorder(root.left);
  preorder(root.right);
};
preorder(binaryTree);
```

非递归(栈特性):

```js
const preorder = (root) => {
  if (!root) return;
  const stack = [root];
  while (stack.length) {
    const n = stack.pop();
    console.log(n.val);
    n.right && stack.push(n.right);
    n.left && stack.push(n.left);
  }
};
preorder(binaryTree);
```

打印结果:

![impicture_20210925_192938.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9281bba41b1f47e8bdfc5d4f820c6e7e~tplv-k3u1fbpfcp-watermark.image?)

#### 中序遍历算法

1. 对根节点的`左`子树进行中序遍历
2. 访问`根`接节点
3. 对根节点的`右`子树进行中序遍历

遍历顺序如图
![impicture_20210925_191542.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8a5b5dab4aa46a1b6de60e397c7dbf5~tplv-k3u1fbpfcp-watermark.image?)

还是使用 binaryTree 这个树
递归版实现:

```js
const inorder = (root) => {
  if (!root) return;
  inorder(root.left);
  console.log(root.val);
  inorder(root.right);
};
inorder(binaryTree);
```

非递归版实现:

```js
const inorder = (root) => {
  if (!root) return;
  const stack = [];
  let p = root;
  while (stack.length || p) {
    while (p) {
      stack.push(p);
      p = p.left;
    }
    const n = stack.pop();
    console.log(n.val);
    p = n.right;
  }
};
inorder(binaryTree);
```

打印结果:

![impicture_20210925_193158.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28c48cd0cf4246b2ade5258932171f8d~tplv-k3u1fbpfcp-watermark.image?)

#### 后序遍历算法

1. 对根节点的`左`子树进行中序遍历
2. 对根节点的`右`子树进行中序遍历
3. 访问`根`接节点

![impicture_20210925_193507.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53416b15f1af41c0bae246a74662072a~tplv-k3u1fbpfcp-watermark.image?)

还是使用 binaryTree 这个树
递归版实现:

```js
const postorder = (root) => {
  if (!root) return;
  postorder(root.left);
  postorder(root.right);
  console.log(root.val);
};
postorder(binaryTree);
```

非递归版实现:

```js
const inorder = (root) => {
  if (!root) return;
  const outputStack = [];
  const stack = [root];
  while (stack.length) {
    const n = stack.pop();
    outputStack.push(n);
    if (n.left) stack.push(n.left);
    if (n.right) stack.push(n.right);
  }
  while (outputStack.length) {
    const n = outputStack.pop();
    console.log(n.val);
  }
};
inorder(binaryTree);
```

打印结果:

![impicture_20211011_101839.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a8e31dc481a4dc4b7ca819665a2089b~tplv-k3u1fbpfcp-watermark.image?)

### 前端与树

#### 遍历 JSON 的所有节点值

使用深度优先遍历

```js
const json = {
  a: { b: { c: 1 } },
  d: [1, 2],
};
// 深度优先遍历
const dfs = (n, path) => {
  console.log(n, path);
  Object.keys(n).forEach((k) => {
    dfs(n[k], path.concat(k));
  });
};
dfs(json, []);
```

打印结果

![8#N46LVi5WYavPpD0kJxEA==.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7659dcb5ed41445ea661c166d3e6933a~tplv-k3u1fbpfcp-watermark.image?)

## 图

### 图是什么

- 图是网络结构的抽象模型, 是一组由边连接的节点
- 图可以表示任何二元关系, 比如路,航班
- js 没有图, 可以用 Array Object 模拟

![eCbZ97wow3zli41Hgl62LA==.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3f7e9e0479340f1ac361a3fdfd158de~tplv-k3u1fbpfcp-watermark.image?)

### 图的表示法

#### 邻接矩阵

![Efua5ZlxkTcN1VY$4z3r1g==.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abf502aeb2c64b6f9546ace46da56db0~tplv-k3u1fbpfcp-watermark.image?)

![m3#LjYpWKEuLT8mWVYd#Lg==.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f455bd9eff7d415e936348a0c274ec7d~tplv-k3u1fbpfcp-watermark.image?)

#### 邻接表

![XVIV5XK$ps1xMTOcJCv9$Q==.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd1716b9714c438bb11456eba2db251f~tplv-k3u1fbpfcp-watermark.image?)

![yMJh03aIcxtiz2ymXyoyiA==.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/531a34c7a8764c1a90d453940a83fd8e~tplv-k3u1fbpfcp-watermark.image?)

### 图的遍历

- 深度优先遍历: 尽可能深的搜索图的分支

1. 访问根节点
2. 对根节点的`没访问过得相邻节点`挨个进行深度优先遍历

![7ThsFuwR4YTamHXonaJgZw==.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/716d98041a8e4bb391d39f4b16fc1556~tplv-k3u1fbpfcp-watermark.image?)
定义一个图

```js
const graph = {
  0: [1, 2],
  1: [2],
  2: [0, 3],
  3: [3],
};
```

使用深度优先遍历

```js
const visited = new Set();
const dfs = (n) => {
  console.log(n);
  visited.add(n);
  graph[n].forEach((c) => {
    if (!visited.has(c)) {
      dfs(c);
    }
  });
};
dfs(2);
```

打印结果

![impicture_20210928_192607.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34f4732e26584951b593457ee9c7941e~tplv-k3u1fbpfcp-watermark.image?)

- 广度优先遍历: 先访问离根节点最近的节点

1. 新建一个队列, 把根节点入队
2. 把队头出队并访问
3. 把队头的`没访问过得相邻节点`入队
4. 重复第二 三步, 直到队列为空

![impicture_20210928_192719.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10c1ebf243fc407aa73baaebcc81696b~tplv-k3u1fbpfcp-watermark.image?)

```js
const bfs = (node) => {
  const visited = new Set();
  visited.add(node);
  const q = [node];
  while (q.length) {
    const n = q.shift();
    console.log(n);
    graph[n].forEach((c) => {
      if (!visited.has(c)) {
        q.push(c);
        visited.add(c);
      }
    });
  }
};
bfs(2);
```

打印结果:

![impicture_20210928_195138.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bba5fcbfaeed4f3fbdaf1e7bf9bc9238~tplv-k3u1fbpfcp-watermark.image?)

## 堆

### 堆是什么

- 堆是一种特殊的`完全二叉树`
  完全二叉树如图:
  ![5SDCt6K6Cahj5FnPmtHr8w==.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06e429cc8cde481ea5cf331f743bcee1~tplv-k3u1fbpfcp-watermark.image?)

- 所有的节点都大于等于(最大堆)或小于等于(最小堆)他的节点
- js 中通常用数组表述堆
- 左侧子节点的位置是`2 * index + 1`
- 右侧子节点的位置是`2 * index + 2`
- 父节点的位置是`(index - 1) / 2`

![rxkochTNbMbEkci4KeUmLQ==.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b73b1d1b281c4681944e0626c3be1358~tplv-k3u1fbpfcp-watermark.image?)

### 堆的应用

- 对能高效快速地找出最大值和最小值, 时间复杂度:O(1)
- 找出第 K 个最大(小)元素

#### 第 K 个最大元素

1. 构建一个最小堆, 并将元素依次插入堆中
2. 当堆的容量超过 K, 就是删除堆顶
3. 插入结束后, 堆顶就是第 K 个最大元素

#### js 实现最小堆类

- 构建一个类

1. 在类里, 声明一个数组, 用来装元素
2. 主要方法: 插入, 删除堆顶, 获取堆顶, 获取堆大小

- 插入

1. 将值插入堆的底部,即数组的尾部
2. 然后上移: 将这个值和它的防父节点进行交换, 直到父节点小于等于这个插入的值
3. 大小为 k 的堆中插入元素的时间复杂度为 O(logk)

- 删除堆顶

1. 用数组尾部元素替换堆顶(直接删除堆顶会破坏堆结构)
2. 然后下移: 将新堆顶和它的子节点进行交换, 直到子节点大于等于这个新堆顶
3. 大小为 k 的堆中删除堆顶得时间复杂度为 O(logk)
