import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'Better Blog',
  mode: 'site',
  locales: [['zh-CN', '中文']],
  logo: '/images/logoMini.png',
  favicon: '/images/favicon.ico',
  navs: [
    null, // null 值代表保留约定式生成的导航，只做增量配置
    {
      title: 'GitHub',
      path: 'https://github.com/better-pz',
    },
    // {
    //   title: '我有二级导航',
    //   path: '链接是可选的',
    //   // 可通过如下形式嵌套二级导航菜单，目前暂不支持更多层级嵌套：
    //   children: [
    //     { title: '第一项', path: 'https://d.umijs.org' },
    //     { title: '第二项', path: '/guide' },
    //   ],
    // },
  ],
  // publicPath: '/dist',
  // more config: https://d.umijs.org/config
});
