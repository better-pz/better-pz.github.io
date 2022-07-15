# cookie

[把 cookie 讲清楚](https://juejin.cn/post/6844903501869350925)

### 1. cookie 的来源

cookie 的本职工作并非本地存储,而是"维持状态",因为 http 协议是无状态的, http 协议自身不对请求和响应之间的通信状态进行保存,一般来讲,服务器不知道用户上次做了什么,这严重阻碍了交互式 web 应用程序的实现, 在典型的网上购物场景中,用户浏览了几个页面,买了一些东西,最后由于 http 无状态性,服务器并不知道用户到底买了什么,于是就诞生了 cookie ,它就是用来绕开 http 的无状态性的额外手段之一,服务器可以设置或读取 cookie 中包含信息,借此维护用户跟服务器会话中的状态

把 cookie 理解成一个存储在浏览器里的一个小小的文本文件,它附着在 http 请求上,它携带用户信息,当服务器检查 cookie 的时候,便可以获取客户端的状态

### 2. 什么是 cookie 以及应用场景

cookie 指某些网站为了辨别用户身份而存储在用户本地终端上的数据,cookie 是服务器生成,客户端进行维护和存储,通过 cookie 可以让服务器知道请求是来源哪个客户端,就可以进行客户端状态的维护,比如登录后刷新,请求头就会携带登录时 response header 中 set-cookie,web 服务器街道也能独处 cookie 的值,根据 cookie 值的内容就可以判断和恢复一些用户的信息状态,cookie 已键值堆的形式存在

### 3. cookie 的原理以及生成方式

第一次请求: 浏览器发出请求,服务器响应请求后,会在响应头里添加一个 set-cookie 选项,将 cookie 放入到响应请求中,在浏览器第二次发请求的时候,会通过 cookie 请求头部将 cookie 信息发送给服务器,服务器会辨别用户身份

**生成方式** :

1.  http response header 中的 set-cookie

我们可以通过响应头里的 set-cookie 指定要存储的 cookie 值,默认情况下,domain 被设置为设置 cookie 页面的主机名,我们可以手动设置 domain 的值

```js
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2018 07:28:00 GMT;//可以指定一个特定的过期时间（Expires）或有效期（Max-Age）
```

当 cookie 的过期时间被设定时,设定的日期和时间只与客户端相关,而不是服务器

2. js 中可以通过 document.cookie 可以读写 cookie,以键值对的形式展示

domain 标识指定了哪些域名可以接受 cooike,如果没有设置 domain,就会自动绑定到执行语句的当前域,如果设置为'baidu.com',则所有'baidu.com'结尾的域名都可以访问该 cookie,其他网站上就拿不到

### 4. cookie 的缺陷

- 大小空间的限制

Cookie 的大小限制在 4kb 左右,对于复杂的存储需求来说是不够用的,当 cookie 唱过 4kb 的时候,他将面临别裁切的,

**注意**: 各个浏览器的 cookie`name = value` 的 value 值大概是 4k, 所以 4k 并不是一个域名下所有的 cookie 共享的,而是一个 name 的大小

- 过多的 cookie 会带来巨大的性能浪费

Cookie 是紧跟域名的,同一个域名下的所有请求,都会携带 cookie,大家试想,如果我们只是请求一个图或者 css 文件,我们也要携带一个 cookie 传输会代码很大的消耗,

cookie 是用来维护用户信息的,而域名下所有的请求都狐疑携带 cookie,但对于静态文件的请求,携带的 cookie 信息更本没有用,此时可以通过 cdn 的域名和主站的域名分来来就解决,

- http 中的 cookie 是明文传输的,要使用 https 解决安全的问题

### 5. cookie 与安全

| 属性      | 作用                                                         |
| --------- | ------------------------------------------------------------ |
| value     | 如果用户保存用户登录态,应该将该值加密,不能使用明文的用户标识 |
| http-only | 不能通过 js 访问 cookie，减少 xss 攻击                       |
| secure    | 只能在协议为 HTTPS 的请求中携带                              |
| same-site | 规定浏览器不能再跨域请求中携带 cookie，减少 csrf 攻击        |

http-only 不支持读写,浏览器不允许脚本操作 document.cookie 去更改 coolkie 所以为避免跨域脚本 xss 攻击,通过 JavaScript 的 document.cookie API 无法访问带有 httpponly 标记的 cookie,他们只应该发送给服务端,如果包含服务端 session 信息的 cookie 不想被客户端 JavaScript 脚本调用,那么就应该为其设置 HTTPOnly 标记
