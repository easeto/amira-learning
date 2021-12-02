// External Dependencies
import React, { Fragment } from 'react';
import Amplify from 'aws-amplify';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import awsmobile from '../aws-exports.js';
import cx from 'classnames';
import ReactGA from 'react-ga'; // Google Analytics
import PropTypes from 'prop-types';

// Internal Dependencies
import Navigation from './Navigation';
import {getPaginatedStory, getSquashedStory, getAssessmentStory, getAssignment, getUserData, setUserData, getDefaultAssignment, endUserSession,message_receive} from '../services/API';
import studentRecordService from '../services/StudentRecordService';
import Modal from './Modal';
import { routeStore } from '../routes';
import config from '../config';
import {assignmentTypes,userTypes} from '../constants/constants';
import {COPY_STRINGS, setCopyStrings} from '../constants/translatedCopy';
import {ErrorModal, getErrorModalTypes} from './Reader/ErrorModal';
import HelpButton from './Teacher/HelpButton';
import Legend from './Teacher/Legend';
import {legendItems, dyslexiaRiskLegendItems} from '../constants/legend';
import {isMicAllowed} from "../services/environment"
import LanguageSettings from './Settings/LanguageSettings';
import {logSessionInfo} from '../services/logger';

//Note - this is meant to be persistent throughout the entire
// login session so do NOT clear it ever.
let activityStack = [];

export function getActivityStack(){
  return activityStack;
}

export function addToActivityStack(activity){
  activityStack.push(activity);
}

export function removeLastActivityFromStack(){
  return activityStack.pop();
}

class TeacherRoutes extends React.Component {
  render() {
    //These routes are only available to teachers
    if(this.props.userType == userTypes.TEACHER){
      return (
        <Switch>
          {routeStore.teacher.routes.map(({path, component:Component, ...rest}) =>
            <Route key={path} path={path} render={(props) => <Component {...props} {...this.props} {...rest} />} />
          )}
          <Route render={(props) => <Redirect to={routeStore.teacher.DEFAULT} {...props} />} />
        </Switch>
      );
    }
    return null;
  }
}

class SchoolAdminRoutes extends React.Component {
  render() {
    // These routes are only available to admins
    // Note that admins currently share identical routes
    if(this.props.userType == userTypes.SCHOOL_ADMIN){
      return (
        <Switch>
          {routeStore.SCHOOL_ADMIN.routes.map(({path, component:Component, ...rest}) =>
            <Route key={path} path={path} render={(props) => <Component {...props} {...rest} />} />
          )}
          <Route render={(props) => <Redirect to={routeStore.SCHOOL_ADMIN.DEFAULT} {...props} />} />
        </Switch>
      );
    }
    return null;
  }
}

class DistrictAdminRoutes extends React.Component {
  render() {
    // These routes are only available to admins
    // Note that admins currently share identical routes
    if(this.props.userType == userTypes.DISTRICT_ADMIN){
      return (
        <Switch>
          {routeStore.DISTRICT_ADMIN.routes.map(({path, component:Component, ...rest}) =>
            <Route key={path} path={path} render={(props) => <Component {...props} {...rest} />} />
          )}
          <Route render={(props) => <Redirect to={routeStore.DISTRICT_ADMIN.DEFAULT} {...props} />} />
        </Switch>
      );
    }
    return null;
  }
}

class StudentRoutes extends React.Component {
  render() {
    if(this.props.userType == userTypes.STUDENT && !this.props.forcedAssessment){
      return (
        <Switch>
          {this.props.children}
        </Switch>
      );
    }
    return null;
  }
}

class ForcedAssessment extends React.Component {
  render() {
    if(this.props.userType == userTypes.STUDENT && this.props.forcedAssessment){
      return (
        <Switch>
          {this.props.children}
        </Switch>
      );
    }
    return null;
  }
}

