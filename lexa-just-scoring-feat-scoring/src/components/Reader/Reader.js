import React from 'react';
import Phrase from './Phrase';
import FaVolumeUp from 'react-icons/lib/fa/volume-up';
import {getUserData} from "../../services/API";
import {parseSkipTranslationTags} from "../../services/util";

export default class Reader extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      isRepeating: false,  // whether or not we are currently repeating the phrase instructions. This is here instead of in phrase because the repeat button lives outside of the phrase element, in the broader "Reader" container
    }
  }

  componentDidUpdate(prevProps){
    if(prevProps.repeatInstructions !== this.props.repeatInstructions){
      this.setState({isRepeating: false});
    }
  }

  //differentiate between phrases which have already been read, phrases which
  // are currently being read, and phrases which will be read in the future
  // so that we can style them differently
  getPhraseClass(index) {
    let phraseClass = "phrase";
    let isActive = false;

    // if we are correcting rather than reading, the the entire passage is current
    if(this.props.isCorrection){
      return phraseClass + " current";
    }

    if(index < this.props.currentPhraseIndex){
      phraseClass += " done";
    } else if(index === this.props.currentPhraseIndex){
      phraseClass += " current";
      isActive = true;
    } else {
      phraseClass += " future";
    }
    return {phraseClass:phraseClass, isActive:isActive};
  }

  // create the phrase ui elements.
  getPhrases() {
    return this.props.phrases.map((phrase, index) => {

      let highlightedWord = -1;
      if(index === this.props.currentPhraseIndex){
        highlightedWord = this.props.interventionWordIndex >= 0 ? this.props.interventionWordIndex : this.props.currentWordIndex;
      }

      let {pageIndex, scores} = this.props;

      let phraseScore = scores && scores[pageIndex] ? (scores[pageIndex][index] || {}): {};
      let phraseErrors = phraseScore.totalErrors || [];
      let isFinal = this.props.isFinal || (index !== this.props.currentPhraseIndex);
      let phraseMeta = this.getPhraseClass(index);

      return (
        <Phrase
          className={phraseMeta.phraseClass}
          isActive={phraseMeta.isActive}
          text={phrase}
          isNextPhraseVideo={this.props.isNextPhraseVideo}
          phraseMetaData={this.props.phraseMetaData}
          final={isFinal}
          errors={phraseErrors}
          highlightedWord={highlightedWord}
          interventionWordIndex={this.props.interventionWords ? this.props.interventionWords[index] : -1}
          key={(this.props.phraseMetaData && this.props.phraseMetaData.type == "video") ? "theOnlyDyslexiaVideoPhrase" : "phrase" + index + pageIndex}
          isCorrection={this.props.isCorrection}
          setErrors={this.props.setErrors}
          setDemoClick={this.props.setDemoClick}
          setPlacement={this.props.setPlacement}
          config={this.props.config}
          speech={this.props.speech}
          startPhrase={this.props.startPhrase}
          phraseTimeout={this.props.phraseTimeout}
          setTextResponse={this.props.setTextResponse}
          isRepeating={this.state.isRepeating}
          sendMessage={this.props.sendMessage}
          onSubmitQuiz={this.props.onSubmitQuiz}
          flaggedWords={this.props.flaggedWords}
          phraseWordStylingEnabled={this.props.phraseWordStylingEnabled}
          styleUnscoredWords={this.props.styleUnscoredWords}
          phraseBreaks={this.props.phraseBreaks}
          skipIntros={this.props.skipIntros}
        />
      );
    });
  }

  //TODO: abstract this and move it elsewhere
  repeatPhraseInstructions(){
    if(this.state.isRepeating){
      return;
    }
    if(this.props.repeatInstructions){
      this.props.onInstructionStart();
      this.setState({isRepeating: true}, () => {
        let onEnd = () => {
          this.setState({isRepeating: false});
          this.props.onInstructionEnd();
        };
        if(getUserData().bilingualMode){
          let parsedInstructions = parseSkipTranslationTags(this.props.repeatInstructions);
          let bilingualSequenceToSpeak = {
            textToSpeak: parsedInstructions,
            passThroughSpeechTags: true,
            onEnd: onEnd,
          }
          this.props.speech.speakSequence(bilingualSequenceToSpeak);
        } else {
          let instructionSpeech = {
            textToSpeak: this.props.repeatInstructions,
            passThroughSpeechTags: true,
            onEnd: onEnd,
          }
          this.props.speech.speak(instructionSpeech);
        }
      });
    }
  }

  getBranding(){
    let brand = this.props.storyBrand;
    if (brand){
      return (
        <div>
          {brand.logo && <img className="contentBrandLogo" src={brand.logo} />}
          {brand.copyright && <div className="readerFooter">{brand.copyright}</div>}
        </div>
      );
    }
  }

  render(){
    let title = this.props.storyTitle;
    let titleClass = "title"
    if(this.props.author && this.props.author != " "){
      title += " by " + this.props.author;
    }
    if(this.props.phraseMetaData && this.props.phraseMetaData.writtenInstructions){
      title = this.props.phraseMetaData.writtenInstructions;
      titleClass += " instructions";
    }

    let repeatClass = "repeatButton";
    if(this.state.isRepeating){
      repeatClass += " disabled";
    }

    //TODO: fix this reader className kerfuffle
    return (
      <div className="reader inner">
        <div className={titleClass}>{title}</div>
        {this.props.repeatInstructions &&
          <div className={repeatClass} onClick={this.repeatPhraseInstructions.bind(this)}>
            <FaVolumeUp size="24" className="repeatButtonSvg"/>
          </div>
        }
        {this.getPhrases()}
        {this.getBranding()}
      </div>
    );
  }
}