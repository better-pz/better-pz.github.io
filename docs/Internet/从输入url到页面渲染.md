<script src="https://beaudar.lipk.org/client.js"
        repo="https://github.com/better-pz/better-pz.github.io.git"
        issue-term="pathname"
        theme="github-light"
        crossorigin="anonymous"
        async>
</script>

# 从输入 URL 到页面展现中间发生了这些!

这个问题真的是个老生常谈的问题,作为一个前端或者后端都应该熟记于心,这个过程可以说的很粗糙,也可以详谈,其中展现了许多网络相关的知识点,于是必须要好好整理下

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90470aceb5604955854f0d09ded92103~tplv-k3u1fbpfcp-zoom-1.image)

**主要总体来说分为以下几个过程**

- URL 输入
- DNS 解析
- TCP 连接（三次握手）连接复用
- 发送 HTTP 请求（请求的四部分）
- 服务器送 HTTP 响应
- 关闭 TCP 连接（四次挥手）
- 浏览器解析渲染页面

# 1\. URL 输入

> 首先我们是在浏览器中输入 URL,URL 中文名叫做统一资源定位符，统一资源定位符是对可以从互联网上得到的资源的位置和访问方法的一种简洁的表示，是互联网上标准资源的地址。互联网上的每个文件都有一个唯一的 URL，它包含的信息指出文件的位置以及浏览器应该怎么处理它。

当用户输入 url 时浏览器进程的 ui 线程会捕捉输入内容,如果访问的是网址则 ui 线程会启动一个网络线程来请求 DNS 进行域名解析
如果不是网址而是一串关键词浏览就会使用默认配置的所有引擎来查询

**主要组成部分：protocol (协议): // hostname(主机名)\[:port\] (端口) / path(路径) / \[;parameters\] (参数)**  
这里我们要注意的时候浏览器遵循的同源策略,我们前端访问接口的时候通常会遇到跨域的问题,这里所有的域是协议、域名和端口号的合集，同域就是所协议、域名和端口号均相同，任何一个不同都是跨域  
关于跨域与解决跨域的方法可以参考下文;

# 2\. DNS 解析

DNS 解析的过程就是寻找哪台机器上有你需要资源的过程。当你在浏览器中输入一个地址时，例如www.google.com，其实不是google网站真正意义上的地址。互联网上每一台计算机的唯一标识是它的IP地址，但是IP地址并不方便记忆。用户更喜欢用方便记忆的网址去寻找互联网上的其它计算机，也就是上面提到的百度的网址。所以互联网设计者需要在用户的方便性与可用性方面做一个权衡，这个权衡就是一个网址到IP地址的转换，这个过程就是DNS解析。它实际上充当了一个翻译的角色，实现了网址到IP地址的转换。网址到IP地址转换的过程是如何进行的?

## 2.1DNS 解析的过程

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a167651adf0a42ea876f185d03031071~tplv-k3u1fbpfcp-zoom-1.image)

**DNS 查找顺序**:  
**浏览器缓存–> 操作系统缓存–> 本地 host 文件 --> 路由器缓存–> ISP DNS 缓存 --> 顶级 DNS 服务器/根 DNS 服务器**  
分析查找www.google.com的IP地址过程,: . -> .com -> google.com. -> www.google.com.  
有人会很奇怪怎么会多一个点,并不是我多打了一个.，这个.对应的就是根域名服务器，默认情况下所有的网址的最后一位都是.，既然是默认情况下，为了方便用户，通常都会省略，浏览器在请求 DNS 的时候会自动加上，所有网址真正的解析过程为: . -> .com -> google.com. -> www.google.com.。

## 2.2 DNS 查询的两种方式：递归查询和迭代查询

1.  **递归解析**  
    ​ 当局部 DNS 服务器自己不能回答客户机的 DNS 查询时，它就需要向其他 DNS 服务器进行查询。此时有两种方式，如图所示的是递归方式。局部 DNS 服务器自己负责向其他 DNS 服务器进行查询，一般是先向该域名的根域服务器查询，再由根域名服务器一级级向下查询。最后得到的查询结果返回给局部 DNS 服务器，再由局部 DNS 服务器返回给客户端。  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4adeef58d0a4d53a1929b068190701e~tplv-k3u1fbpfcp-zoom-1.image)
