import React from 'react';

// TODO Implement empty state for each student who isn't associated with a score ASAP,
// and stop using this component (tracking and benchmark)
export default class PageStatus extends React.Component {
  render() {
    let title = "No scores available yet";
    let endText = "";
    if(this.props.equated) {
      title = 'No adjusted scores available yet';
      endText = 'Switch to the "Unadjusted (raw scores)" score type to view reporting on all activity.';
    }

    if(this.props.isAggregateReport) {
      let promptText = "work with Amira";
      if(this.props.equated) {
        promptText = "complete an activity that supports score adjustment with Amira";
      }
      return (
        <div className="reportsNoStudentsNotice">
          <div> {title} </div>
          Once your students {promptText}, you will be able to view their {this.props.viewText} here. {endText}
        </div>
      );
    } else {
      let promptText = "works with Amira";
      if(this.props.equated) {
        promptText = "completes an activity that supports score adjustment with Amira";
      }
      return (
        <div className="reportsNoStudentsNotice">
          <div> {title} </div>
          Once your student {promptText}, you will be able to view their {this.props.viewText} here. {endText}
        </div>
      );
    }

  }
}
