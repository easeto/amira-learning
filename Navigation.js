import React from 'react';
import FaArrowRight from 'react-icons/lib/fa/arrow-right';
import FaArrowLeft from 'react-icons/lib/fa/arrow-left';

export default class Navigation extends React.Component {
  constructor (props){    
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <div className="navigation">
        <div className="backContainer buttonContainer" onClick={this.props.previous}>
          <FaArrowLeft size="24" className="back buttonSvg"/>
        </div>
        <div className="forwardContainer buttonContainer" onClick={this.props.next}>
          <FaArrowRight size="24" className="forward buttonSvg"/>
        </div>
      </div>
    );
  } 
}
