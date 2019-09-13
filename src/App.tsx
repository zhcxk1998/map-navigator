import * as React from 'react';
import Hammer from 'react-hammerjs';
import { Grid, Button } from 'antd-mobile';
import './App.scss';

import Anchor from './components/Anchor'

import 'antd-mobile/dist/antd-mobile.css';

interface IProps {

}

interface IState {
  x: number,
  y: number,
  translateX: number,
  translateY: number,
  scale: number,
  scaleString: string,
  translateString: string,
  activedIndex: number
}

class App extends React.Component<IProps, IState> {

  constructor(props: any) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      translateX: 0,
      translateY: 0,
      scale: 1,
      scaleString: 'scale3d(1,1,1)',
      translateString: 'translate3d(0px,0px,0px)',
      activedIndex: -1
    }
  }

  componentDidMount() {
    // const pos = [{
    //   x: 154, y: 193
    // }, {
    //   x: 63, y: 121
    // }, {
    //   x: 132, y: 39
    // }, {
    //   x: 54, y: 43
    // }, {
    //   x: 121, y: 236
    // }]
    // pos.map((item, index) => {
    //   const { x, y } = item
    //   const dom = document.getElementById('test')
    //   const infoNode = document.createElement('div');
    //   infoNode.setAttribute('class', 'anchor')
    //   infoNode.style = `top:${y}px;left:${x}px`
    //   dom.appendChild(infoNode);
    // }, 100)
  }

  handleTap = (e: any) => {
    // console.log(e)
  }

  handlePan = (e: any) => {
    const { translateX, translateY } = this.state;
    const { deltaX, deltaY } = e;
    const RandomColor = () => "#" + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0");
    const color = RandomColor();
    // console.log(x, deltaX)
    const scale = Math.random() > 0.5 ? '-' + Math.random() * 1.5 : Math.random() * 1.5;
    const emoji = Math.ceil(Math.random() * 33).toString().padStart(2, '0');
    const dom = document.getElementById('test')
    // document.getElementById('container').style.background = color
    // dom.style['background-image'] = `url(http://cdn.algbb.cn/emoji/${emoji}.png)`
    dom.style.transform = `translate(${translateX + deltaX}px,${translateY + deltaY}px) ${this.state.scaleString}`
  }

  handlePanStart = (e: any) => {
    const { center: { x, y } } = e;
    this.setState({
      x, y
    })
    console.log('startX: ', this.state.x)
    console.log('tranlateX: ', this.state.translateX)
    console.log(this.state.translateString)
  }

  handlePanEnd = (e: any) => {
    const { deltaX, deltaY, center: { x, y } } = e;
    console.log('\nendX: ', x + '\n\n')
    const dom = document.getElementById('test')
    // dom.style.transform = `translate(${deltaX+dom.offsetWidth}px,${deltaY+dom.offsetHeight}px)`
    // dom.style.transform = `translate(${deltaX}px,${deltaY}px)`
    const translateX = x - this.state.x + this.state.translateX
    const translateY = y - this.state.y + this.state.translateY
    const translateString = `translate3d(${translateX}px,${translateY}px,0px)`
    this.setState({
      translateX,
      translateY,
      x, y,
      translateString
    })
  }

  handlePinOut = (e: any) => {
    const dom = document.getElementById('test')
    dom.style.transform = 'scale(5,5)'
  }

  handleOut = () => {
    const { scale } = this.state
    const dom = document.getElementById('test')
    const newScale = scale + 0.5
    const scaleString = `scale3d(${newScale},${newScale},${newScale})`
    this.setState({
      scale: newScale,
      scaleString
    })
    dom.style.transform = scaleString + ' ' + this.state.translateString
  }

  handleIn = () => {
    const { scale } = this.state
    const dom = document.getElementById('test')
    const newScale = scale - 0.5
    const scaleString = `scale3d(${newScale},${newScale},${newScale})`
    this.setState({
      scale: newScale,
      scaleString
    })
    dom.style.transform = scaleString + ' ' + this.state.translateString
  }

  handleAnchorClick(index: number, e: any) {
    e.stopPropagation()
    this.setState({
      activedIndex: index
    })
  }

  handleMaskClick() {
    console.log('mask')
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
    }
      , {
      left: 63, top: 121
    }, {
      left: 132, top: 39
    }, {
      left: 54, top: 43
    }, {
      left: 120, top: 236
    }, {
      left: 90, top: 148
    }
    ]

    return (
      <div className='container' id='container'>
        <div className='mask' style={{ display: activedIndex !== -1 ? 'block' : 'none' }}></div>
        <Button className='scale-button' onClick={this.handleOut}>+</Button>
        <Button className='scale-button' onClick={this.handleIn}>-</Button>
        <Hammer onPan={this.handlePan} onPanStart={this.handlePanStart} onPanEnd={this.handlePanEnd} onPinchOut={this.handlePinOut} direction='DIRECTION_ALL' options={options}>
          <div className='test' id='test' onClick={this.handleMaskClick.bind(this)}>
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
