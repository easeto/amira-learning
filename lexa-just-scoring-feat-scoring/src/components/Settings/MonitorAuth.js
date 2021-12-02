import React from 'react';
import cx from 'classnames';
import {COPY_STRINGS} from '../../constants/translatedCopy';

export default class MonitorAuth extends React.Component {
  constructor (props){
    super(props);
    this.state = {
      failed: false,
      inputValue: "",
    };
    this.checkPassword = this.checkPassword.bind(this);
    this.inputElement = React.createRef();
  }

  componentDidMount(){
    this.inputElement.current.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        this.checkPassword();
      }
    });
    this.inputElement.current.focus();
  }

  onInputChange(input){
    this.setState({
      inputValue: input,
    });
  }

  checkPassword(){
    if(this.state.inputValue == this.props.password){
      this.setState({failed: false}, this.props.onSuccess);
    } else {
      this.setState({failed: true}, () => {this.inputElement.current.focus()});
    }
  }

  render() {
    let inputStyles = cx({
      'passwordInput': true,
      'failed': this.state.failed,
    });
    return (
      <div className="monitorAuth">
        <div className="monitorAuthTitle labelFontOverride">{this.props.title}</div>
        <input
          type='password'
          ref={this.inputElement}
          className={inputStyles}
          onChange={(event) => this.onInputChange(event.target.value)}
          value={this.state.response}
          autoCapitalize="none"
          autoCorrect="off"
        />
        <div className="enterButton primaryButton" onClick={this.checkPassword}>{COPY_STRINGS.enter}</div>
      </div>
    );
  }
}





