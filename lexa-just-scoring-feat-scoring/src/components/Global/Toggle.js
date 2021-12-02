import React from 'react';
export default class Toggle extends React.Component {
  constructor (props){
    super(props);
  }

  //note: this is designed as a controlled component. it does not track its own toggle state,
  //  and expects that to come through as the `left` prop. This is because the parent components of this component
  //  will need to track the toggle state anyway in order to make use of the info from this input. Therefore it is
  //  better not to have the same state in two places and introduce the possibility of it getting out of sync
  toggle(){
  	this.props.onToggle();
  }

  shouldWrap(label){
  	return label.length > 6 && label.includes(" ");
  }

  render() {
    return (
      <div className={"toggleControl " + (this.props.className || "")} onClick={this.toggle.bind(this)}>
	      <div className={"switch left " + (this.props.left ? "active" : "inactive")}>
	      	<div className={this.shouldWrap(this.props.leftOptionName) ? "wrapAround" : ""}>{this.props.leftOptionName}</div>
      	</div>
	      <div className={"switch right " + (this.props.left ? "inactive" : "active")}>
	      	<div className={this.shouldWrap(this.props.rightOptionName) ? "wrapAround" : ""}>{this.props.rightOptionName}</div>
      	</div>
	    </div>
    );
  }
}





