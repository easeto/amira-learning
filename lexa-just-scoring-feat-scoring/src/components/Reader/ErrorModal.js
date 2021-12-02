import React from 'react';

import ear_icon from "../../images/ear_icon.svg";
import red_x from "../../images/red_x.svg";
import muted_icon from "../../images/muted_icon.svg";
import FaQuestion from 'react-icons/lib/fa/question-circle-o';
import {COPY_STRINGS} from '../../constants/translatedCopy';
import {endUserSession} from '../../services/API';

//this is a function so that the copy can be populated at run time
export function getErrorModalTypes(){
  return {
    AUDIO: {
      speech: COPY_STRINGS.kid_error_speech,
      text: COPY_STRINGS.audio_error_text,
      image: ear_icon,
      title: COPY_STRINGS.raise_your_hand,
      button: COPY_STRINGS.restart,
      largeIcon: true,
    },
    MUTE: {
      speech: COPY_STRINGS.kid_error_speech,
      text: COPY_STRINGS.mute_error_text,
      image: muted_icon,
      title: COPY_STRINGS.raise_your_hand,
      button: COPY_STRINGS.im_ready,
    },
    ERROR: {
      speech: COPY_STRINGS.kid_error_speech,
      text: COPY_STRINGS.error_text,
      image: red_x,
      title: COPY_STRINGS.raise_your_hand,
      button: COPY_STRINGS.logout_and_restart,
      reload: true,
    },
    COMPAT: {
      speech: null,
      text: COPY_STRINGS.compat_error_text,
      image: red_x,
      title: COPY_STRINGS.browser_not_supported,
      button: COPY_STRINGS.logout,
      reload: true,
    },
    COMPAT_OS: {
      speech: null,
      text: COPY_STRINGS.compat_error_text_os,
      image: red_x,
      title: COPY_STRINGS.os_not_supported,
      button: COPY_STRINGS.logout,
      reload: true,
    },
    COMPAT_MOBILE: {
      speech: null,
      text: COPY_STRINGS.compat_error_text_mobile,
      image: red_x,
      title: COPY_STRINGS.mobile_not_supported,
      button: COPY_STRINGS.logout,
      reload: true,
    },
    COMPAT_IPAD: {
      speech: null,
      text: COPY_STRINGS.compat_error_text_ipad,
      image: red_x,
      title: COPY_STRINGS.browser_not_supported,
      button: COPY_STRINGS.logout,
      reload: true,
    },
    IPAD: {
      speech: null,
      text: COPY_STRINGS.ipad_error_text,
      image: red_x,
      title: "Your device is not supported",
      button: "ok",
      reload: true,
    },
    DISABLED: {
      speech: COPY_STRINGS.kid_error_speech,
      text: COPY_STRINGS.disabled_error_continue,
      image: muted_icon,
      title: COPY_STRINGS.raise_your_hand,
      button: COPY_STRINGS.im_ready,
      helpLink: "https://www.amiralearning.com/home-support/enable-your-microphone"
    },
    DISABLED_REFRESH: {
      speech: COPY_STRINGS.kid_error_speech,
      text: COPY_STRINGS.disabled_error_text,
      image: muted_icon,
      title: COPY_STRINGS.raise_your_hand,
      button: COPY_STRINGS.logout,
      reload: true,
      helpLink: "https://www.amiralearning.com/home-support/enable-your-microphone"
    },
    BLANK: {
      speech: COPY_STRINGS.kid_error_speech,
      text: COPY_STRINGS.blank_error_text,
      image: ear_icon,
      title: COPY_STRINGS.raise_your_hand,
      button: COPY_STRINGS.logout,
      largeIcon: true,
    },
    NOSTORIES: {
      speech: COPY_STRINGS.no_stories_for_you,
      text: COPY_STRINGS.no_stories_for_you_text,
      title: COPY_STRINGS.all_stories_taken,
      button: COPY_STRINGS.logout,
      reload: true,
    },
    COMPAT_NO_SPANISH: {
      speech: null,
      text: COPY_STRINGS.compat_error_no_spanish,
      image: red_x,
      title: COPY_STRINGS.os_not_supported,
      button: COPY_STRINGS.im_ready,
    },
  };
}



export class ErrorModal extends React.Component {
  constructor (props){
    super(props);
    this.logout = this.logout.bind(this);
  }

  componentDidMount(){
    if(this.props.speech){
      let speechProps = {
        textToSpeak: this.props.type.speech,
      };
      this.props.speech.speak(speechProps);
    }
  }

  logout(){
    if(this.props.type.reload){
      endUserSession();
    } else {
      this.props.continue && this.props.continue();
    }
  }

  render() {

    let iconClassName = this.props.type.largeIcon ? "icon" : "icon error";

    // TODO add links to help button
    return (
      <div className="restartModal">
        <div className="alert">{this.props.type.title}</div>
        <div className="iconContainer"><img className={iconClassName} src={this.props.type.image}/></div>
        <div className="explanation labelFontOverride">
          {this.props.type.text}
        </div>
        <div className="restartButton primaryButton" onClick={this.logout}>{this.props.type.button}</div>
        {this.props.type.helpLink &&
          <a href={this.props.type.helpLink} target="_blank" className="studentHelpButton">
            <FaQuestion size="22" className="errorModalHelpIcon" />
            Help
          </a>
        }
      </div>
    );
  }
}
