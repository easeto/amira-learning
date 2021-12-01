import React from 'react';
import ReactGA from 'react-ga';
import cx from 'classnames';
import cloneDeep from 'lodash.clonedeep';
import TextInput from '../Student/AssessmentItems/TextInput';
import {getUserData} from "../../services/API";
import {COPY_STRINGS} from '../../constants/translatedCopy';
import {NO_RESPONSE} from '../../constants/constants';
import {parseSkipTranslationTags} from "../../services/util";
import {isStopWord} from '../../services/interventionSelection';

const statusOptions = {
  ERROR: "error",
  SUCCESS: "success",
  UNREAD: "unread",
  PROCESSING: "processing",
  INTERVENTION: "intervention",
  FLAGGED: "flagged",
  BOUNDARY_WORD: "boundaryWord",
  STOP_WORD: "stopWord",
}

class Word extends React.Component {
  constructor (props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    // do nothing if the word is not clickable
    if(!this.props.clickable){
      return;
    }

    //if the word is clickable and we have a setPlacement function, we are in the reading tutor context
    //  and should set the placement. Otherwise, we are in the correction context and should toggle the status
    // TODO dis-entangle props for setPlacement and toggling status
    if(this.props.setPlacement){
      //this.props.setPlacement(this.props.index);
      //do nothing
      // TODO: re-enable click placement, both here and within the definition of "isClickable",
      // within the getMarkedPhrase method
    } else {

      // toggle between "error", "success", and "unread" for edge words,
      //  "stopWord" and "error" for stop words,
      //  and "error" and "success" for all other words
      let newStatus = "";
      if(this.props.status === statusOptions.ERROR){
        if(this.props.edgeWord){
          newStatus = statusOptions.UNREAD;
        } else if(isStopWord(this.props.word)){
          newStatus = statusOptions.STOP_WORD;
        } else {
          newStatus = statusOptions.SUCCESS;
        }
      } else if(this.props.status === statusOptions.SUCCESS){
        newStatus = statusOptions.ERROR;
      } else if(this.props.status === statusOptions.STOP_WORD){
        newStatus = statusOptions.ERROR
      } else {
        newStatus = statusOptions.SUCCESS;
      }
      // Log this click to google analytics
      this.logCorrection(newStatus);

      this.props.updateErrors(this.props.index, newStatus);
    }
  }

  // log the correction to google analytics for usage tracking
  logCorrection(status) {
    ReactGA.event({
      category: 'Activity Page Action',
      action: 'teacher corrected a word to status ' + status,
      label: this.props.word,
    });
  }

  // returns a function which triggers a toggle on an example word.
  // To be used in in context help, currently dead code
  getDemoClickFunction(){
    return function () {
      this.toggleStatus();
      window.setTimeout(this.toggleStatus, 3000);
    }
  }

  render(){
    let wordClass = "word " + this.props.status + this.props.className;
    if(this.props.highlighted){
      wordClass += " highlighted";
    }
    if(this.props.clickable){
      wordClass += " clickable";
    }

    // add special selector to 6th word for in context help

    return (<span className={wordClass} data-tut={this.props.index == 6 ? "word" : null} onClick={this.handleClick}>{this.props.word}</span>);
    /*if(this.props.index == 6){
      if(this.props.setDemoClick){
        this.props.setDemoClick(this.getDemoClickFunction().bind(this));
      }
    }*/
  }
}

export default class Phrase extends React.Component {
  constructor (props){
    super(props);

    this.state = {
      text: (this.props.phraseMetaData && this.props.phraseMetaData.instructions && this.props.phraseMetaData.instructions.text) || this.props.text,
      metaData: this.parseMetaData(this.props.phraseMetaData),
    }
    this.updateErrors = this.updateErrors.bind(this);
    this.handleStartOfPhrase = this.handleStartOfPhrase.bind(this);
  }

  componentDidMount(){
    if(this.props.isActive){
      this.handleStartOfPhrase()
    }
  }

