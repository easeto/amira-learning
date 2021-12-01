import React from 'react';
import {COPY_STRINGS} from "../../constants/translatedCopy";
import Progress from 'react-progressbar';

let pollTimeout = null;
let cancelTimeout = null;

export default class WaitModal extends React.Component {
  constructor (props){
    super(props);
    this.continue = this.continue.bind(this);
    this.poll = this.poll.bind(this);
    this.state = {progress: 0};
  }

  componentDidMount(){
    pollTimeout = window.setTimeout(this.poll,500);
    if(this.props.timeOut){
      cancelTimeout = window.setTimeout(this.continue,this.props.timeOut);
    }else{
      cancelTimeout = null; //just to be safe
    }
  }

  continue(){
    if(pollTimeout){
      window.clearTimeout(pollTimeout);
    }

    if(cancelTimeout){
      window.clearTimeout(cancelTimeout);
    }

    pollTimeout = null;
    cancelTimeout = null;
    this.props.continue && this.props.continue();
  }

  poll(){
    if(this.props.doneWaiting && this.props.doneWaiting()){
      this.continue();
    }else{
      if(this.props.progress){
        this.setState({progress: this.props.progress()});
      }
      pollTimeout = window.setTimeout(this.poll,500);
    }
  }

  componentWillUnmount(){
    if(pollTimeout){
      window.clearTimeout(pollTimeout);
    }

    if(cancelTimeout){
      window.clearTimeout(cancelTimeout);
    }
  }

  render() {
    // TODO add links to help button
    return (
      <div className="restartModal">
        <div className="alert">{this.props.titleText || COPY_STRINGS.wait_modal_title}</div>
        <div className="explanation labelFontOverride">
          {this.props.messageText || COPY_STRINGS.wait_modal_text}
        </div>
        {this.props.progress &&
          <div>
            <Progress completed={this.state.progress} color="#66cc99"/>
          </div>
        }
      </div>
    );
  }
}