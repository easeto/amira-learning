import React from 'react';
import { app } from '../Reports/values/ui';

export default class Error extends React.Component {
  render() {
    return (
      <div className="reportsNoStudentsNotice">
        <div> Error generating report </div>
        {app.errorHelpPrompt}
      </div>
    );
  }
}