class App extends React.Component {
  constructor (props){
    super(props);
    this.state = {
      // user
      paginatedStory: null,
      pageIndex: 0,
      assignmentIndex: 0,
      coachMessage: {id: null, text: "Let's get started!", texttoread: null},
      interventions: {},    // an object containing our intervention functions, will be set via callback by Reader
                            // TODO: eventually we may want to add interventions from multiple parts of the app, not just reader. When that time comes, adjust this structure accordingly
      coachReady: getUserData().sessionData.isiPad || this.props.noAvatar, // if we're on iPad we're not going to load the coach, so we don't have to wait for it to be ready
      modal: null,
      ready: getUserData().userType == userTypes.TEACHER || getUserData().userType == userTypes.DISTRICT_ADMIN || getUserData().userType == userTypes.SCHOOL_ADMIN ? true : false,
      isReaderActive: getUserData().userType == userTypes.STUDENT ? true : false,//ChatBot will only  be available for Teachers
      forcedAssessment: null,
      orfMode: true,  //TODO: refactor when assignments carry the assignmentType information, and when ORF uses the same technique as other assignments
      error: false,
      readerKey: 0,
      midAssessment: false,   //whether or not we are currently in the middle of a not-yet-complete assessment
      micEnabled: false,
      micChecked: false,
    };

    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.setStory = this.setStory.bind(this);
    this.resetStory = this.resetStory.bind(this);
    this.setCoachMessage = this.setCoachMessage.bind(this);
    this.setInterventions = this.setInterventions.bind(this);
    this.coachReadyCallback = this.coachReadyCallback.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.muteReader = this.muteReader.bind(this);
    this.unMuteReader = this.unMuteReader.bind(this);
    this.clearAssignment = this.clearAssignment.bind(this);
    this.setMidAssessment = this.setMidAssessment.bind(this);
    this.logTimeOnStoryStart = this.logTimeOnStoryStart.bind(this);
    this.logTimeOnStoryEnd = this.logTimeOnStoryEnd.bind(this);
    this.saveSessionTime = this.saveSessionTime.bind(this);
    this.nextAssignment = this.nextAssignment.bind(this);
    this.forceDefaultAssignment = this.forceDefaultAssignment.bind(this);
    this.setParentAssignment = this.setParentAssignment.bind(this);
    this.openReadyModal = this.openReadyModal.bind(this);

    //TODO: This shouldn't be necessary after integrating with Router
    this.useNav = this.props.config.useNav;
    this.useMenu = this.props.config.useMenu;
    this.useCoach = !getUserData().sessionData.isiPad && !this.props.noAvatar;

    this.totalReadingTime = {
      start: null,
      end: null,
    };
  }

  componentDidMount(){
    // set up Google Analytics with React Router
    this.props.history.listen(location => ReactGA.pageview(location.pathname));
    let session = getUserData();

    //set the locale
    setCopyStrings(session.locale);

    if(getUserData().sessionData.isiPad && getUserData().userType == userTypes.TEACHER){
      this.setState({error: true, ready: false});
      this.openModal(
        <ErrorModal
          type={getErrorModalTypes().IPAD}
        />
      );
      return;
    }

    // prevent deep link to activity page
    if(location.pathname.includes("scoring")) {
      this.props.history.push("/teacher");
    }

    this.openReadyModal();

    // check whether or not there is a current pending assignment for this student
    getAssignment(session.userId).then(resp => {
      if(!getUserData().demoMode && resp && resp[0] && !this.props.forceTutor && !this.props.forceStory && !this.props.forceIntervention){
        let orfMode = (resp[0].type == assignmentTypes.ASSESSMENT);
        let parentAssignment = resp[0].activityId;
        this.setState({forcedAssessment: resp, orfMode: orfMode, parentAssignment: parentAssignment});
        if(resp[0].childIds && resp[0].childIds.length){
          activityStack = resp[0].childIds;
        }
      } else {
        if(session.userType == userTypes.STUDENT){
          this.props.history.push("/student/home");
        }
      }
    });

  }

  setLocale(locale){
    setUserData("locale", locale);
    this.setBilingualMode();
  }

  setBilingualModeLocale(bilingualLocale){
    setUserData("bilingualLocale", bilingualLocale);
    this.setBilingualMode();
  }

  setBilingualMode(){
    const { locale, bilingualLocale } = getUserData();
    const bilingualMode = (bilingualLocale && bilingualLocale !== locale);
    setUserData("bilingualMode", bilingualMode);
    setCopyStrings(bilingualMode ? bilingualLocale : locale);
  }

  forceDefaultAssignment(){
    let assignment = getDefaultAssignment();
    //If there isn't at least one activity, then this method will do nothing.
    if(assignment[0]){
      let orfMode = (assignment[0].type === assignmentTypes.ASSESSMENT)
      this.setState({forcedAssessment: assignment, orfMode: orfMode});
    }
  }

  setParentAssignment(newParentId){
    this.setState({parentAssignment: newParentId});
  }

  onStartButtonClicked(){
    if(!this.state.micEnabled && (getUserData().userType == userTypes.STUDENT)) {
      this.openModal(
        <ErrorModal
          type= {getErrorModalTypes().DISABLED_REFRESH}
          continue={this.openReadyModal}
        />,
      );
    }else{
      this.closeModal();
      this.setState({ready:true});
    }
  }

