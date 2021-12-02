import React, { Fragment } from 'react';
import Reader from '../Reader/Reader';
import ReactAudioPlayer from 'react-audio-player';
import {calculateWCPM, calculateAccuracy} from '../Reader/ReaderLibrary';
import { saveScoredAssessment, paginateStory, getScoredStory } from "../../services/API";
import { makeStringPosessive } from "../../services/util";
import Tour from 'reactour';
import RunningRecord from '../Teacher/RunningRecord';
import Loading from '../Global/Loading';
import Toggle from '../Global/Toggle';
import {assignmentTypes} from '../../constants/constants';
import { statusType } from "../../services/displayStatus";
import studentRecordService from '../../services/StudentRecordService';
import WaitModal from '../Reader/WaitModal';
import {COPY_STRINGS} from '../../constants/translatedCopy';
import { educatorSupportHelpLinks } from '../../constants/helpLinks';
import checkMarkImage from '../../images/Scoring-checkmark-33.svg';

export default class CorrectionManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scoringComplete: true,
      scoredStory: {
        audio: {
          src: null,
        },
        updatedAt: new Date(),
        student: {},
      },
      errors: [[]],     // the updated list of errors for this assessment
      squashedErrors: [],
      stats: {
        selfCorrections: [],
        skips: [],
        mispronunciations: [],
      },
      wcpmScore: 0,       // the current wcpm score to display at the top. TODO: replace this with a more meaningful metric
      accuracyScore: 0,
      modified: false,    // whether or not the errors have been modified since the last save
      isTourOpen: false,  // whether or not in context help is currently open
      demoClick: null,    // the callback function passed up from <Word/> to toggle an example word during the app tour
      readerPhrases: [],
      runningRecord: false,
      styleUnscoredWords: false,
    }

    this.saveAssessment = this.saveAssessment.bind(this);
    this.setErrors = this.setErrors.bind(this);
    this.setErrorsFromReader = this.setErrorsFromReader.bind(this);
    this.setPhraseErrors = this.setPhraseErrors.bind(this);
    this.setDemoClick = this.setDemoClick.bind(this);
    this.closeTour = this.closeTour.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.setStats = this.setStats.bind(this);
  }

  componentDidMount(){
    const { activityId } = this.props.match.params;

    if(activityId){
      getScoredStory(activityId).then((scoredStory) => {

        //account for instances where the error array is broken apart incorrectly
        let squashedErrors = this.squashErrors(scoredStory.errors);
        let unSquashedErrors = this.unSquashErrors(squashedErrors, scoredStory);

        this.setState({
          scoredStory: scoredStory,
          errors: unSquashedErrors,
          squashedErrors: squashedErrors,
          phraseBreaks: this.getPhraseBreaks(scoredStory.errors),
          wcpmScore: calculateWCPM(scoredStory.errors, scoredStory.timeRead),
          accuracyScore: calculateAccuracy(this.getNonFlaggedErrors([scoredStory.errors],scoredStory.flaggedPhrases)),
          readerPhrases: paginateStory(scoredStory.squashedStory).pages[0],
          stats: {
            selfCorrections: scoredStory.selfCorrections || [],
            skips: scoredStory.skips || [],
            mispronunciations: scoredStory.mispronunciations || [],
          },
          flaggedWords: this.getFlaggedWords(scoredStory.errors,scoredStory.flaggedPhrases),
          flaggedWordsInPhrases: this.getFlaggedWordsByPhrase(scoredStory.errors,scoredStory.flaggedPhrases),
          flaggedPhrases: JSON.parse(JSON.stringify(scoredStory.flaggedPhrases)),
          styleUnscoredWords: scoredStory.type === assignmentTypes.TUTOR,
        });
      });
    }
  }

  getNonFlaggedErrors(errors,flaggedPhrases){
    let adjustedErrors = errors[0].filter((error,index)=>{
      if(flaggedPhrases[index]){
        return !flaggedPhrases[index].triggered;
      }else{
        return true;
      }
    });

    return [adjustedErrors];
  }

  getFlaggedWords(errors,flaggedPhrases){
    if(!errors || !flaggedPhrases){
      return [];
    }
    let flaggedWords = [];
    let overallIndex = 0;

    errors.map((phraseErrors,index)=>{
      for(let wordIndex=0; wordIndex<phraseErrors.length; wordIndex++){
        flaggedWords[overallIndex] = (flaggedPhrases[index] && flaggedPhrases[index].triggered);
        overallIndex++;
      }
    });

    return flaggedWords;
  }

  getFlaggedWordsByPhrase(errors,flaggedPhrases){
    if(!errors || !flaggedPhrases){
      return [[]];
    }

    let flaggedWords = errors.map((phraseErrors,index)=>{
      let phraseFlags = [];
      for(let wordIndex=0; wordIndex<phraseErrors.length; wordIndex++){
        phraseFlags[wordIndex] = (flaggedPhrases[index] && flaggedPhrases[index].triggered);
      }
      return phraseFlags;
    });

    return flaggedWords;
  }

  //returns an error array with only one set of errors to match the squashed story
  squashErrors(errors){
    if(!errors){
      return [[]];
    }
    let newErrors = [];
    for(let i = 0; i < errors.length; i++){
      newErrors = newErrors.concat(errors[i]);
    }
    return [newErrors];
  }

  // TODO: fix error storage / phrase management so that this is not necessary
  unSquashErrors(errors, scoredStory=this.state.scoredStory){
    if(!errors){
      return [[]];
    }
    let remainingErrors = errors[0];
    let unSquashedErrors = [];
    for(let i = 0; i < scoredStory.phrases.length; i++){
      let phrase = scoredStory.phrases[i].text;
      let length = phrase.split(' ').length;
      unSquashedErrors.push(remainingErrors.slice(0, length));
      remainingErrors = remainingErrors.slice(length, remainingErrors.length);
    }
    return unSquashedErrors;
  }

  getPhraseBreaks(errors){
    if(!errors){
      return [];
    }
    let overallLength = 0;
    return errors.map((phrase)=>{
      overallLength += phrase.length;
      return overallLength;
    });
  }

  setErrorsFromReader(newErrors,newFlags,index){
    let phraseFlags = this.state.flaggedPhrases;

    //Once a word in the corrected phrase is hit, we mark the whole phrase as corrected
    if(phraseFlags.length > 0){
      let phrase=0;
      for(phrase=0;phrase<this.state.phraseBreaks.length;phrase++){
        if(index < this.state.phraseBreaks[phrase]) break;
      }

      if(phraseFlags[phrase]){
        phraseFlags[phrase].triggered = false;
      }
    }

    //from reader we have to index in to page 0 and then unsquash the errors before saving them
    this.setErrors(this.unSquashErrors([newErrors]),phraseFlags);

    this.setState({flaggedWords: this.getFlaggedWords(this.state.scoredStory.errors,phraseFlags), flaggedPhrases: phraseFlags});
  }

  // keep an updated copy of the errors for this assessment as the teacher makes changes
  setErrors(newErrors, flaggedPhrases, callback=null){
    let wrappedErrors = [newErrors];
    let squashedErrors = this.squashErrors(newErrors);
    this.setState({
      errors: newErrors,
      wcpmScore: calculateWCPM(wrappedErrors, this.state.scoredStory.timeRead),
      accuracyScore: calculateAccuracy(this.getNonFlaggedErrors(wrappedErrors,flaggedPhrases)),
      squashedErrors: squashedErrors,
      modified: true,
    }, callback);
  }

  setPhraseErrors(newPhraseErrors, phraseIndex, callback=null){
    let newErrors = this.state.errors;
    newErrors[phraseIndex] = newPhraseErrors;


    let phraseFlags = this.state.flaggedPhrases;

    //Once a word in the corrected phrase is hit, we mark the whole phrase as corrected
    if(phraseFlags){
      phraseFlags[phraseIndex].triggered = false;
    }

    this.setErrors(newErrors, phraseFlags, callback);
    this.setState({flaggedWordsInPhrases: this.getFlaggedWordsByPhrase(this.state.scoredStory.errors,phraseFlags),flaggedPhrases: phraseFlags});
  }

  setStats(newStats, callback){
    this.setState({
      stats: newStats,
      modified: true,
    }, callback);
  }

  //set the function to demo a word toggle in the tour
  setDemoClick(demoClickFunction){
    this.setState({
      demoClick: demoClickFunction,
    });
  }

  onDoneWaiting(){
    this.setState({modified: false});
    this.props.closeModal();
  }

  openWaitModal(){
    window.setTimeout(() => this.setState({scoringComplete: true}), 10000); //even if scoring is not complete, act as though it is after 10 seconds
    this.props.openModal(
      <WaitModal
        doneWaiting={this.isActivityScored.bind(this)}
        continue={this.onDoneWaiting.bind(this)}
        messageText = {COPY_STRINGS.scoring_wait_modal_text}
      />
    );
  }

  async saveAssessment(){
    //Update any flagged phrases that have been rescored
    if(this.state.flaggedPhrases){
      this.state.flaggedPhrases.map(async (phraseFlag,index)=>{
        if(this.state.scoredStory.flaggedPhrases[index].triggered !== phraseFlag.triggered){
          await studentRecordService.updateFlaggedPhrase(this.state.scoredStory.activityId,index,phraseFlag.triggered);
        }
      });
    }

    await saveScoredAssessment(this.state.scoredStory.activityId, this.state.errors, this.state.wcpmScore, this.state.stats.skips, this.state.stats.selfCorrections, this.state.stats.mispronunciations, this.state.scoredStory.timeRead, false);

    this.setState({
      scoringComplete: false,
    }, this.openWaitModal.bind(this));
  }

  closeTour(){
    this.setState({
      isTourOpen: false,
    });
  }

  isActivityScored(){
    // doing it this way instead of just passing the state through as a prop and doing the polling logic here in order to make use of the logic in WaitModal
    if(!this.state.scoringComplete){
      const { activityId } = this.props.match.params;
      studentRecordService.getActivity(activityId).then((response) => {
        if(!response || !response.data || !response.data.getActivity || !response.data.getActivity[0] || !response.data.getActivity[0].status){
          return;
        }
        let status = response.data.getActivity[0].status;
        this.setState({scoringComplete: status == statusType.SCORED});
      });
    }
    return this.state.scoringComplete;
  }

  // returns an array of tour step objects for reacttour. Currently this code is not reachable because this.state.isTourOpen is set to false.
  // TODO: finish tour
  getTourSteps(){
    const steps = [
      {
        selector: '',
        content: () => (
          <div className="helpContent">
            {"Welcome! You are currently grading " + makeStringPosessive(this.state.scoredStory.studentName) + " assessment. Click through this tour to see how to use Amira to correct the score"}
          </div>
        ),
      },
      {
        selector: '[data-tut="audio"]',
        content: () => (
          <div className="helpContent">
            {"Use the audio player to listen to the recording of " + makeStringPosessive(this.state.scoredStory.studentName) + " assessment."}
          </div>
        ),
      },
      {
        selector: '[data-tut="word"]',
        content: () => (
          <div className="helpContent">
            If you find a word that Amira has scored incorrectly, click the word to toggle the score
          </div>
        ),
        /*action: node => {
          this.state.demoClick && this.state.demoClick();
        },*/
      },
      {
        selector: '[data-tut="key"]',
        content: () => (
          <div className="helpContent">
            Green means correct, red means incorrect, and grey means that the student did not reach this part of the passage
          </div>
        ),
      },
      {
        selector: '[data-tut="score"]',
        content: () => (
          <div className="helpContent">
            As you correct the assessment, you will see the wcpm score change in real time
          </div>
        ),
        /*action: node => {
          this.state.demoClick && this.state.demoClick();
        },*/
      },
      {
        selector: '[data-tut="save"]',
        content: () => (
          <div className="helpContent">
            When you have finished scoring the assessment, click 'save' to save your changes.
          </div>
        ),
      },
    ];
    return steps;
  }

  toggleView(){
    this.setState({
      runningRecord: !this.state.runningRecord,
    });
  }

  getCorrectionUI(){
    return (this.state.runningRecord ?
      <RunningRecord
        setErrors={this.setPhraseErrors}
        errors={this.state.errors}
        scoredStory={this.state.scoredStory}
        stats={this.state.stats}
        setStats={this.setStats}
        flaggedWords={this.state.flaggedWordsInPhrases}
      />
      :
      <Reader
        phrases={this.state.readerPhrases}
        phraseBreaks={this.state.phraseBreaks}
        isFinal={true}
        scores={[[{totalErrors: this.state.squashedErrors[0]}]]}
        isCorrection={true}
        setErrors={this.setErrorsFromReader}
        setDemoClick={this.setDemoClick}
        pageIndex={0}
        readyToRead={true}
        config={this.props.config}
        flaggedWords={this.state.flaggedWords}
        phraseWordStylingEnabled={true}
        styleUnscoredWords={this.state.styleUnscoredWords}
      />
    );
  }

  render(){
    let loading = this.state.readerPhrases.length <= 0;

    // choose the header text. use the student's name if we have it, and the date if we don't
    let studentName = this.state.scoredStory.student.firstName  + " " + this.state.scoredStory.student.lastName;
    studentName = studentName.length <= 20 ? studentName : studentName.slice(0,17) + "...";
    studentName = makeStringPosessive(studentName);
    let activityType = this.state.scoredStory.type == assignmentTypes.ASSESSMENT ? "Assessment" : "Practice";
    let headerText = this.state.scoredStory.student.firstName
      ? `Scoring ${studentName} ${activityType}`
      : `Scoring ${activityType} from ${this.state.scoredStory.updatedAt.toLocaleDateString("en-US")}`;

    if(loading){
      headerText = "Scoring Reading Activity";
    }

    let controlsClass = "controls";
    let submitText = "SAVED";
    if(this.state.modified || this.state.isTourOpen){
      controlsClass += " active";
      submitText = "SAVE";
    }

    let correctionUI = this.getCorrectionUI();

    return (
      <div className="correction">
        <div className="header">
          <div className="leftContainer">
            <Toggle
              onToggle={this.toggleView.bind(this)}
              leftOptionName="Story"
              rightOptionName="Running Record"
              left={!this.state.runningRecord}
            />
          </div>
          {headerText}
          <div className={controlsClass}>
            {/*<div className="score" data-tut="score"> // this is temporarily disabled because currently the numbers don't match due to equating
              <div className="label">WCPM</div>
              <div className="value">{this.state.wcpmScore}</div>
            </div>*/}
            <div className="score" data-tut="score">
              <div className="label">ACCURACY</div>
              <div className="value">{this.state.accuracyScore + "%"}</div>
            </div>
            <div className="submit" data-tut="save" onClick={this.saveAssessment}>
              <div className="submitText">{submitText}</div>
              {!this.state.modified ? <div className="checkMarkContainer"><img src={checkMarkImage} className="checkMark"/></div> : null}
            </div>
          </div>
        </div>
        <div className="key" data-tut="key">
          <span className="dot correct"></span>
          <span className="label">Correct</span>
          <span className="dot error"></span>
          <span className="label">Incorrect</span>
          <span className="dot unread"></span>
          <span className="label">Not Read</span>
          <span className="dot flagged"></span>
          <span className="label">Flagged</span>
          {
            this.state.styleUnscoredWords &&
            <Fragment>
              <span className="dot stopWord"></span>
              <span className="label"><a className="noActivityLink" href={educatorSupportHelpLinks.practiceErrorDetection} target="_blank">Low Error Word</a></span>
              <span className="dot boundaryWord"></span>
              <span className="label">Last Word</span>
            </Fragment>
          }
        </div>
        <div className="correctionUIContainer">
          {loading ? <Loading /> : correctionUI}
        </div>
        <div className="audioWrapper" data-tut="audio">
          <ReactAudioPlayer
            src={this.state.scoredStory.audio.url}
            controls
          />
        </div>
        <Tour
          steps={this.getTourSteps()}
          isOpen={this.state.isTourOpen}
          onRequestClose={this.closeTour}
          rounded={5}
        />
      </div>
    );
  }
}