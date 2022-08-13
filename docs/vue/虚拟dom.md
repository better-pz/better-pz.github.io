# 虚拟 dom 和 diff 算法

# 什么是虚拟 DOM

是 js 按照 DOM 的结构来创建的虚拟树形结构对象, 是对 DOM 的抽象, 比 Dom 更加轻量型
比如正式的 DOM 是这样的

```js
<div class="container">
  <p>哈哈</p>
  <ul class="list">
    <li>1</li>
    <li>2</li>
  </ul>
</div>
```

如果用对应的虚拟 DOM 表示

```js
{
  // 选择器
  "sel": "div",
  // 数据
  "data": {
    "class": { "container": true }
  },
  // DOM
  "elm": undefined,
  // 和 Vue :key 一样是一种优化
  "key": undefined,
  // 子节点
  "children": [
    {
      "elm": undefined,
      "key": undefined,
      "sel": "p",
      "data": { "text": "哈哈" }
    },
    {
      "elm": undefined,
      "key": undefined,
      "sel": "ul",
      "data": {
        "class": { "list": true }
      },
      "children": [
        {
          "elm": undefined,
          "key": undefined,
          "sel": "li",
          "data": {
            "text": "1"
          },
          "children": undefined
        },
        {
          "elm": undefined,
          "key": undefined,
          "sel": "li",
          "data": {
            "text": "1"
          },
          "children": undefined
        }
      ]
    }
  ]
}
```

# 虚拟 dom 的好处

- 性能优化避免频繁的操作 DOM.频繁操作 DOM 会造成重绘和重排,性能也会非常低
- 并不是所有情况下使用虚拟 DOM 都提供性能,是针对在复杂项目中使用,如果简单操作使用虚拟 DOM,要创建虚拟 DOM,在数据修改后要先更新虚拟 DOM 然后再渲染成真实 DOM,这个过程还是有些复杂的,所以
- 可以实现跨平台渲染,服务端渲染,小程序,原生应用都使用了虚拟 DOM
- 虚拟 DOM 可以维护程序的状态,跟踪上一次的状态
- 使用虚拟 DOM 改变了当前的状态不需要立即的去更新 DOM,而且更新的内容进行更新,对于没有改变的内容不做任何操作,通过前后两次差异进行比较

# diff 算法

![$qIA9IGqL8RWxu8nDrMVFQ==.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2625c0198dc4684999d33d146432124~tplv-k3u1fbpfcp-watermark.image?)
**diff 算法是一个精细化比较算法**,将旧虚拟 DOM 和新虚拟 DOM 进行对比,对比出哪个虚拟节点更改了,找出了这个虚拟节点,并只更新这个虚拟节点所对应的真实节点,而不用更新其他数据数据没有发生改变的节点,实现精准地更新真实 DOM,进而提高效率.

使用 diff 算法进行比较新老虚拟 dom

## 只比较同一层级,不跨级比较

即使是同一片虚拟节点,但是跨层了,那就删除旧的节点插入新的

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a1d7d54f42c453d8e7ca09e7718a72e~tplv-k3u1fbpfcp-watermark.image?)

## 只有是同一个虚拟节点,才进行精细化比较

判断端选择器相同且 key 相同的时候才进行精细化比较,否则就是暴力删除旧的插入新的

## 比较标签名

标签名不同,直接删除,不继续深度比较
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fc6b71c2f9f4e069f878e816ac66f97~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

## 比较 key

标签名相同,key 相同,就认为是相同节点不继续深度比较,比如我们在写 v-for 的时候会比较 key,不写 key 就会报错,就是 diff 算法需要比较 key

**key 的作用**
比如有一个列表,我们需要在其中插入一个元素

如果不使用 key 或者使用的 key 是数组的 index 的话,整个元素列表的在插入元素后列表得 key 发生了变化,在比较 key 之后发生变化的 key 的节点会重新渲染,如果使用的是 key 是绑定的唯一值的情况就不会出现这种情况

**总结**