2.  **迭代解析**  
    当局部 DNS 服务器自己不能回答客户机的 DNS 查询时，也可以通过迭代查询的方式进行解析，如图所示。局部 DNS 服务器不是自己向其他 DNS 服务器进行查询，而是把能解析该域名的其他 DNS 服务器的 IP 地址返回给客户端 DNS 程序，客户端 DNS 程序再继续向这些 DNS 服务器进行查询，直到得到查询结果为止。也就是说，迭代解析只是帮你找到相关的服务器而已，而不会帮你去查。比如说：baidu.com 的服务器 ip 地址在 192.168.4.5 这里，你自己去查吧，本人比较忙，只能帮你到这里了。  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4d0b5b3e69046579b2f739ea64306c0~tplv-k3u1fbpfcp-zoom-1.image)

## 2.3 DNS 负载均衡

当一个网站有足够多的用户的时候，假如每次请求的资源都位于同一台机器上面，那么这台机器随时可能会蹦掉。处理办法就是用 DNS 负载均衡技术，它的原理是在 DNS 服务器中为同一个主机名配置多个 IP 地址,在应答 DNS 查询时,DNS 服务器对每个查询将以 DNS 文件中主机记录的 IP 地址按顺序返回不同的解析结果,将客户端的访问引导到不同的机器上去,使得不同的客户端访问不同的服务器,从而达到负载均衡的目的｡例如可以根据每台机器的负载量，该机器离用户地理位置的距离等等。

## 2.4 DNS 缓存

了增加访问效率，计算机有域名缓存机制，当访问过某个网站并得到其 IP 后，会将其域名和 IP 缓存下来，下一次访问的时候，就不需要再请求域名服务器获取 IP，直接使用缓存中的 IP，提高了响应的速度。当然缓存是有有效时间的，当过了有效时间后，再次请求网站，还是需要先请求域名解析。

但是域名缓存机制也可能会带来麻烦。例如 IP 已变化了，仍然使用缓存中的 IP 来访问，将会访问失败。再如 同一个域名在内网和外网访问时所对应的 IP 是不同的，如在外网访问时通过外网 IP 映射到内网的 IP。同一台电脑在外网环境下访问了此域名，再换到内网来访问此域名，在 DNS 缓存的作用下，也会去访问外网的 IP，导致访问失败。根据情况，可以手动清除 DNS 缓存或者禁止 DNS 缓存机制。  
在你的 chrome 浏览器中输入:chrome://dns/，你可以看到 chrome 浏览器的 DNS 缓存。系统缓存主要存在/etc/hosts(Linux 系统)中

# 3\. TCP 连接（三次握手）

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2d52ba0165f44a292e2cc38dec0bd73~tplv-k3u1fbpfcp-zoom-1.image)

在通过第一步的 DNS 域名解析后，获取到了服务器的 IP 地址，在获取到 IP 地址后，便会开始建立一次连接，这是由 TCP 协议完成的，主要通过三次握手进行连接。

1.  先 Client 端发送连接、请求报文:客户端向服务端发送一个 syn 的数据包这个时候客户端处于一个 SYN_SENT 的状态,等待服务器确认.
2.  服务器收到 syn 包，必须确认客户的 SYN（ack=j+1），同时自己也发送一个 SYN 包（syn=k），即 SYN+ACK 包，此时服务器进入 SYN_RECV 状态；
3.  客户端收到服务器的 SYN+ACK 包，向服务器发送确认包 ACK(ack=k+1），并分配资源,此包发送完毕，客户端和服务器进入 ESTABLISHED（TCP 连接成功）状态，完成三次握手 这样 TCP 连接就建立了

# 4\. 发送 HTTP 请求

建立了 TCP 连接之后，发起一个 http 请求。一个典型的 http request header 一般需要包括请求的方法，例如 `GET`或者 `POST`等，不常用的还有 `PUT`和 `DELETE`、HEAD`OPTION`以及 TRACE 方法  
.用报文的形式告诉服务器我们需要什么东西,完整的 HTTP 请求包含请求起始行、请求头部、请求主体三部分。  
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b30596c5e50844d8b723a4ca09585e72~tplv-k3u1fbpfcp-zoom-1.image)

## 补充 (1)GET 对比 POST

参考答案: [w3school: GET 对比 POST](https://www.w3school.com.cn/tags/html_ref_httpmethods.asp)  
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c3e2a7ec3a34c29ad1a3fc7e0d59806~tplv-k3u1fbpfcp-zoom-1.image)

