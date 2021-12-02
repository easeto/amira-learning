import React from 'react';

export default class Caret extends React.Component {
  render() {
    const { iconClass="", down=false } = this.props;

    return (
      <span className={iconClass + (down ? ' caret-icon-down' : '')}>
        <svg height="20" width="20" aria-hidden="true">
          <path d="M4.516 7.548c.436-.446 1.043-.481 1.576 0L10 11.295l3.908-3.747c.533-.481 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615-.406.418-4.695 4.502-4.695 4.502a1.095 1.095 0 0 1-1.576 0S4.924 9.581 4.516 9.163s-.436-1.17 0-1.615z"/>
        </svg>
      </span>
    )
  }
}