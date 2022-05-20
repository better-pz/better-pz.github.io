import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'Better Blog',
  mode: 'site',
  locales: [['zh-CN', '中文']],
  logo: '/images/logoMini.png',
  favicon: '/images/favicon.ico',
  navs: [
    null, // null 值代表保留约定式生成的导航，只做增量配置
    // {
    //   title: 'GitHub',
    //   path: 'https://github.com/better-pz',
    // },
    {
      title: '联系我',
      // path: '链接是可选的',
      // 可通过如下形式嵌套二级导航菜单，目前暂不支持更多层级嵌套：
      children: [
        {
          title: 'GitHub',
          path: 'https://github.com/better-pz',
        },
        {
          title: '掘金',
          path: 'https://juejin.cn/user/2999123453419294/posts',
        },
        {
          title: 'CSDN',
          path: 'https://blog.csdn.net/pz1021?spm=1000.2115.3001.5343',
        },
        { title: 'B站', path: 'https://space.bilibili.com/124681616' },
        { title: '公众号:程序员Better' },
      ],
    },
  ],
  // publicPath: '/dist',
  // more config: https://d.umijs.org/config
});
