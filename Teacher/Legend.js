import React from 'react';
import cx from 'classnames';

// TODO legends need to be dynamic, based on current page AND current teacher selections

export default class Legend extends React.Component {
  render() {
    return (
      <div className="legendWrapper">
        <div className="reportsAdditionalSelectionTitle">LEGEND</div>
        <div className="legend">
          {this.props.items.map(({icon, colorBlockClass, contents}, i) => {
            let blockClass = cx({
              'legendItemBlock': true,
              'bad': (colorBlockClass == "bad"),
              'great': (colorBlockClass == "great"),
              'average': (colorBlockClass == "average"),
            })
            return (
              <div className="legendItem" key={i}>
                <div className={blockClass}>
                  {icon && <img className="icon" src={icon} alt=""/>}
                </div>
                {contents}
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}