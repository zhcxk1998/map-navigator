import * as React from 'react';
import './index.scss';

interface IProps {
  activedIndex: number
  pos: Array<{ left: number, top: number }>,
  handleAnchorClick: (index: number) => void,
}

interface IState {
}

class Anchor extends React.Component<IProps, IState> {

  constructor(props: any) {
    super(props);
    this.state = {
    }
  }

  public render() {
    const { pos, handleAnchorClick, activedIndex } = this.props
    return (
      <div className='anchor-container' id='anchor-container'>
        {pos.map((item, index) => {
          const { left, top } = item
          return (
            <div className='anchor-wrap' style={{ left, top }}>
              <div className='anchor-img' onClick={handleAnchorClick.bind(this, index)} />
              <div className='info-container' style={{ display: activedIndex === index ? 'block' : 'none' }}>
              {/* <div className='info-container'> */}
                <div className='info-header'>
                  这是一个标题
                </div>
                <div className='info-content'>
                  这是景区描述这是景区描述这是景区描述这是景区描述这是景区描述这是景区描述这是景区描述这是景区描述这是景区描述这是景区描述这是景区描述这是景区描述这是景区描述这是景区描述这是景区描述这是景区描述这是景区描述这是景区描述
                </div>
                <div className='info-footer'>
                  <div className='action'>
                    xxx
                  </div>
                  <div className='action'>
                    xxx
                  </div>
                  <div className='action'>
                    xxx
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

    );
  }
}

export default Anchor;