- key 的作用主要是为了更高效的 DOM,因为它可以非常精准的找到相同的节点,因此在 patch 过程会非常高效
- Vue 字啊 patch 过程中会哦按段两个节点是不是相同的节点,key 是一个必要条件,如果不写 key,vue 在比较的时候,就可能会导致频繁更新元素,使整个 patch 过程比较低效影响性能
- 从源码可以知道 Vue 判断两个节点是相同时主要判断两者的元素类型和 key 等,如果不设置 key,就可能永远认为这两个是相同的节点,只能去做更行操作,就造成大量的不必要的 DOM 更新操作,明显是不可取的

![qKD8UWMaGSvtNgwIuNWaVw==.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4bcff89b5bdf432ea0e478ececdc74ce~tplv-k3u1fbpfcp-watermark.image?)

# 核心原理

通过 h 函数来实现的,h 函数就是用来创建虚拟 dom,patch 函数(用来比较新就虚拟 DOM 更新视图)

## h 函数

h 函数的主要作用就是创建虚拟节点
在 h 函数中使用了 vnode 函数,这个函数功能就是把传入的参数作为对象返回

h 函数是可以嵌套使用的,从而得到虚拟 DOM 树

```js
/* vnode.js */

/**
 * 把传入的 参数 作为 对象返回
 * @param {string} sel 选择器
 * @param {object} data 数据
 * @param {array} children 子节点
 * @param {string} text 文本
 * @param {dom} elm DOM
 * @returns object
 children和text只能有一个
 */
export default function (sel, data, children, text, elm) {
  return { sel, data, children, text, elm };
}
```

如果实现三个参数的 h 函数

```js
/* h.js */

// 导入 vnode
import vnode from './vnode';

// 导出 h 方法
// 这里就实现简单3个参数 参数写死
/**
 *
 * @param {string} a sel
 * @param {object} b data
 * @param {any} c 是子节点 可以是文本，数组
 */
export default function h(a, b, c) {
  // 先判断是否有三个参数
  if (arguments.length < 3) throw new Error('请检查参数个数');
  // 第三个参数有不确定性 进行判断
  // 1.第三个参数是文本节点
  if (typeof c === 'string' || typeof c === 'number') {
    // 调用 vnode 这直接传 text 进去
    // 返回值 {sel,data,children,text,elm} 再返回出去
    return vnode(a, b, undefined, c, undefined);
  } // 2.第三个参数是数组 [h(),h()] [h(),text] 这些情况
  else if (Array.isArray(c)) {
    // 然而 数组里必须是 h() 函数
    // children 用收集返回结果
    let children = [];
    // 先判断里面是否全是 h()执行完的返回结果 是的话添加到 chilren 里
    for (let i = 0; i < c.length; i++) {
      // h() 的返回结果 是{} 而且 包含 sel
      if (!(typeof c[i] === 'object' && c[i].sel))
        throw new Error('第三个参数为数组时只能传递 h() 函数');
      // 满足条件进行push [{sel,data,children,text,elm},{sel,data,children,text,elm}]
      children.push(c[i]);
    }
    // 调用 vnode 返回 {sel,data,children,text,elm} 再返回
    return vnode(a, b, children, undefined, undefined);
  } // 3.第三个参数直接就是函数 返回的是 {sel,data,children,text,elm}
  else if (typeof c === 'object' && c.sel) {
    // 这个时候在 使用h()的时候 c = {sel,data,children,text,elm} 直接放入children
    let children = [c];
    // 调用 vnode 返回 {sel,data,children,text,elm} 再返回
    return vnode(a, b, children, undefined, undefined);
  }
}
```

原理就是使用嵌套不断地收集`{sel,data,children,text,elm}`,children 里面再套`{sel,data,children,text,elm}`

## patch 函数 (Diff 算法核心)

源码中 patch 函数主要接受四个参数

- oldVnode:老的虚拟 DOM 节点
- vnode:新的虚拟 DOM 节点
- hydrating:是不是要和真实 DOM 混合,服务器渲染的会用
- removeOnly:transition-group 会用到
  逻辑流程

1. `vnode`不存在,`oldVnode`存在,就删掉`oldVnode`
2. `vnode`存在,`oldVnode`不存在,就创建`vnode`
3. 两个都存在的话,通过`sameVnode`函数对比是不是同一节点
   - 如果是同一节点的话`patchVnode`进行后续的对比节点变化或子节点变化
   - 如果是同一节点,把`vnode`挂载到`oldVnode`的父元素下
     - 如果组件的根节点被替换,就遍历更新父节点,然后删掉旧的节点
     - 如果是服务端渲染就用`hydrating`把`oldVnode`和真实 DOM 混合

