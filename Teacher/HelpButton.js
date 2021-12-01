import React from 'react';
import FaQuestion from 'react-icons/lib/fa/question-circle-o';
import { teacherInProductHelpLinks } from '../../constants/helpLinks';

export default class HelpButton extends React.Component {
  render() {
    let help = teacherInProductHelpLinks.find(x => this.props.route.startsWith(x.pathname));
    return (
      <div className="helpButton">
        {help && <a className="helpButtonLink" href={help.link} target="_blank">
          <FaQuestion className="helpButtonIcon" size="22" />
          Help
        </a>}
      </div>
    );
  }
}