其实看看其他请求方法的名字就能大概知道在什么时候用什么方法,这就很好的体现了语义化  
**先下结论，GET 和 POST 方法没有实质区别，只是报文格式不同。**  
GET 和 POST 只是 HTTP 协议中两种请求方式，而 HTTP 协议是基于 TCP/IP 的应用层协议，无论 GET 还是 POST，用的都是同一个传输层协议，所以在传输上，没有区别。  
**报文格式上，不带参数时，最大区别就是第一行方法名不同.不带参数时他们的区别就仅仅是报文的前几个字符不同而已**  
POST 方法请求报文第一行是这样的 POST /uri HTTP/1.1 \\r\\n  
GET 方法请求报文第一行是这样的 GET /uri HTTP/1.1 \\r\\n  
**带参数时报文的区别**:  
在约定中，GET 方法的参数应该放在 url 中，POST 方法参数应该放在 body 中  
举个例子，如果参数是 name=qiming.c, age=22。  
GET 方法简约版报文是这样的

```
GET /index.php?name=qiming.c&age=22 HTTP/1.1
Host: localhost

```

POST 方法简约版报文是这样的

```
POST /index.php HTTP/1.1
Host: localhost
Content-Type: application/x-www-form-urlencoded

name=qiming.c&age=22


```

**总结下**

- GET - 从指定的资源请求数据。是无副作用的，是幂等的，且可缓存
- POST - 用于向指定的资源提交要被处理的数据，有副作用，非幂等，不可缓存
- 参数。GET 的参数放在 url 的查询参数里，POST 的参数（数据）放在请求消息体里。
- 安全。GET 相对 POST 安全（只是相对安全）
- GET 的 URL 会有长度上的限制， POST 可以传输很多数据,GET 的参数（url 查询参数）有长度限制，一般是 1024 个字符。POST 的参数（数据）没有长度限制（也是有 4~10Mb 限制）
- GET 用来读数据，POST 用来写数据，POST 不幂等（幂等的意思就是不管发多少次请求，结果都一样。）

## 补充(2) HTTPS 和 HTTP 的区别

可以参考[详细解析 HTTP 与 HTTPS 的区别](https://juejin.im/entry/58d7635e5c497d0057fae036)  
主要区别有以下几点

1.  https 协议需要到 ca 申请证书，一般免费证书较少，因而需要一定费用。
2.  http 是超文本传输协议，信息是明文传输，https 则是具有安全性的 ssl 加密传输协议。
3.  http 和 https 使用的是完全不同的连接方式，用的端口也不一样，前者是 80，后者是 443。
4.  http 的连接很简单，是无状态的；HTTPS 协议是由 SSL+HTTP 协议构建的可进行加密传输、身份认证的网络协议，比 http 协议安全。

# 5.服务器返回一个 HTTP 响应

服务器在收到浏览器发送的 HTTP 请求之后，会将收到的 HTTP 报文封装成 HTTP 的 Request 对象，并通过不同的 Web 服务器进行处理，处理完的结果以 HTTP 的 Response 对象返回，主要包括状态码，响应头，响应正文三个部分。  
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2405cf032394297957ed18a69f905a6~tplv-k3u1fbpfcp-zoom-1.image)

## 补充:常见状态码

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78ed14f295b8465fbad550b8fd8599b8~tplv-k3u1fbpfcp-zoom-1.image)

一般大家都知道 404 页面不存在，500 服务器错误，301 重定向，302 临时重定向，200ok，401 未授权啥的。

重点介绍三个状态码及相关的知识，他们分别是 304 协商缓存，101 协议升级，以及 307hsts 跳转。

- 304 协商缓存  
  先从 304 协商缓存开始吧。这是比较基础的知识。相信我，只要你提起 304 协商缓存，面试官一定会忍不住问你，什么是协商缓存？  
  “协商缓存与强制缓存的区别在于强制缓存不需要访问浏览器，返回结果是 200”.强制缓存不需要访问服务器，直接从浏览器中获取，此时是 200。协商缓存，需要访问服务器，如果命中，会修改浏览器中的缓存头部信息，最后还是从浏览器中获取信息，此时是 304，如果没有命中，则从服务器获取信息，此时是 200,这时就到了你展示一下自己丰富的浏览器缓存知识的时候了。我一般会这么答：浏览器缓存分为强制缓存和协商缓存，优先读取强制缓存。强制缓存分为 expires 和 cache-control，而 expires 是一个特定的时间，是比较旧的标准和 cache-control 通常是一个具体的时间长度，比较新，优先级也比较高。而协商缓存包括 etag 和 last-modified，last-modified 的设置标准是资源的上次修改时间，而 etag 是为了应对资源修改时间可能很频繁的情况出现的，是基于资源的内容计算出来的值，因此优先级也较高。协商缓存与强制缓存的区别在于强制缓存不需要访问浏览器，返回结果是 200，协商缓存需要访问服务器，返回结果是 304。