  componentDidUpdate(prevProps){
    //For pages that have multiple phrases per page, hit the start of phrase stuff when they become active.
    if(!prevProps.isActive && this.props.isActive){
      this.handleStartOfPhrase();
    }
    if(prevProps.phraseMetaData && this.props.phraseMetaData && (prevProps.phraseMetaData.videoURL != this.props.phraseMetaData.videoURL || prevProps.phraseMetaData.assetURL != this.props.phraseMetaData.assetURL)){
      this.setState({
        text: this.props.text,
        metaData: this.parseMetaData(this.props.phraseMetaData),
      }, this.handleStartOfPhrase.bind(this));
    }
  }

  parseMetaData(phraseMetaData){
    let metaData = cloneDeep(phraseMetaData) || {};
    metaData = metaData.instructions || metaData;
    metaData.isVideo = metaData.videoURL || metaData.type === "readAloudVideo";

    if(metaData.isVideo && getUserData().sessionData.useIpadFallbacks){
      let {verbalInstructions=""} = metaData;
      metaData.verbalInstructions = `${verbalInstructions} ${COPY_STRINGS.intervention_strings.tap_play}`;
    }

    return metaData;
  }

  speakVerbalInstructions(verbalInstructions){
    let advanceMetaData = () => {
      this.setState({
        text: this.props.text,
        metaData: this.props.phraseMetaData,
      });
    }

    let onEnd = () => {
      // Only hit the startPhrase callback if there is no videoURL.
      // Otherwise let the video take care of it when it's done playing.
      if(this.state.metaData.isVideo && this.state.metaData.type !== "readAloudVideo"){
        advanceMetaData();
      }
      else if(this.state.metaData.transition){
        this.startTransition();
      }else {
        this.props.startPhrase();
        advanceMetaData();
      }
    }

    if(getUserData().bilingualMode){
      let parsedInstructions = parseSkipTranslationTags(verbalInstructions);
      if(this.props.skipIntros) parsedInstructions = [{textToSpeak: "Skipping Instructions"}];
      let bilingualSequenceToSpeak = {
        textToSpeak: parsedInstructions,
        passThroughSpeechTags: true,
        onEnd: onEnd,
      }
      this.props.speech.speakSequence(bilingualSequenceToSpeak);
    } else {
      if(this.props.skipIntros) verbalInstructions = "Skipping Instructions";
      let instructionSpeech = {
        textToSpeak: verbalInstructions,
        passThroughSpeechTags: true,
        onEnd: onEnd,
      }
      this.props.speech.speak(instructionSpeech);
    }

  }

  startTransition() {
    let state = this.state;
    state.metaData.type = "transition";
    this.setState(state);
  }

  onTransitionEnd(){
    this.setState({
      text: this.props.text,
      metaData: this.props.phraseMetaData,
    });
    this.props.startPhrase();
  }

  handleStartOfPhrase(){
    //If we have no verbal instructions or video to play, then hit the startPhrase callback
    if(!this.state.metaData || (!this.state.metaData.verbalInstructions && !this.state.metaData.transition && (!this.state.metaData.isVideo || this.state.metaData.type === "readAloudVideo"))){
      this.props.startPhrase && this.props.startPhrase();
    }else{
      if(this.state.metaData.verbalInstructions){
        this.speakVerbalInstructions(this.state.metaData.verbalInstructions);
      }
      else if (this.state.metaData.transition){
        this.startTransition();
      }
    }
  }

  // keep track of the new set of errors so that we can save teachers' changes when we are in correction mode
  // this will never be called when we are in tutor mode
  updateErrors(index, newStatus){
    let newErrors = this.props.errors;
    if(index < newErrors.length && newStatus === statusOptions.UNREAD){
      newErrors = newErrors.slice(0, index);
    } else {
      newErrors[index] = (newStatus === statusOptions.ERROR);
    }

    let newFlags = this.props.flaggedWords;
    if(newFlags){
      newFlags[index] = false;
    }

    this.props.setErrors(newErrors,newFlags,index);
  }

  isLastWordInPhrase(wordIndex){
    const {phraseBreaks = []} = this.props;
    return phraseBreaks.some(phraseBreak => wordIndex === (phraseBreak - 1));
  }

  isBoundaryWord(wordIndex){
    const {errors} = this.props;
    return wordIndex == errors.length - 1 //last marked word
        || wordIndex == errors.length;    // or first unmarked word
  }

