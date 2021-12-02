import React from 'react';
import cx from 'classnames';
import FaArrowRight from 'react-icons/lib/fa/arrow-right';

export default class TextInput extends React.Component {
  constructor (props){
    super(props);
    this.state = {
      response: "",
      processing: false,
    };
    this.inputElement = React.createRef();
  }
  componentDidMount(){
    const node = document.getElementsByClassName(".input")[0];
    this.inputElement.current.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        this.submitResponse();
      }
    });
    if(!this.props.isInstruction){
      this.props.setTextResponse(" ");//make sure that if the student types nothing, the response is blank rather than null. TODO: find a less hacky way to do this
      this.inputElement.focus(); // TODO: investigate whether this is a bug. if so, change to this.inputElement.current.focus();
    }
  }
  componentDidUpdate(prevProps){
    if((prevProps.isInstruction && !this.props.isInstruction) || (prevProps.isRepeating && !this.props.isRepeating)){
      this.props.setTextResponse(" "); //make sure that if the student types nothing, the response is blank rather than null. TODO: find a less hacky way to do this
      this.inputElement.current.focus();
    }
  }
  submitResponse(){
    if(this.state.response  && this.state.response != ""){
      this.props.speech.abortSpeech();
      this.setState({processing: true}, () => {
        this.props.setTextResponse(this.state.response, true);
      });
    }
  }
  updateResponse(response){
    this.setState({response: response});
    this.props.setTextResponse(response);
  }
  render() {
    let containerClasses = cx({
      'textInputContainer': true,
      'testItemContainer': true,
    });

    let inputContainerClasses = cx({
      'inactive': this.props.isInstruction || this.state.processing,
      'assessmentTextInputContainer' : true,
      'outlined' : true,
    });

    let buttonClasses = cx ({
      'inactive': this.props.isInstruction || this.state.processing || !this.state.response || this.state.response == "",
      'submitButton': true,
    })

    return (
      <div className={containerClasses}>
        <div className={inputContainerClasses}>
          <input
            ref={this.inputElement}
            type='text'
            className="assessmentTextInput"
            spellCheck="false"
            disabled={this.props.isInstruction && 'disabled'}
            onChange={(event) => this.updateResponse(event.target.value)}
            value={this.state.response}
            autoCapitalize="none"
            autoCorrect="off"
          />
          <div className={buttonClasses} onClick={this.submitResponse.bind(this)}>
            <FaArrowRight size="70" className="forward buttonSvg"/>
            <div className="buttonLabel"></div>
          </div>
        </div>
      </div>
    );
  }
}