- 101 协议升级  
  主要用于 websocket，也可以用于 http2 的升级。websocket 的特点和功效不细说，大家都很熟了。  
  http2 好处多多，一般说出支持单个连接多次请求，二进制，压缩头部，服务器推送等特征面试官就比较满足了。具体了解也是自行谷歌百度，这里也是不细说。当然这时候我们可能要应对一下面试官接下来的追问：到底 https,http,http2 以及它的原形 spdy 有什么区别，又分别有什么优点和不足，他们的建立连接分别又有着什么环节，这些知识就需要读者自己去充分搜索查询了。
- 307 hsts 跳转  
  这个比较高端，原本的用法是用于让 post 请求的跳转去新的 post 请求，但也用于 hsts 跳转。hsts 全称 HTTP 严格传输安全（HTTP Strict Transport Security，縮寫：HSTS），功能是要求浏览器下次访问该站点时使用 https 来访问，而不再需要先是 http 再转 https。这样可以避免 ssl 剥离攻击，即攻击者在用户使用 http 访问的过程中进行攻击，对服务器冒充自己是用户，在攻击者和服务器中使用 https 访问，在用户和服务器中使用 http 访问。具体使用方法是在服务器响应头中添加 Strict-Transport-Security，可以设置 max-age,当然，提到了 ssl 剥离攻击，你一定很感兴趣还有什么方法可以对号称安全的 https 进行攻击呢？我这里了解到的有 ssl 劫持攻击，大概就是信任第三方的安全证书，这点被利用于代理软件监听 https。如果还有更多的，欢迎补充。

仅仅三个状态码，都可以牵涉到如此丰富的知识，对于状态码，我们不能只是片面的去背诵状态码及对应的含义，要去主动挖掘，深入，借助 http 状态码来建立自己的网络体系。

**平时常见的状态码::200, 204, 301, 302, 303,304, 400, 401, 403, 404, 500,503(一定要记住)**

- 200 OK 表示客户端请求成功
- 204 No Content 成功，但不返回任何实体的主体部分
- 301 Moved Permanently 永久性重定向，响应报文的 Location 首部应该有该资源的新 URL
- 302 Found 临时性重定向，响应报文的 Location 首部给出的 URL 用来临时定位资源
- 303 See Other 请求的资源存在着另一个 URI，客户端应使用 GET 方法定向获取请求的资源
- 304 Not Modified 服务器内容没有更新，可以直接读取浏览器缓存
- 400 Bad Request 表示客户端请求有语法错误，不能被服务器所理解
- 401 Unauthonzed 表示请求未经授权，该状态代码必须与 WWW-Authenticate 报头域一起使用
- 403 Forbidden 表示服务器收到请求，但是拒绝提供服务，通常会在响应正文中给出不提供服务的原因
- 404 Not Found 请求的资源不存在，例如，输入了错误的 URL
- 500 Internel Server Error 表示服务器发生不可预期的错误，导致无法完成客户端的请求
- 503 Service Unavailable 表示服务器当前不能够处理客户端的请求，在一段时间之后，服务器可能会恢复正常

# 6\. 关闭 TCP 连接（四次挥手）

1.  Client 端发起中断连接请求，也就是发送 FIN 报文。Server 端接到 FIN 报文后，意思是说"我 Client 端没有数据要发给你了"，但是如果你还有数据没有发送完成，则不必急着关闭(Socket)，可以继续发送数据。
2.  server 发送 ACK，“告 诉 Client 端，你的请求我收到了，但是我还没准备好，请继续等我的消息”。wait:这个时候 Client 端就进入 FIN\_ WAIT 状态，继续等待 Server 端的 FIN 报文。
3.  当 Server 端确定数据己发送完成，则向 Client 端发送 FIN 报文，“告诉  
    Client 端，好了，我这边数据发完了，准备好关闭连接了”。