```js
/* patch.js */

// 导入 vnode
import vnode from './vnode'
// 导出 patch
/**
 *
 * @param {vnode/DOM} oldVnode
 * @param {vnode} newVnode
 */
export default function patch(oldVnode, newVnode) {
  // 1.判断oldVnode 是否为虚拟 DOM 这里判断是否有 sel
  if (!oldVnode.sel) {
    // 转为虚拟DOM
    oldVnode = emptyNodeAt(oldVnode)
  }
  // 判断 oldVnode 和 newVnode 是否为同一虚拟节点
  // 通过 key 和 sel 进行判断
  if (sameVnode(oldVnode, newVnode)) {
    // 是同一个虚拟节点 调用我们写的 patchVnode.js 中的方法
    patchVnode(oldVnode,Vnode,insertedVnodeQueue)
    ...
  } else {
    // 不是同一虚拟个节点 直接暴力拆掉老节点，换上新的节点
    ...
    // 插入到老节点之前
    let newVnodeElm = createElement(newVnode)
    if(oldVnode.elm.parentVnode && newVnodeElm) {
      oldVnode.elm.parentNode.insertBefore(newVnodeElm.odlVnode.elm)
    }
    // 删除老节点
    oldVnode.elm.parentNode.removeCild(oldVnode)
  }
  newVnode.elm = oldVnode.elm

  // 返回newVnode作为 旧的虚拟节点
  return newVnode
}

/**
 * 转为 虚拟 DOM
 * @param {DOM} elm DOM节点
 * @returns {object}
 */
function emptyNodeAt(elm) {
  // 把 sel 和 elm 传入 vnode 并返回
  // 这里主要选择器给转小写返回vnode
  // 这里功能做的简陋，没有去解析 # .
  // data 也可以传 ID 和 class
  return vnode(elm.tagName.toLowerCase(), undefined, undefined, undefined, elm)
}


```

### createElement

创建节点的方法

```js
// 真正创建节点,将vnode创建为DOM
function createElement (vnode) {
  // 目的就是将vnode创建为DOM
  // 创建一个新的DOM节点
  let domNode = document.createElement*=(vnode.sel)
    // 存在子节点
    // 子节点是文本
  if (
    vnode.text !== '' &&
    (vnode.children === undefined || vnode.children.length === 0)
  ) {
    // 直接添加文字到 node 中
    domNode.innerText = vnode.text
    // 补充elm属性
    vnode.elm = domNode


  } else if(Array.isArray(vnode.children) && vnode.children.length > 0) {
    // 子节点是数组(有子节点),需要递归创建
    for(let i = 0,i< vnode.children.length; i++ ) {
      let ch =vnode,children[i]
      let chDOM = createElement(ch)
      domNode.appenChild(chDOM)
    }
  }

  // 返回elm,elm属性是一个纯DOM对象
  return vnode.elm

}
```

### sameVnode 函数

**判断是否为同一类型节点**,明确什么算是同一类型节点
核心代码中有体现

```js
function sameVnode(oldVnode, newVnode) {
  return (
    oldVnode.key === newVnode.key && // key值是否一样
    oldVnode.tagName === newVnode.tagName && // 标签名是否一样
    oldVnode.isComment === newVnode.isComment && // 是否都为注释节点
    isDef(oldVnode.data) === isDef(newVnode.data) && // 是否都定义了data
    sameInputType(oldVnode, newVnode) // 当标签为input时，type必须是否相同
  );
}
```

比较为相同的节点

- key 值是否一样
- 标签签名是否一样
- 是否都为注释节点
- 是否都定义了 data
- 当标签为 input 时,type 是否相同
-

### patchVnode 函数

这个是在新的 vnode 和 oldVnode 是同一节点的情况下,才会执行的函数,主要是对比节点文本变化或子节点变化

思考的逻辑

1. 如果新的 vnode 无 text(有 children)
   1. 两个都有 children
   2. 新的有 children,老的无 chiildren(有 text):清空 text,添加新的 children
   3. 新的无 children,老的有 children 无 text: 移除 children
   4. 老的有 text:清空 text
