import React from 'react';


import FaClose from 'react-icons/lib/fa/close';

/*
 * A modal component which dims and centers itself in the PARENT div (not the whole screen)
 */
export default class Modal extends React.Component {
  constructor (props){
    super(props);
    this.state = {
      addCloseButtonTimeout: null,
      closeButton: this.props.closeButton
    }
    this.childOnClick = this.childOnClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount(){
    if(this.props.delayedCloseButton){
      let addCloseButton = () => { 
        this.setState({
          closeButton: true,
          addCloseButtonTimeout: null,
        });
      }

      let addCloseButtonTimeout = window.setTimeout(addCloseButton, 10000);
      this.setState({
        addCloseButtonTimeout: addCloseButtonTimeout,
      });
    }
  }

  componentWillUnmount(){
    if(this.state.addCloseButtonTimeout){
      window.clearTimeout(this.state.addCloseButtonTimeout);
    }
  }

  closeModal(){
    if(this.state.addCloseButtonTimeout){
      window.clearTimeout(this.state.addCloseButtonTimeout);
    }
    this.props.closeModal();
  }

  //keep a click on the modal content from triggering the closeModal call
  childOnClick(e){
    e.stopPropagation();
  }

  render() {
    let closeButton = this.state.closeButton ? (
      <div className="closeButton" onClick={this.closeModal}>
        <FaClose size="28"/>
      </div>)
      : null;

    return (
      <div className="modalBackground" onClick={this.props.backgroundClose ? this.props.closeModal : null}>
        <div className="modalContainer" onClick={this.childOnClick}>
          {closeButton}
          {this.props.children}
        </div>
      </div>
    );
  }
}
