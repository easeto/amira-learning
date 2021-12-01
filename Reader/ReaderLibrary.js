import {COPY_STRINGS} from '../../constants/translatedCopy';

/*
** This Library only keeps functions that are specifically used inside of
** ReaderManager.
*/

//insert commas between each word to cause the speech synthesizer to pause
export function getTextWithPauses(text, config, errors) {
  if (config.slowWholePhrase) {
    let textWithPauses = text;
    textWithPauses = textWithPauses.replace(/["]+/g, '');

    if (config.separateByComma) {
      textWithPauses = textWithPauses.replace(".","");
      return textWithPauses.split(' ').join(", ");
    } else if(config.separateByBreakTag) {
      textWithPauses = textWithPauses.replace(".","");
      return textWithPauses.split(' ').join(`<break time=\"${config.breakTime || 0.20}s\"/>`);
    } else if(config.separateByProsodyTag) {
      return `<prosody rate="${config.prosodyRate || "slow"}">${text}</prosody>`;
    }

    return textWithPauses;
  } else {
    // note: this code with put double breaks between two errors. This is expected behavior
    return text.replace(/["]+/g, '').split(' ').map((word, wordIndex) => {
      if (errors[wordIndex]) {
        if (config.separateByComma) {
          return ", " + word + ", ";
        } else if(config.separateByBreakTag) {
          return `<break time=\"${config.breakTime || 0.20}s\"/>${word}<break time=\"${config.breakTime || 0.20}s\"/>`;
        } else {
          return `<prosody rate="${config.prosodyRate || "slow"}">${word}</prosody>`;
        }
      } else {
        return word;
      }
    }).join(' ');
  }
}
// calculate the reader's WPM (Words Per Minute) score for this story
// based on phraseTimers
export function calculateWPM(phraseTimes){
  let totalWords = 0;
  let totalMSElapsed = 0;
  if(!phraseTimes || !Array.isArray(phraseTimes) || !phraseTimes.length || phraseTimes.length <= 0){
    return 68;
  }
  let timers = phraseTimes.flat();
  for(let i = 0; i < timers.length; i++){
    let timer = timers[i] || {};
    if(timer.start && timer.end){
      totalMSElapsed += timer.end - timer.start;
      totalWords += timer.numWords;
    }
  }
  if(totalMSElapsed == 0){
    return 68;
  }
  return Math.round(totalWords / (totalMSElapsed / 60000));
}

export function calculateWCPMFromPhraseTimes(scores, phraseTimes){
  let totalMSElapsed = 0;
  let timers = phraseTimes.flat(4);
  for(let i = 0; i < timers.length; i++){
    let timer = timers[i] || {};
    if(timer.start && timer.end){
      totalMSElapsed += timer.end - timer.start;
    }
  }
  let totalWordsCorrect = 0;
  let flatScores = scores.flat(4);
  flatScores.forEach(score =>{
    score.totalErrors.forEach(error => {
      if(!error){
        totalWordsCorrect += 1;
      }
    });
  });
  let wcpm =  Math.round(totalWordsCorrect / (totalMSElapsed / 60000));
  if(wcpm > 200 || (wcpm < 0) || wcpm=="NaN"){
    console.log("GOT BAD WCPM: ", wcpm, ", defaulting to 68");
    wcpm = 68;
  }
  return wcpm;
}

export function calculateWCPM(errors, totalMSElapsed){
  if(!Array.isArray(errors) || totalMSElapsed <= 0 || errors.length <= 0){
    return 0;
  }
  let totalCorrect = errors.flat(4).reduce(((runningTotal, error) => error ? runningTotal : runningTotal + 1), 0);
  return Math.round(totalCorrect / (totalMSElapsed / 60000));
}

// calculate the reader's accuracy based on totalErrors
// and returns a percentage based number
export function calculateAccuracy(totalErrors){
  totalErrors = Array.isArray(totalErrors) ? totalErrors : [];
  let totalWords = 0;
  let totalCorrect = 0;
  for(let i = 0; i < totalErrors.length; i++){
    let pageErrors = totalErrors[i];
    for(let j = 0; j < pageErrors.length; j++){
      let phraseErrors = pageErrors[j];
      for(let k = 0; k < phraseErrors.length; k++){
        totalWords += 1;
        if(!phraseErrors[k]){
          totalCorrect += 1;
        }
      }
    }
  }
  if(totalWords <= 0){
    return 0;
  }
  return Math.round((totalCorrect/totalWords)*100);
}

export function calculateAccuracyFromScoredTranscript(scoredTranscript){
  let totalErrors = scoredTranscript.map((page) => page.map((phraseScore) => phraseScore.totalErrors));
  return calculateAccuracy(totalErrors);
}