4.  Client 端收到 FIN 报文后，“就知道可以关闭连接了，但是他还是不相信网络，怕 Server 端不知道要关闭，所以发送 ACK 后进入 TIME\_ \_WAIT 状态，如果 Server 端没有收到 ACK 则可以重传。“Server 端收到 ACK 后"就知道可以断开连接了”。Client 端等待了 2MSL 后依然没有收到回复，则证明 Server 端已正常关闭，那好，我 Client 端 也可以关闭连接了。Ok,TCP 连接就这样关闭了!  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/440ed42b7f88447693613d1e5e91c80f~tplv-k3u1fbpfcp-zoom-1.image)

# 7\. 浏览器解析渲染页面

当网络线程获取到数据后
会通过 safeBrowsing 来检查站点,是否是恶意站点 ,如果是则会展示一个警告页面,告诉用户这个站点有安全问题,浏览器会阻止用户的访问,同时也可以选择继续访问,safeBrowsing 通过判断站点的数据是否安全

当返回数据准备完毕并且安全校验通过时网络线程会通知 ui 线程准备好了
然后 ui 线程会创建一个渲染器进程来渲染页面,浏览器进程通过 IPCC 管道传递给渲染器进程,正式进入渲染流程

1. 解析 Html
   渲染器进程的主线程将 html 进行解析,html 通过 tokeniser 标记化,通过词法分析将输入的 html 内容解析成多个标记,根据识别后的标记进行 DOM 树构造,在 Dom 树构造的过程中会创建 document 对象,然后以 document 的根节点 DOM 树不断进行修改向其中添加各种元素 ,最终形成 DOMTree

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/919fbb881d314bd1ab917fcf53dbf235~tplv-k3u1fbpfcp-watermark.image?) 2. 解析 css
确定每个 dom 树上的节点是长什么样子,主线程需要解析 css,并确定每个 DOM 节点的计算样式即使没有提供自定义的 css1 样式,浏览器也有自己的默认的样式表,知道 Dom 结构的和每个节点的样式后 接下要确定每个节点需要放在页面的哪个位置,也就是节点的坐标以及节点需要放在页面上的哪个位置,就是节点的坐标以及该节点需要占用多大的区域,这个阶段被称为 layout 布局,主线程通过遍历 dom 和计算好的演示来生成 layout Tree
接下来要确定以什么样的顺序来绘制节点 入 z-index 这个属性会影响节点绘制的层级关系 ,为了在屏幕上显示正确的层级,主线程遍历 layout tree 创建一个绘制记录表(paint Record),该表记录了绘制的顺序,这个阶段被称为绘制(paint)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d07e95c7c9c485690d855a4963bab6d~tplv-k3u1fbpfcp-watermark.image?)

接下来将这些信息转化成像素点显示在屏幕上,这种行为被称为栅格化
浏览器采用合成的方式栅格化,合成是一种将页面的各个部分分成多个图层,分别进行栅格化,并在合成器线程中单独合成页面的技术,简单来说就是页面所有的元素按照某种规则进行分图层,并把图层都栅格化好了然后只需要把可视区的内容组合成一帧展示给用户即可;主线程遍历 layout Tree 生成 Layer Tree,当 Layer Tree 生成完毕和绘制顺序确定后,主线程将这些信息传递给合成器线程,合成器线程将每个图层栅格化,合成器线程将他们切割成许多图块,然后将每个图块发送给栅格化线程,栅格化线程栅格化每个图块,并将他们存储在 GPU 内存中,当图块栅格化完成后,合成器线程将收集称为|"draw quads"图块信息,这些信息记录了图块在内存中的位置,和在页面哪个位置绘制图块的信息,根据这些信息合成器线程生成了合成器帧,然后合成器帧通过 IPC 传送给浏览器进程,接着浏览器进程将合成器帧传送到 GPU,GPU 渲染展示到屏幕上

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/056d88d4477441e7a4f108e1c485aa96~tplv-k3u1fbpfcp-watermark.image?)
**总结浏览器渲染页面的流程**

