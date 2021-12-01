import React from 'react';
import { hasTimedOut } from '../../services/teacher/recentTeacherSelections';
import cx from 'classnames';

export default class ProgressBubbles extends React.Component {
  constructor (props){
    super(props);
  }

  render() {
    let progressBubblesStyles = cx({
     'progressBubbles': true,
     'smallBubbles': this.props.smallBubbles,
    });
    if(this.props.numBubbles <= 1){
      return null;
    } else if(this.props.numBubbles < 9){
      let bubbles = [];
      for(let i = 0; i < this.props.numBubbles; i++){
        let circleClass = "circle";
        if(i < this.props.selectedIndex && this.props.highlightPast){
          circleClass += " past";
        } else if(i == this.props.selectedIndex){
          circleClass += " current";
        } else {
          circleClass += " future";
        }
        bubbles.push(
          <span className={circleClass} key={"progressBubble" + i}/>
        );
      }
      return (
        <div className={progressBubblesStyles}>
          {bubbles}
        </div>
      );
    } else {
      return <div className={progressBubblesStyles}>{(this.props.selectedIndex + 1) + "/" + this.props.numBubbles}</div>
    }
  }
}