2. 如果新的 vnode 有 text,如果 oldVnode 的 text 不等于新的 vnode text,如果 oldVndoe text 有 children 移除老的 vnode children,将 old text 设置成 newText

这个函数功能

- 找到对应的真实 DOM,称为 el
- 判断 vnode 和 oldVnode 是否指向同一个对象,即两者的引用地址是一样的,就表示节点没有变化,直接返回
- 如果 oldVnode 的 isAsyncPlaceholder 存在,就跳过异步组件的检查,直接返回
- 如果 oldVnode 和 vnode 都是静态节点,并且有一样的 key,并且 vnode 是克隆节点或者 v-once 指令控制的节点时,把 oldVnode.elm 和 oldVnode.child 都复制到 vnode 上,然后返回
- 如果 vnode 不是文本节点也不是注释节点的情况下
  - 如果 vnode 和 oldVnode 都有子节点,调用的 updateChildren 更新
  - 如果只有 vnode 有子节点,就调用 addVnodes 删除该子节点
  - 如果 vnode 文本是 undefined,就删除 vnode.elm 文本
- 如果 vnode 是文本节点但是和 oldVnode 文本内容不一样,就更新文本

```js
function patchVnode(
  oldVnode, // 老的虚拟 DOM 节点
  vnode, // 新的虚拟 DOM 节点
  insertedVnodeQueue, // 插入节点的队列
  ownerArray, // 节点数组
  index, // 当前节点的下标
  removeOnly, // 只有在
) {
  // 新老节点引用地址是一样的，直接返回
  // 比如 props 没有改变的时候，子组件就不做渲染，直接复用
  if (oldVnode === vnode) return;

  // 新的 vnode 真实的 DOM 元素
  if (isDef(vnode.elm) && isDef(ownerArray)) {
    // clone reused vnode
    vnode = ownerArray[index] = cloneVNode(vnode);
  }

  const elm = (vnode.elm = oldVnode.elm);
  // 如果当前节点是注释或 v-if 的，或者是异步函数，就跳过检查异步组件
  if (isTrue(oldVnode.isAsyncPlaceholder)) {
    if (isDef(vnode.asyncFactory.resolved)) {
      hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
    } else {
      vnode.isAsyncPlaceholder = true;
    }
    return;
  }
  // 当前节点是静态节点的时候，key 也一样，或者有 v-once 的时候，就直接赋值返回
  if (
    isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
  ) {
    vnode.componentInstance = oldVnode.componentInstance;
    return;
  }
  // hook 相关的不用管
  let i;
  const data = vnode.data;
  if (isDef(data) && isDef((i = data.hook)) && isDef((i = i.prepatch))) {
    i(oldVnode, vnode);
  }
  // 获取子元素列表
  const oldCh = oldVnode.children;
  const ch = vnode.children;

  if (isDef(data) && isPatchable(vnode)) {
    // 遍历调用 update 更新 oldVnode 所有属性，比如 class,style,attrs,domProps,events...
    // 这里的 update 钩子函数是 vnode 本身的钩子函数
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
    // 这里的 update 钩子函数是我们传过来的函数
    if (isDef((i = data.hook)) && isDef((i = i.update))) i(oldVnode, vnode);
  }
  // 如果新节点不是文本节点，也就是说有子节点
  if (isUndef(vnode.text)) {
    // 如果新老节点都有子节点
    if (isDef(oldCh) && isDef(ch)) {
      // 如果新老节点的子节点不一样，就执行 updateChildren 函数，对比子节点
      if (oldCh !== ch)
        updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
    } else if (isDef(ch)) {
      // 如果新节点有子节点的话，就是说老节点没有子节点

      // 如果老节点文本节点，就是说没有子节点，就清空
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '');
      // 添加子节点
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
    } else if (isDef(oldCh)) {
      // 如果新节点没有子节点，老节点有子节点，就删除
      removeVnodes(oldCh, 0, oldCh.length - 1);
    } else if (isDef(oldVnode.text)) {
      // 如果老节点是文本节点，就清空
      nodeOps.setTextContent(elm, '');
    }
  } else if (oldVnode.text !== vnode.text) {
    // 新老节点都是文本节点，且文本不一样，就更新文本
    nodeOps.setTextContent(elm, vnode.text);
  }
  if (isDef(data)) {
    // 执行 postpatch 钩子
    if (isDef((i = data.hook)) && isDef((i = i.postpatch))) i(oldVnode, vnode);
  }
}
```