1. 浏览器通过请求得到一个 HTML 文本,渲染进程解析 HTML,构建 DOM 树
2. 解析 HTML 的同时,如果遇到内联样式或者样式脚本,则下载并构建样式规则,若遇到 js 脚本,则会下载执行脚本
3. DOM 树和样式规则构建完成之后,渲染进程将两者结合成渲染树(render Tree)
4. 渲染进程开始对渲染树进行布局(layout),生成布局树(layout tree)
5. 渲染进程对布局进程绘制(Painting),生成绘制记录
6. 渲染进程对布局树开始分层,分别栅格化每一层,并得到合成帧
7. 渲染进程将合成帧信息发送给 GPU 进程显示到页面中

![10zZKK46K2G9yaN2ac29tg==.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c8551a663244c1784e300e4512d7b9a~tplv-k3u1fbpfcp-watermark.image?)

具体（以 webkit 为例）  
通过 HTML 解析器解析 HTML 文档，构建一个 DOM Tree，同时通过 CSS 解析器解析 HTML 中存在的 CSS，构建 Style Rules，两者结合形成一个 Attachment。  
通过 Attachment 构造出一个呈现树（Render Tree）  
Render Tree 构建完毕，进入到布局阶段（layout/reflow），将会为每个阶段分配一个应出现在屏幕上的确切坐标。  
最后将全部的节点遍历绘制出来后，一个页面就展现出来了。

这个过程比较复杂，涉及到两个概念: reflow(回流)和 repain(重绘)。下文会讲

当文档加载过程中遇到 js 文件，html 文档会挂起渲染（加载解析渲染同步）的线程，不仅要等待文档中 js 文件加载完毕，还要等待解析执行完毕，才可以恢复 html 文档的渲染线程。因为 JS 有可能会修改 DOM，最为经典的 document.write，这意味着，在 JS 执行完成前，后续所有资源的下载可能是没有必要的，这是 js 阻塞后续资源下载的根本原因。

​ JS 的解析是由浏览器中的 JS 解析引擎完成的。JS 是单线程运行，也就是说，在同一个时间内只能做一件事，所有的任务都需要排队，前一个任务结束，后一个任务才能开始。但是又存在某些任务比较耗时，如 IO 读写等，所以需要一种机制可以先执行排在后面的任务，这就是：同步任务(synchronous)和异步任务(asynchronous)。

​ JS 的执行机制就可以看做是一个主线程加上一个任务队列(task queue)。同步任务就是放在主线程上执行的任务，异步任务是放在任务队列中的任务。所有的同步任务在主线程上执行，形成一个执行栈;异步任务有了运行结果就会在任务队列中放置一个事件；脚本运行时先依次运行执行栈，然后会从任务队列里提取事件，运行任务队列中的任务，这个过程是不断重复的，所以又叫做事件循环(Event loop)。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff5b46196dea4dd7bf7485c804d87384~tplv-k3u1fbpfcp-zoom-1.image)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c96e9344dfe416798cf75e2c3a12289~tplv-k3u1fbpfcp-zoom-1.image)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6051b0d4d0454571abee5815f1a0c0ff~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb442c2c0f1c40a3a0ba66fe31594e7a~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/457319d12b8f4e5a898fa19e33e194a5~tplv-k3u1fbpfcp-watermark.image?)

# 8 回流与重绘

---

> DOM 节点中的各个元素都是以盒模型的形式存在，这些都需要浏览器去计算其位置和大小等，这个过程称为 relow;当盒模型的位置,大小以及其他属性，如颜色,字体,等确定下来之后，浏览器便开始绘制内容，这个过程称为 repain。页面在首次加载时必然会经历 reflow 和 repain。reflow 和 repain 过程是非常消耗性能的，尤其是在移动设备上，它会破坏用户体验，有时会造成页面卡顿。所以我们应该尽可能少的减少 reflow 和 repain。

Reflow，也称作 Layout，中文叫回流，一般意味着元素的内容、结构、位置或尺寸发生了变化，需要重新计算样式和渲染树，这个过程称为 Reflow。  
　　 Repaint，中文重绘，意味着元素发生的改变只是影响了元素的一些外观之类的时候（例如，背景色，边框颜色，文字颜色等），此时只需要应用新样式绘制这个元素就 OK 了，这个过程称为 Repaint。  
　　所以说 Reflow 的成本比 Repaint 的成本高得多的多。DOM 树里的每个结点都会有 reflow 方法，一个结点的 reflow 很有可能导致子结点，甚至父点以及同级结点的 reflow。

## 怎么造成