  onLanguageSettingsClose(locale){
    this.setBilingualModeLocale(locale);
    this.openReadyModal();
  }

  openReadyModal(){
    isMicAllowed().then((isMicAllowed) => {
      this.setState({micEnabled: isMicAllowed, micChecked: true});
      if(!this.state.ready && !this.state.error){
        let modalContent = (
          <div className="readyModal">
            <span className="labelFontOverride">{COPY_STRINGS.ready_to_start}</span>
            {this.state.coachReady ?
              <div className="startButton" onClick={this.onStartButtonClicked.bind(this)}>{COPY_STRINGS.lets_do_it}</div>
              : <div className="startButton disabled">{COPY_STRINGS.lets_do_it}</div>}
            {this.state.coachReady && !getUserData().bilingualMode &&
              <LanguageSettings
                className="readyModalSettings"
                setLocale={this.onLanguageSettingsClose.bind(this)}
                openModal={this.openModal}
              />
            }
          </div>
        );
        this.openModal(modalContent, {backgroundClose: false, key:"ready"});
      }
    });
  }


  // allows us to pass a custom close function to the modal. This is used to pass in
  // NULL if we want to close the modal via an internal button instead of the built in close feature
  openModal(content, props={}){
    let modal = (
      <Modal
        closeModal={props.close}
        delayedCloseButton={props.delayedCloseButton || false}
        closeButton={props.closeButton || false}
        backgroundClose={props.backgroundClose || false}
        key={props.key}>
        {content}
      </Modal>
    );

    this.setState({
      modal: modal,
    });
  }

  closeModal(){
    this.setState({
      modal: null,
    });
  }

  nextPage(callback=null){
    if(this.state.pageIndex < this.state.paginatedStory.pages.length - 1){
      this.setState({
        pageIndex: this.state.pageIndex + 1,
      }, callback);
    }
  }

  previousPage(){
    if(this.state.pageIndex > 0){
      this.setState({
        pageIndex: this.state.pageIndex - 1,
      });
    }
  }

  setInterventions(interventions){
    this.setState({
      interventions: interventions,
    });
  }

  resetStory(){
    this.setState({
      paginatedStory: null,
      pageIndex: 0,
      readerKey: this.state.readerKey + 1,  // increment the reader key each time we reset the story to ensure that we wipe the component state clean as well as simply wiping the story away
    });
  }

  saveSessionTime() {
    const { activityId } = getUserData();
    const timeSpent = this.totalReadingTime.end - this.totalReadingTime.start;

    studentRecordService.saveSessionTime(activityId, timeSpent);
  }

  //Log the time when the story finishes
  logTimeOnStoryEnd(){
    this.totalReadingTime.end = new Date();
    this.saveSessionTime();
  }

  //Log the time when the story loads
  logTimeOnStoryStart(){
    this.totalReadingTime.start = new Date();
  }

  //pulls a story based on ID, paginates that story, and sets it for the reader
  setStory(id, config, callback=null){
    if(config.assessmentMode){ // get the story in assessment format if this is assessment mode
      getAssessmentStory(id).then((paginatedStory) => {
        this.setState({paginatedStory}, callback);
      });
    } else if(config.squashedStory){  //squash the story if necessary
      getSquashedStory(id).then((paginatedStory) => {
        this.setState({paginatedStory}, callback);
      });
    } else {
      getPaginatedStory(id).then((paginatedStory) => {
        this.setState({paginatedStory}, callback);
      });
    }
  }

  setMidAssessment(){
    //there doesnt need to be a way to turn off this flag because we log out at the end of an assessment. if this changes, change this
    this.setState({midAssessment: true});
  }

  nextAssignment(){
    let newAssignmentIndex = this.state.assignmentIndex + 1;
    let bifurcatedAssignment = false;
    if(this.state.forcedAssessment
        && this.state.forcedAssessment[newAssignmentIndex]
        && this.state.forcedAssessment[newAssignmentIndex].type == assignmentTypes.ASSESSMENT){
      this.setState({orfMode: true});
    } else {
      this.setState({orfMode: false});
    }
    if(this.state.forcedAssessment &&
      this.state.forcedAssessment[newAssignmentIndex] &&
      this.state.forcedAssessment[this.state.assignmentIndex].locale !== this.state.forcedAssessment[newAssignmentIndex].locale &&
      getUserData().spanishConfig === "BOTH_TWO_SESSIONS"){
        bifurcatedAssignment = true;
      }
    this.setState({
      assignmentIndex: newAssignmentIndex,
      bifurcatedAssignment: bifurcatedAssignment
    });
  }

