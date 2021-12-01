import React from 'react';
import FaCog from 'react-icons/lib/fa/cog';
import MonitorAuth from './MonitorAuth';

const MONITOR_PASSWORD = "leyendo";

export default class LanguageSettings extends React.Component {
  constructor (props){
    super(props);
    this.openSettings = this.openSettings.bind(this);
    this.switchToSpanish = this.switchToSpanish.bind(this);
  }

  openSettings(){
    this.props.openModal(
      <MonitorAuth
        password = {MONITOR_PASSWORD}
        onSuccess = {this.switchToSpanish}
        title = "Enter password to switch to Spanish"
      />,
      {
        closeButton: true,
        close: () => {this.props.setLocale("en-us")},
      }
    );
  }

  switchToSpanish(){
    this.props.setLocale("es-mx");
  }

  render() {
    return (
      <div className={this.props.className + " languageSettings"}>
        <FaCog className="settingsIcon" size="24" onClick={this.openSettings}/>
      </div>
    );
  }
}
