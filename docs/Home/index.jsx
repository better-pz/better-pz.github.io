/* eslint no-undef: 0 */
/* eslint arrow-parens: 0 */
import React from 'react';
import { enquireScreen } from 'enquire-js';

// import Nav3 from './Nav3';
import Banner1 from './Banner1';
import Footer0 from './Footer0';
import Content9 from './Content9';
// import Feature3 from './Feature3';
import Feature5 from './Feature5';
// import Feature4 from './Feature4';

import {
  // Nav30DataSource,
  Banner10DataSource,
  // Footer01DataSource,
  Content90DataSource,
  // Feature30DataSource,
  Feature50DataSource,
  // Feature40DataSource,
  Footer02DataSource,
} from './data.source';
import './less/antMotionStyle.less';

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

const { location = {} } = typeof window !== 'undefined' ? window : {};

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile,
      show: !location.port, // 如果不是 dva 2.0 请删除
    };
  }

  componentDidMount() {
    // 适配手机屏幕;
    enquireScreen((b) => {
      this.setState({ isMobile: !!b });
    });
    // dva 2.0 样式在组件渲染之后动态加载，导致滚动组件不生效；线上不影响；
    /* 如果不是 dva 2.0 请删除 start */
    if (location.port) {
      // 样式 build 时间在 200-300ms 之间;
      setTimeout(() => {
        this.setState({
          show: true,
        });
      }, 500);
    }
    /* 如果不是 dva 2.0 请删除 end */
  }

  render() {
    const children = [
      // <Nav3
      //   id="Nav3_0"
      //   key="Nav3_0"
      //   dataSource={Nav30DataSource}
      //   isMobile={this.state.isMobile}
      // />,
      <Banner1
        id="Banner1_0"
        key="Banner1_0"
        dataSource={Banner10DataSource}
        isMobile={this.state.isMobile}
      />,
      // <Footer0
      //   id="Footer0_1"
      //   key="Footer0_1"
      //   dataSource={Footer01DataSource}
      //   isMobile={this.state.isMobile}
      // />,
      <Content9
        id="Content9_0"
        key="Content9_0"
        dataSource={Content90DataSource}
        isMobile={this.state.isMobile}
      />,
      // <Feature3
      //   id="Feature3_0"
      //   key="Feature3_0"
      //   dataSource={Feature30DataSource}
      //   isMobile={this.state.isMobile}
      // />,
      // <Feature5
      //   id="Feature5_0"
      //   key="Feature5_0"
      //   dataSource={Feature50DataSource}
      //   isMobile={this.state.isMobile}
      // />,
      // <Feature4
      //   id="Feature4_0"
      //   key="Feature4_0"
      //   dataSource={Feature40DataSource}
      //   isMobile={this.state.isMobile}
      // />,
      <Footer0
        id="Footer0_2"
        key="Footer0_2"
        dataSource={Footer02DataSource}
        isMobile={this.state.isMobile}
      />,
    ];
    return (
      <div
        className="templates-wrapper"
        ref={(d) => {
          this.dom = d;
        }}
      >
        {/* 如果不是 dva 2.0 替换成 {children} start */}
        {this.state.show && children}
        {/* 如果不是 dva 2.0 替换成 {children} end */}
      </div>
    );
  }
}