**下面这些动作有很大可能会是成本比较高的**：

1. 增加、删除、修改 DOM 结点时，会导致 Reflow 或 Repaint。
2. 移动 DOM 的位置，或是搞个动画的时候。
3. 内容发生变化。
4. 修改 CSS 样式的时候。
5. Resize 窗口的时候（移动端没有这个问题），或是滚动的时候。
6. 修改网页的默认字体时。

**基本上来说，reflow 有如下的几个原因：**

1. Initial，网页初始化的时候。
2. Incremental，一些 js 在操作 DOM 树时。
3. Resize，其些元件的尺寸变了。
4. StyleChange，如果 CSS 的属性发生变化了。

## 如何减少

1. 减少 DOM 操作
   创建一个 documentFragment,DOM 操作都在 documentFragment 上执行,最后再把它挂载到他的父节点上

   ```js
   let container = document.getElementById('container');
   let content = document.createDocumentFragment();
   for (let i = 0; i < 10; i++) {
     let li = document.createElement('li');
     li.innerHTML = 'li' + i;
     content.appendChild(li);
   }
   container.appendChild(content);
   ```

2. 减少强制同步布局
   避免读取一会引发回流/重绘的属性, 如果确实需要多次使用, 就用一个变量缓存起来
   如:读写 offset 家族 scroll 家族和 client 家族属性,以及 getcomputedStyle()方法和 getBoundingClienReact()方法.浏览器会立刻清空队列
   > 现代浏览器会对频繁的回流和重绘操作进行优化,浏览器会维护一个队列,把所有的回流和重绘操作放入队列中, 如果队列中的任务数量或者时间间隔达到一个阈值,浏览器就会将队里清空,进行一次批处理,这就可以把多个回流操作变成一次
3. DOM 脱离文档流
   使用 absolute 或者 fixed 让元素脱离普通文档流, 使用绝对定位会使该元素单独成为渲染树 body 的一个子元素

4. css3 硬件加速(GPU 加速)
   使用过 css3 硬件加速,可让 transform,opacity,filters 这些动画不会引起回流重绘,但是对于动画的其他属性
   常见的触发硬件加速的 css 属性
   `transform`,`opacity`,`filters`
5. requestAnimationFrame
   改方法告诉浏览器你希望执行一个动画,并要求浏览器在下次重绘之前调用指定的回调函数更新动画,该方法需要传入一个回调函数作为参数, 该返回参数会在浏览器下一次重绘之前执行
6. DOM 离线处理，减少回流重绘次数
   线的 DOM 不属于当前 DOM 树中的任何一部分，这也就意味着我们对离线 DOM 处理就不会引起页面的回流与重绘

- 使用`display: none`，上面我们说到了 (`display: none`) 将元素从渲染树中完全移除，元素既不可见，也不是布局的组成部分，之后在该 DOM 上的操作不会触发回流与重绘，操作完之后再将`display`属性改为显示，只会触发这一次回流与重绘。

​ 提醒 ⏰：`visibility : hidden` 的元素只对重绘有影响，不影响重排。

- 通过 [documentFragment](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FDocumentFragment 'https://developer.mozilla.org/zh-CN/docs/Web/API/DocumentFragment') 创建一个 `dom` 文档片段,在它上面批量操作 `dom`，操作完成之后，再添加到文档中，这样只会触发一次重排。

```js
const el = document.querySelector('.box');
const fruits = ['front', 'nanjiu', 'study', 'code'];
const fragment = document.createDocumentFragment();
fruits.forEach((item) => {
  const li = document.createElement('li');
  li.innerHTML = item;
  fragment.appendChild(li);
});
el.appendChild(fragment);
复制代码;
```

- 克隆节点，修改完再替换原始节点

```js
const el = document.querySelector('.box');
const fruits = ['front', 'nanjiu', 'study', 'code'];
const cloneEl = el.cloneNode(true);
fruits.forEach((item) => {
  const li = document.createElement('li');
  li.innerHTML = item;
  cloneEl.appendChild(li);
});
el.parentElement.replaceChild(cloneEl, el);
```

**tip**  
本文通过对从输入 URL 到页面展现对了过程详细的归纳,这个过程设计较多的知识点,我对部分做了归纳,如果有不足之处希望能够指出  
参考文献  
[从输入 url 到页面展现发生了什么?  
](https://segmentfault.com/a/1190000013522717)
