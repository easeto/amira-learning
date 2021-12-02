import {COPY_STRINGS} from '../constants/translatedCopy';
import {activityStatus, assignmentTypes} from '../constants/constants';
import { getUserData } from '../services/API';
import {statusType} from '../services/displayStatus';

export const SPANISHCONFIG ={
  englishOnly: "ENGLISH_ONLY",
  spanishOnly: "SPANISH_ONLY",
  bothOneSession: "BOTH_ONE_SESSION",
  bothTwoSessions: "BOTH_TWO_SESSIONS"
}

const DYSLEXIA = (locale="en-us") => {
  return{
    type: assignmentTypes.DYSLEXIA,
    locale,
    introText: () => {return COPY_STRINGS.dyslexia_instructions;}, //this has to be a function because otherwise it will be evaluated before the language is set and will not work as expected for non english markets
  };
};

const NWF = (locale="en-us") => {
  return{
    type: assignmentTypes.NWF,
    locale,
    introText: () => {return COPY_STRINGS.nwf_instructions;},
  }
};

const SPELLING = (locale="en-us") => {
  return{
    type: assignmentTypes.SPELLING,
    locale,
    introText: () => {return COPY_STRINGS.spelling_intro;},
  }
};

const ORF = (session,locale="en-us") => {
  return {
    type: assignmentTypes.ASSESSMENT,
    locale,
    introText: () => session.assessmentPageNavEnabled ? COPY_STRINGS.orf_with_page_navigation_instructions : COPY_STRINGS.orf_instructions,
  };
}

const LISTENING_COMPREHENSION = (locale="en-us") => {
  return{
    type: assignmentTypes.LISTENING_COMPREHENSION,
    locale,
    introText: () => {return COPY_STRINGS.listening_comprehension_intro;},
  }
};

const READING_COMPREHENSION = (locale="en-us") => {
  return{
    type: assignmentTypes.READING_COMPREHENSION,
    locale,
    introText: () => {return COPY_STRINGS.reading_comprehension_intro;},
  }
}

const VOCABULARY_SCREENER = (locale="en-us") => {
  return{
    type: assignmentTypes.VOCABULARY_SCREENER,
    locale,
    introText: () => {return COPY_STRINGS.vocabulary_screener_intro;},
  }
}

//TODO: eventually this should come directly from the backend, and each object should contain the rest of the assignment info
export let ASSIGNMENT_PROGRESSION = [];

export function initAssignmentProgression(session){
  buildProgression(session,session.screenerEnabled);

  return Promise.resolve();
}

function buildProgression(session,doScreener,progressMonitoring=false){
  const grade = session.actualGrade;
  const locale = (getUserData().isESL) ? "es-mx" : "en-us";
  const config = getUserData().spanishConfig;
  console.log("CONFIG",grade,locale,config,doScreener,progressMonitoring)
  if(!progressMonitoring && config && (config !== SPANISHCONFIG.englishOnly) && (locale === "es-mx")){
    buildLocaleProgression(locale,grade,session,doScreener);
  }

  if(!config || (config !== SPANISHCONFIG.spanishOnly) || (locale === "en-us")){
    buildLocaleProgression("en-us",grade,session,doScreener);
  }
}

function buildLocaleProgression(locale,grade,session,doScreener){
    //For progress monitoring, we only do orf
    if(doScreener){
      if(session.dyslexiaTestEnabled){
        ASSIGNMENT_PROGRESSION.push(DYSLEXIA(locale)); //Screener always starts with dyslexia
      }

      if(session.nwfConfig[grade < session.nwfConfig.length ? grade : session.nwfConfig.length-1]){
        ASSIGNMENT_PROGRESSION.push(NWF(locale));
      }

      if(session.spellingConfig[grade < session.spellingConfig.length ? grade : session.spellingConfig.length-1]){
        ASSIGNMENT_PROGRESSION.push(SPELLING(locale));
      }

      if(session.vocabularyScreenerConfig[grade < session.vocabularyScreenerConfig.length ? grade : session.vocabularyScreenerConfig.length-1]){
        ASSIGNMENT_PROGRESSION.push(VOCABULARY_SCREENER(locale));
      }

      if(session.listeningCompConfig[grade < session.listeningCompConfig.length ? grade : session.listeningCompConfig.length-1]){
        ASSIGNMENT_PROGRESSION.push(LISTENING_COMPREHENSION(locale));
      }
    }

    if(session.assessmentEnabled){
      ASSIGNMENT_PROGRESSION.push(ORF(session,locale));
    }

    if(session.readingCompConfig[grade < session.readingCompConfig.length ? grade : session.readingCompConfig.length-1] && doScreener){
      ASSIGNMENT_PROGRESSION.push(READING_COMPREHENSION(locale));
    }

    ASSIGNMENT_PROGRESSION = ASSIGNMENT_PROGRESSION.filter((element)=>{return element !== null});
    console.log("PROG:",ASSIGNMENT_PROGRESSION)
}

export function getIncompleteAssignments(activities){
  //First, filter down to the completed children
  let completedActivities = activities ? activities.map(child => (child.status !== "assigned") ? child : "") : [];
  completedActivities=completedActivities.filter(act=>!isOldAssignment(act));
  // filter those completed types out of our normal progression, taking locale into account
  let filteredAssignment = ASSIGNMENT_PROGRESSION.filter((assignment) =>{
    let completedThisAssignment = completedActivities.filter((activity)=>{
      let locale = (activity.tags && activity.tags.includes("ES_MX")) ? "es-mx" : "en-us";
      return((activity.type === assignment.type) && (locale === assignment.locale));
    });
    return(completedThisAssignment.length === 0);
  });
  return filteredAssignment;
}

//This method looks for activities that once were assignments
export function isOldAssignment(activity){
  if(!activity) return false;

  switch(activity.displayStatus){
    case statusType.UNASSIGNED:
    case statusType.MUTED:
    case statusType.STUCK_PLACEMENT:
      return true;
    default:
      return false;
  }
}