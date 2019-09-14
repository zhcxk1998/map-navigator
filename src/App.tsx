import * as React from 'react';
import Hammer from 'react-hammerjs';
import { Grid, Button } from 'antd-mobile';
import './App.scss';

import Anchor from './components/Anchor'

import 'antd-mobile/dist/antd-mobile.css';

interface App {
  tMatrix: Array<number>,
  initScale: number,
  dom: any,
  duration: string,
  ticking: boolean,
  posCenter: {
    x: number, y: number
  },
  lastTranslate: {
    x: number, y: number
  },
  lastCenter: {
    x: number, y: number
  },
  center: {
    x: number, y: number
  }
}

interface IProps {

}

interface IState {
  activedIndex: number
}

class App extends React.Component<IProps, IState> {

  constructor(props: any) {
    super(props)
    this.state = {
      activedIndex: -1
    }
    this.handlePanStart = this.handlePanStart.bind(this)
    this.handlePan = this.handlePan.bind(this)
    this.handlePinchStart = this.handlePinchStart.bind(this)
    this.handlePinch = this.handlePinch.bind(this)
    this.handleOut = this.handleOut.bind(this)
    this.handleIn = this.handleIn.bind(this)
  }

  componentDidMount() {
    this.tMatrix = [1, 0, 0, 1, 0, 0]
    this.initScale = 1
    this.dom = document.getElementById('map')
    this.ticking = false
    this.posCenter = this.point2D(0, 0)
    this.duration = ''
    this.lastTranslate = this.point2D(0, 0)
    this.lastCenter = this.point2D(this.dom.offsetWidth / 2, this.dom.offsetHeight / 2)
    this.center = this.lastCenter
  }

  updateElementTransform() {
    this.dom.style.transition = this.duration
    var tmp = this.tMatrix.join(',')
    this.dom.style.transform = 'matrix(' + tmp + ')'
    this.ticking = false
  }

  requestElementUpdate() {
    if (!this.ticking) {
      this.ticking = true
      this.updateElementTransform()
    }
  }

  point2D(x: number, y: number): { x: number, y: number } {
    return { x, y }
  }

  handlePanStart(e: any) {
    this.lastTranslate = this.point2D(this.tMatrix[4], this.tMatrix[5])
  }

  handlePan(e: any) {
    this.duration = ''
    this.tMatrix[4] = this.lastTranslate.x + e.deltaX
    this.tMatrix[5] = this.lastTranslate.y + e.deltaY

    this.requestElementUpdate()
  }

  handlePinchStart(e: any) {
    this.duration = ''
    this.lastTranslate = this.point2D(this.tMatrix[4], this.tMatrix[5])
    this.initScale = this.tMatrix[0] || 1
    this.posCenter = this.point2D(e.center.x, e.center.y)
    this.lastCenter = this.point2D(this.center.x + this.lastTranslate.x, this.center.y + this.lastTranslate.y)
    this.posCenter = this.point2D(e.center.x - this.lastCenter.x, e.center.y - this.lastCenter.y)

    this.requestElementUpdate()
  }

  handlePinch(e: any) {
    const translateScale = (1 - e.scale)
    this.tMatrix[0] = this.tMatrix[3] = this.initScale * e.scale
    this.tMatrix[4] = translateScale * this.posCenter.x + this.lastTranslate.x
    this.tMatrix[5] = translateScale * this.posCenter.y + this.lastTranslate.y

    /* 同时更改锚点的位置与缩放 */
    const dom = document.getElementById('anchor-container')
    const anchorList = Array.from(dom.childNodes)
    anchorList.map(item => {
      item.style.transform = `matrix(${1 / this.tMatrix[0]},0,0,${1 / this.tMatrix[0]},0,0)`
    })

    this.requestElementUpdate()
  }

  handleOut() {
    this.duration = '.3s ease all'
    const scale = this.initScale = this.initScale + 0.5
    this.tMatrix[0] = this.tMatrix[3] = scale
    this.tMatrix[4] = (1 - scale) * (this.lastCenter.x - this.center.x)
    this.tMatrix[5] = (1 - scale) * (this.lastCenter.y - this.center.y)

    // this.tMatrix[0] = this.tMatrix[3] = this.initScale * scale
    // this.tMatrix[4] = (1 - scale) * this.posCenter.x + this.lastTranslate.x
    // this.tMatrix[5] = (1 - scale) * this.posCenter.y + this.lastTranslate.y

    /* 同时更改锚点的位置与缩放 */
    const dom = document.getElementById('anchor-container')
    const anchorList = Array.from(dom.childNodes)
    anchorList.map(item => {
      item.style.transform = `matrix(${1 / scale},0,0,${1 / scale},${this.tMatrix[4]},${this.tMatrix[5]})`
    })

    this.requestElementUpdate();
  }

  handleIn() {
    this.duration = '.3s ease all'
    const scale = this.initScale = this.initScale - 0.5
    this.tMatrix[0] = this.tMatrix[3] = scale
    this.tMatrix[4] = (1 - scale) * (this.lastCenter.x - this.center.x)
    this.tMatrix[5] = (1 - scale) * (this.lastCenter.y - this.center.y)

    /* 同时更改锚点的位置与缩放 */
    const dom = document.getElementById('anchor-container')
    const anchorList = Array.from(dom.childNodes)
    anchorList.map(item => {
      item.style.transform = `matrix(${1 / scale},0,0,${1 / scale},${this.tMatrix[4]},${this.tMatrix[5]})`
    })

    this.requestElementUpdate();
  }

  handleAnchorClick(index: number, e: any) {
    e.stopPropagation()
    this.setState({
      activedIndex: index
    })
  }

  handleMaskClick() {
    this.setState({
      activedIndex: -1
    })
  }

  public render() {
    const { activedIndex } = this.state;
    const options = {
      touchAction: 'compute',
      recognizers: {
        pan: {
          enable: true
        },
        pinch: {
          enable: true
        }
      }
    };
    const name = [
      '路线', '景点', '卫生间', '停车场', '出入口', '交通', '服务', '其他'
    ]
    const data = Array.from(new Array(8)).map((_val, i) => ({
      icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
      text: name[i],
    }));
    const pos = [{
      left: 154, top: 193
    }, {
      left: 63, top: 121
    }, {
      left: 132, top: 39
    }, {
      left: 54, top: 43
    }, {
      left: 120, top: 236
    }, {
      left: 90, top: 148
    }]

    return (
      <div className='container' id='container'>
        <div className='mask' style={{ display: activedIndex !== -1 ? 'block' : 'none' }}></div>
        <Button className='scale-button' onClick={this.handleOut}>+</Button>
        <Button className='scale-button' onClick={this.handleIn}>-</Button>
        <Hammer onPan={this.handlePan} onPanStart={this.handlePanStart} onPinchStart={this.handlePinchStart} onPinch={this.handlePinch} direction='DIRECTION_ALL' options={options}>
          <div className='map' id='map' onClick={this.handleMaskClick.bind(this)}>
            <Anchor pos={pos} handleAnchorClick={this.handleAnchorClick.bind(this)} activedIndex={activedIndex} />
          </div>
        </Hammer>
        <div className='grid-container'>
          <Grid data={data} activeStyle={false} />
        </div>
      </div>
    );
  }
}

export default App;