### updateChildren

diff 算法的子节点更新策略

这个是新的 vnode 和 oldVnode 都有子节点,且子节点不一样的时候进行对比子节点的函数
作用:新旧虚拟节点的子节点对比,`收尾指针法`,新的子阶段集合和旧的子节点集合,各个收尾两个指针

比如循环遍历两个列表,循环停止条件是:其中一个列表的开始指针 start 和结束指针 end 重合

**diff 算法优化策略是四种命中查找**
循环的内容是:

- 新的头和老的头对比
- 新的尾和老的尾对比
- 新的头和老的尾对比
- 新的尾和老的头对比

以上四种只要有一种判断相等,就调用 patchVnode 对别节点变化或子节点变化,然后移动对比的下标,继续下一轮循环对比

如果以上逻辑都匹配不到,在所有旧子节点的 key 做一个映射到旧节点下标的`key->index`表,然后用新的 vnode 的 key 去找出在旧节点中可以复用的位置

- 如果没有找到,就创建一个新的节点
- 如果找到了,再对比标签是否是同一节点
  - 如果是同一节点,就调用 patchVnode 进行后续比较,然后把这个节点插入到老的开始指针前面,并且移动新的开始下标,继续下一轮循环对比
  - 如果不是相同节点,就创建一个新的节点
- 如果老的 vnode 先遍历完,就添加新的 vnode 没有遍历的节点
- 如果新的 vnode 先遍历完,就删除老的 vnode 没有遍历的节点