  getCoachMessage(){
    if(this.state.coachMessage){
      return this.state.coachMessage;
    } else if(this.state.pageIndex == 0){
      return ({id: Date.now(), text: "Let's get started!", texttoread: null});
    } else if(this.state.pageIndex >= this.state.paginatedStory.pages.length - 1){
      return ({id: Date.now(), text: "Great job! You finished the story!", texttoread: "Great job! You finished the story"});
    } else {
      return null;
    }
  }

  coachReadyCallback(inState){
    this.setState({coachReady: inState}, this.openReadyModal);
  }

  setCoachMessage(message){
    this.setState({
      coachMessage: {
        text: message.text || message,
        pronunciation: message.pronunciation || message.text || message,
        callback: message.callback,
        id: this.state.coachMessage ? this.state.coachMessage.id + 1 : 0,
        skipAvatar: (!this.useCoach) || (!!message.skipAvatar),
        passThroughSpeechTags: message.passThroughSpeechTags ? true : false,
      },
    });
  }

  // for now this does nothing because we want students to be permanently stuck in forced assessment mode for MVP.
  // Once we have real assignments, and want to provide access to the rest of the student experience,
  // this function will reset the forcedAssessment state and will call an API function to mark the assignment as completed
  clearAssignment(){
    return null;
  }

  //Don't let ChatBot receive a transcript,
  //instead channel the transcript to ReaderManager
  unMuteReader(){
    this.setState({
      isReaderActive: true,
    });
  }

  //Channel the transcript to ChatBot
  muteReader(){
    this.setState({
      isReaderActive: false,
    });
  }

  // display nav only for tutor mode
  getNav(){
    let renderNav = () => {
      return (
        <div className="NavigationContainer">
          <Navigation next={this.nextPage} previous={this.previousPage}/>
        </div>
      );
    };
    return(
      <Route exact path='/student/tutor' render={renderNav} />
    );
  }

  renderStudentHome(routerProps, speechProps){
    //it's easier and cleaner to pass this info through as props at this point, for this piece
    let session = getUserData();

    return (
      <div> </div>
    );
  }


  render() {
    //If the microphone is not enabled, all we can/should show is the modal
    if(!this.state.micChecked) return(this.state.modal);

    const { userType } = getUserData();

    /*
    * REDIRECTS
    * Handle initial redirect if necessary.
    * Doing this here rather than on inner route render so that surrounding styles don't get lost on loading screen
    */

    //Evaluate these bools here to make the code more readable below.
    let redirectToActivities = false;
    let redirectToAssessment = false;
    let redirectToHome = false;

    // Use if-else so we don't get multiple redirects. The way it worked before this was returning the redirects
    // directly, so there was an implicit priority. We need to put the redirects down in the <Speech> structure
    // rather than directly returning to prevent the whole tree from being torn down and rebuilt.
    if(userType == userTypes.TEACHER && !this.props.location.pathname.includes('teacher')){
      redirectToActivities = true;
    }else if(userType == userTypes.STUDENT && this.state.forcedAssessment && !this.props.location.pathname.includes('assessment')){
      redirectToAssessment = true;
    }else if(userType == userTypes.STUDENT && !this.props.location.pathname.includes('student')){
      redirectToHome = true;
    }
    /*******************************************************************/

    let isTeacher = this.props.location.pathname.includes('teacher') || this.props.location.pathname.includes('admin');
    let isScoring = this.props.location.pathname.includes('scoring'); //TODO: find a way to do this within router
    let paperStyle = !isTeacher || isScoring
    let readerContainerClasses = cx({
      'readerContainer': true,
      'reportBox' : !paperStyle,
      'fullScreen': !this.useCoach,
    });

    let readerClasses = cx({
      'reader': true,
      'paper' : paperStyle,
    });

    return (
      <Fragment>
        <div className="app">
          {redirectToActivities &&
            <Route render={(props) => <Redirect to='/teacher/gradebook/activities' {...props} />} />
          }
          <div className={readerContainerClasses}>
            <div className={readerClasses}>
              {this.state.modal}
              {this.state.ready &&
                <Fragment>
                  <TeacherRoutes userType={userType} openModal={this.openModal} closeModal={this.closeModal}/>
                </Fragment>
              }
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

App.propTypes = {
  location: PropTypes.object.isRequired
}

export default withRouter(App);