import React from 'react';
import cx from 'classnames';

// For reference:
// https://codepen.io/mburnette/pen/LxNxNg
class SmallToggle extends React.Component {
  constructor (props) {
    super(props)

    this.onChange = this.onChange.bind(this);
  }

  onToggle() {
    if(this.props.onReceiveUserInput) {
      this.props.onReceiveUserInput();
    }
  }

  render() {
    return (
      <div
        onClick={this.onToggle}
        className="smallToggle">
        <input
          className="pillInput"
          type="checkbox"
          checked={this.props.checked}
        />
        <label className="pillLabel" htmlFor="switch"></label>
      </div>
    )
  }
}

SmallToggle.defaultProps = {
  onReceiveUserInput: null,
  checked: false,
}

export default SmallToggle;