```js
/* updateChilren.js */

// 导入 createElm patchVnode sameVnode
import createElm from './createElm';
import patchVnode from './patchVnode';
import sameVnode from './sameVnode';

// 导出 updateChildren
/**
 *
 * @param {dom} parentElm 父节点
 * @param {array} oldCh 旧子节点
 * @param {array} newCh 新子节点
 */
export default function updateChildren(parentElm, oldCh, newCh) {
  // 下面先来定义一下之前讲过的 diff 的几个指针 和 指针指向的 节点
  // 旧前 和 新前
  let oldStartIdx = 0,
    newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1; //旧后
  let newEndIdx = newCh.length - 1; //新后
  let oldStartVnode = oldCh[0]; //旧前 节点
  let oldEndVnode = oldCh[oldEndIdx]; //旧后节点
  let newStartVnode = newCh[0]; //新前节点
  let newEndVnode = newCh[newEndIdx]; //新后节点
  let keyMap = null; //用来做缓存
  // 写循环条件
  while (newStartIdx <= newEndIdx && oldStartIdx <= oldEndIdx) {
    console.log('---进入diff---');

    // 下面按照 diff 的4种策略来写 这里面还得调用 pathVnode
    // patchVnode 和 updateChildren 是互相调用的关系，不过这可不是死循环
    // 指针走完后就不调用了

    // 这一段都是为了忽视我们加过 undefined 节点，这些节点实际上已经移动了
    if (oldCh[oldStartIdx] == undefined) {
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (oldCh[oldEndIdx] == undefined) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (newCh[newStartIdx] == undefined) {
      newStartVnode = newCh[++newStartIdx];
    } else if (newCh[newEndIdx] == undefined) {
      newEndVnode = newCh[--newEndIdx];
    }
    // 忽视了所有的 undefined 我们这里来 判断四种diff优化策略
    // 1.新前 和 旧前
    else if (sameVnode(oldStartVnode, newStartVnode)) {
      console.log('1命中');
      // 调用 patchVnode 对比两个节点的 对象 文本 children
      patchVnode(oldStartVnode, newStartVnode);
      // 指针移动
      newStartVnode = newCh[++newStartIdx];
      oldStartVnode = oldCh[++oldStartIdx];
    } // 2.新后 和 旧后
    else if (sameVnode(oldEndVnode, newEndVnode)) {
      console.log('2命中');
      // 调用 patchVnode 对比两个节点的 对象 文本 children
      patchVnode(oldEndVnode, newEndVnode);
      // 指针移动
      newEndVnode = newCh[--newEndIdx];
      oldEndVnode = oldCh[--oldEndIdx];
    } // 3.新后 和 旧前
    else if (sameVnode(oldStartVnode, newEndVnode)) {
      console.log('3命中');
      // 调用 patchVnode 对比两个节点的 对象 文本 children
      patchVnode(oldStartVnode, newEndVnode);
      // 策略3是需要移动节点的 把旧前节点 移动到 旧后 之后
      // insertBefore 如果参照节点为空，就插入到最后 和 appendChild一样
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling);
      // 指针移动
      newEndVnode = newCh[--newEndIdx];
      oldStartVnode = oldCh[++oldStartIdx];
    }
    // 4.新前 和 旧后
    else if (sameVnode(oldEndVnode, newStartVnode)) {
      console.log('4命中');
      // 调用 patchVnode 对比两个节点的 对象 文本 children
      patchVnode(oldEndVnode, newStartVnode);
      // 策略4是也需要移动节点的 把旧后节点 移动到 旧前 之前
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
      // 指针移动
      newStartVnode = newCh[++newStartIdx];
      oldEndVnode = oldCh[--oldEndIdx];
    } else {
      console.log('diff四种优化策略都没命中');
      // 当四种策略都没有命中
      // keyMap 为缓存，这样就不用每次都遍历老对象
      if (!keyMap) {
        // 初始化 keyMap
        keyMap = {};
        // 从oldStartIdx到oldEndIdx进行遍历
        for (let i = oldStartIdx; i < oldEndIdx; i++) {
          // 拿个每个子对象 的 key
          const key = oldCh[i].data.key;
          // 如果 key 不为 undefined 添加到缓存中
          if (!key) keyMap[key] = i;
        }
      }

      // 判断当前项是否存在 keyMap 中 ,当前项时 新前(newStartVnode)
      let idInOld = keyMap[newStartIdx.data]
        ? keyMap[newStartIdx.data.key]
        : undefined;

      // 存在的话就是移动操作
      if (idInOld) {
        console.log('移动节点');
        // 从 老子节点 取出要移动的项
        let moveElm = oldCh[idInOld];
        // 调用 patchVnode 进行对比 修改
        patchVnode(moveElm, newStartVnode);
        // 将这一项设置为 undefined
        oldCh[idInOld] = undefined;
        // 移动 节点 ,对于存在的节点使用 insertBefore移动
        // 移动的 旧前 之前 ，因为 旧前 与 旧后 之间的要被删除
        parentElm.insertBefore(moveElm.elm, oldStartVnode.elm);
      } else {
        console.log('添加新节点');
        // 不存在就是要新增的项
        // 添加的节点还是虚拟节点要通过 createElm 进行创建 DOM
        // 同样添加到 旧前 之前
        parentElm.insertBefore(createElm(newStartVnode), oldStartVnode.elm);
      }

      // 处理完上面的添加和移动 我们要 新前 指针继续向下走
      newStartVnode = newCh[++newStartIdx];
    }
  }
  // 我们添加和删除操作还没做呢
  // 首先来完成添加操作 新前 和 新后 中间是否还存在节点
  if (newStartIdx <= newEndIdx) {
    console.log('进入添加剩余节点');
    // 这是一个标识
    // let beforeFlag = oldCh[oldEndIdx + 1] ? oldCh[oldEndIdx + 1].elm : null
    let beforeFlag = newCh[newEndIdx + 1] ? newCh[newEndIdx + 1] : null;
    // new 里面还有剩余节点 遍历添加
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      // newCh里面的子节点还需要 从虚拟DOM 转为 DOM
      parentElm.insertBefore(createElm(newCh[i]), beforeFlag);
    }
  } else if (oldStartIdx <= oldEndIdx) {
    console.log('进入删除多余节点');
    // old 里面还有剩余 节点 ,旧前 和 旧后 之间的节点需要删除
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      // 删除 剩余节点之前 先判断下是否存在
      if (oldCh[i].elm) parentElm.removeChild(oldCh[i].elm);
    }
  }
}
```

# vue3 虚拟 dom

- 事件缓存
- 添加静态标记
- 静态提升
- 使用最长递增子序列优化了对比流程:Vue2 在 updateChildren()函数里对比变更,Vue3 中这一块逻辑在 patchKeyChildren()函数里

## 事件缓存
