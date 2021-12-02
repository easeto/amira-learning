import React from 'react';
import PropTypes from 'prop-types';
import FaArrowRight from 'react-icons/lib/fa/arrow-right';
import cx from 'classnames';

export const buttonTypes = {
  next: 'next',
}

const buttons = {
  next: {
    icon: FaArrowRight,
  },
}

export class Button extends React.Component {
  onClick() {
    this.props.onClick();
  }

  render() {
    const { type } = this.props;
    const button = buttons[type];
    const classes = cx({
      'button': true,
      'primary': this.props.primary || true,
      'disabled': this.props.disabled,
      [type]: true,
    });

    return (
      <div className={classes} onClick={this.onClick.bind(this)}>
        { button.icon({size: '70', className: 'buttonSvg'}) }
      </div>
    );
  }
}

Button.propTypes = {
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  primary: PropTypes.bool,
  disabled: PropTypes.bool,
}

Button.defaultProps = {
  primary: true,
  disabled: false,
}