  //wrap each word in a span with the appropriate classes to style it
  getMarkedPhrase(){
    let words = this.state.text.split(' ').filter(word => word != "" && word != " ");
    let markedPhrase = [];
    for(let i = 0; i < words.length; i++){
      const isBoundary = this.isBoundaryWord(i);
      let wordStatus = statusOptions.UNREAD;
      if(this.props.phraseWordStylingEnabled){ //disable word status styling in assessment mode
        if((isBoundary || this.isLastWordInPhrase(i)) && this.props.isCorrection && this.props.styleUnscoredWords){
          wordStatus = statusOptions.BOUNDARY_WORD;
        } else if(this.props.interventionWordIndex == i){
          wordStatus = statusOptions.INTERVENTION;
        } else if(this.props.errors[i]){
          if(this.props.final){
            wordStatus = statusOptions.ERROR;
          } else {
            wordStatus = statusOptions.PROCESSING;
          }
        } else if(isStopWord(words[i]) && this.props.isCorrection && this.props.styleUnscoredWords){
          wordStatus = statusOptions.STOP_WORD;
        } else {
          if (i < this.props.errors.length ){
            wordStatus = statusOptions.SUCCESS;
          }
        }

        //flagged status overrides all other statuses
        if(this.props.flaggedWords && this.props.flaggedWords[i]){
          wordStatus = statusOptions.FLAGGED;
        }
      }

      // Currently, the word is only clickable if we are in the teacher app,
      // and the word is either a scored word or an unread boundary word.
      // We will give setPlacement a value of 'true' in some student contexts
      // once we've worked through some UX concerns and placement manager issues.
      // TODO: set isClickable to true if setPlacement is true, after re-enabling placement
          // e.g. let isClickable = this.props.setPlacement || (this.props.isCorrection && !(wordStatus === statusOptions.UNREAD && !isBoundary));
      let isClickable = this.props.isCorrection && wordStatus !== statusOptions.BOUNDARY_WORD;

      markedPhrase.push(
        <Word
          updateErrors={this.updateErrors}
          status={wordStatus}
          highlighted={this.props.config.enableCurrentWordHighlight && i == this.props.highlightedWord}
          word={words[i]}
          key={"word"+i}
          index={i}
          edgeWord={isBoundary}
          clickable={isClickable}
          setPlacement={this.props.setPlacement}
          setDemoClick={this.props.setDemoClick}
          className={this.props.isCorrection ? " teacher" : ""}
        />
      );

      // separate with a space
      if(i < words.length - 1){
        markedPhrase.push(<span key={"space"+i}>{' '}</span>);  //TODO: think of a better way to do this
      }
    }
    return markedPhrase;
  }

  onVideoEnd(){
    console.log("in onVideoEnd");
    if(this.props.phraseMetaData.noInput){
      this.props.phraseTimeout();
    } else {
      this.props.startPhrase();
    }
  }

  getDisplayObject(){
    let isInstruction = (this.state.metaData && this.state.metaData.verbalInstructions) ? true : false;
    switch(this.state.metaData.type){
      case("textInput"):
        return <TextInput  key={"textInput" + this.state.text} text={this.state.text} isInstruction={isInstruction} isRepeating={this.props.isRepeating} setTextResponse={this.props.setTextResponse} speech={this.props.speech}/>;
      default:
        return this.getMarkedPhrase();
    }
  }

  render() {
    let markedPhrase = this.getMarkedPhrase();

    let storyLength = markedPhrase.length / 2; // divide by 2 because we are counting spaces. This is not 100% accurate since there is no trailing space, but it is close enough for our purposes

    // if this is such a long phrase that it would overflow reader, make the font smaller.
    // this will happen with longer stories in the assessment use case. For now, we will size it down a fixed amount.
    // In the future we can bring in screen size etc
    const shortStoryCutoff = 95;
    const longStoryCutoff = 170;
    const hasImage = this.state.metaData.imageURL;
    let phraseClasses = cx({
      "phrase": true,
      "pictureStory": hasImage,
      "shortStory": storyLength < shortStoryCutoff && !hasImage,
      "longStory": storyLength > longStoryCutoff && !hasImage,
      "highlightErrors": false,//process.env.STACK !== "PRODUCTION",
      [this.props.className]: this.props.className && true,
    });

    return(
      <div className={phraseClasses}>
        {this.getDisplayObject()}
      </div>
    );
  }
}
