import * as React from 'react';
import './index.scss';

interface IProps {
  // left: number,
  // top: number,
  pos: Array<{ left: number, top: number }>,
  handleAnchorClick: (index: number) => void,
  activedIndex:number
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
    const { pos, handleAnchorClick,activedIndex } = this.props
    return (
      <div>
        {pos.map((item, index) => {
          const { left, top } = item
          return (
            <div className='anchor-container' style={{ left, top }}>
              <div className='anchor-img' onClick={handleAnchorClick.bind(this,index)} />
              <div className='info-container' style={{ display: activedIndex === index ? 'block' : 'none' }}>
                <div className='info-header'>

                </div>
                <div className='info-content'>

                </div>
                <div className='info-footer'>

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
