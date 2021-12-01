import awsmobile from '../aws-exports';
import io from "socket.io-client";

import {ASSIGNMENT_PROGRESSION, initAssignmentProgression, getIncompleteAssignments} from '../dummy_data/assignmentProgression';
import Amplify, { API, Analytics, Storage, graphqlOperation, Auth } from 'aws-amplify';
import {poll} from '../library';
import studentRecordService from './StudentRecordService';
import studentInformationService from './StudentInformationService';
import {
  userTypes,
  assignmentTypes,
  activityStatus,
  contentTags,
  recommendationModes,
  locales
} from '../constants/constants';
import { calculateAccuracy } from '../components/Reader/ReaderLibrary.js';
import * as Sentry from '@sentry/browser';
import {prefetchWordMetadata, getWordMetadata} from "./WordMetadataService.js";
import { statusType } from "./displayStatus";
import {formatGuidForSIS} from './util';
import {isiPad} from './environment';
import { logSessionInfo } from './logger';
import {filterByDate, filterByLocale} from '../components/Reports/util/validation';
import { uuidToHEX } from './util';

const DEFAULT_LOCALE = "en-us";

var stories_store = [];
var utterance_store = {};
var userData_store = {
  userId: null,
  sessionId: null,
  userType: null,
  userAgent: null,
  sessionStartTime: null,
  sessionData: {},
};

// retrieves a bundled session audio file
export function searchSessionAudio (testID) {
  let apiName = awsmobile.aws_cloud_logic_custom[1].name;
  let path = '/stream';
  let myInit = {
    headers: {'Content-Type': 'application/json'},
    queryStringParameters: {id: testID}
  };

  return API.get(apiName, path, myInit)
  .then((resp) => resp.data)
  .catch(err => {
    console.log('SEARCH Audio failed: ', err);
  });
}



// Set this to true to get a dump of all the word metadata in the console when you hit "read a story"
// NOTE: we should never deploy it this way - it will take a lot of time on the "choose a story" screen.
export const RUN_METADATA_DUMP = false;

if(RUN_METADATA_DUMP){
  // Story dump - remember to add chapter to the graphQL
  studentRecordService.getRecommendedStories("",3,'tutor',100,"")
  .then((stories)=>{
    stories.map((story)=>{
      let content = story.chapters[0].phrases.reduce((total,phrase)=>{
        return total += ' ' + phrase;
      },"");
    });
  })
  .catch(err=>{console.log("ERROR IN RECOMMEND:");throw new Error(err);});
}

//Set this to true in order to load the stories from sampleStories.js
const GET_STORIES_LOCALLY = false;

//Set this to true in order to load a hard coded assignment for all students, entering forced assessment mode
const FORCE_ASSESSMENT = process.env.FORCE_ASSESSMENT;

//Delete userData_store
export function clearUserData(){
  console.log("trying to sign out");
  userData_store = null;
  Auth.signOut()
  .catch(err => console.log("ERROR SIGNING OUT",err));
}

//return the userData_store
export function getUserData(){
  return userData_store;
}

export function setUserData(key, value){
  userData_store[key] = value;
}

export function setSessionActivityId(inActivityId){
  userData_store.activityId = inActivityId;

  //Initialize the inference service session
  if(process.env.INFERENCE_SERVICE_URL){
    const url = process.env.INFERENCE_SERVICE_URL + "/init/" + inActivityId;
    return fetch(url,{
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'no-cors'
    })
    .catch((err)=>console.log("Error priming inference for activity",inActivityId, err));
  }
}

export const defaultConfig = {
  NWF_CONFIG: [true,true,true,false,true,true],
  LISTENING_COMP_CONFIG: [false,false,false,false,false,false],
  READING_COMP_CONFIG: [false,false,false,false,true,true],
  SPELLING_CONFIG: [false,false,false,false,false,false],
  LETTERNAME_CONFIG: [false,false,false,false,false,false],
  VOCABULARY_SCREENER_CONFIG: [false,false,false,false,false,false],
};

// save the user data
export async function saveUserData(authData,retries=3){
  // if authData doesn't have a userType, or the userType is invalid, we will default to STUDENT,
  // on the other hand, if the userType does exist, then we assign the entire authData to userData_store.
  // for now all routes are exposed for user type STUDENT
  let iPad = isiPad();


 return Auth.currentUserInfo()
  .then(async resp => {
    userData_store = {
      userId: resp.attributes['custom:sisId'] || resp.attributes.sub,
      sessionId: getSessionID(),
      userType: resp.attributes['custom:userType'] || userTypes.STUDENT,
      userAgent: navigator.userAgent,
      sessionStartTime: Date.now(),
      firstName: resp.attributes['custom:firstName'], //TODO: pull name from SIS
      userName: resp.username,
      sessionData: {
        cognitoUserSession: authData.signInUserSession,
        authData: authData,
        isiPad: iPad,
        useIpadFallbacks: iPad,
      },
      assessment: resp.attributes['custom:assessment'],
      skipMagic: resp.attributes.skipMagic,
      correlationid: resp.attributes.correlationid,
    };

    //Special case for side-loaded admins
    if(!resp.attributes['custom:sisId']){
      userData_store.skipMagic = true;
      userData_store.sideloadedUser = true;
    }

    let connection = {}
    if(navigator.connection){
      connection = {
        downlink: navigator.connection.downlink,
        effectiveType: navigator.connection.effectiveType,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      }
    }

    userData_store.connection = connection;
    console.log(JSON.stringify(getUserData().connection));

    Sentry.configureScope((scope) => {
      scope.setUser(userData_store);
    });

    if(userData_store.userType === userTypes.STUDENT){
      userData_store.locale = DEFAULT_LOCALE;

      //Get student metatata
      let studentInfo = await studentInformationService.getStudentInfo(userData_store.userId);
      userData_store.isESL = studentInfo.metadata.esl;
      if(userData_store.isESL){
        userData_store.assessmentPageNavEnabled = true; //We always want the next button with ESL kids
      }
      return studentRecordService.studentActivities(getFormatedId(userData_store.userId),1,["assessment","tutor"], ["scored","rescored"])
      .then(async (activities)=>{
        if(activities.length > 0){
          let lastActivity = activities[0];
          let fallbackScores = getDefaultScores(userData_store.grade);


          if(lastActivity.scores && (lastActivity.scores.decodeScore || lastActivity.scores.decodeScore === 0)) {
            userData_store.decodeScore = lastActivity.scores.decodeScore;
          }else{
            userData_store.decodeScore = fallbackScores.decodeScore;
          }
        }

        return (resp.attributes.skipMagic ? Promise.resolve({grade: resp.attributes.grade, districtId: resp.attributes.districtId, schoolId: resp.attributes.schoolId}) : getStudentInfo(resp.username))
          .then(info =>{
            userData_store.grade = userData_store.grade ? userData_store.grade : info.grade;
            if(userData_store.AREA == null) {
              userData_store.AREA = getDefaultScores(userData_store.grade).areaScore;
            }
            userData_store.actualGrade = info.grade;
            userData_store.districtId = info.districtId;
            userData_store.schoolId = info.schoolId;
            if(info.districtId && info.schoolId){
              return studentRecordService.getEntitlements(info.districtId,info.schoolId)
              .then((resp)=>{
                //If there is no entitlement, default to true. This is pretty fundamental to not having a single point
                // of failure for users. It's better to give them more than to have everybody go down.
                if(resp){
                  userData_store.assessmentEnabled = ((resp.assessmentEnabled !== null) && (resp.assessmentEnabled !== undefined)) ? resp.assessmentEnabled : false;
                  userData_store.assessmentPageNavEnabled = resp.assessmentPageNavEnabled || true;
                  userData_store.tutorEnabled = resp.tutorEnabled;
                  userData_store.demoMode = resp.demoMode;
                  userData_store.dyslexiaEnabled = resp.dyslexiaEnabled;
                  userData_store.progressMonitoring = resp.progressMonitoring || false;
                  userData_store.nwfConfig = resp.nwfConfig || defaultConfig.NWF_CONFIG;
                  userData_store.listeningCompConfig = resp.listeningCompConfig || defaultConfig.LISTENING_COMP_CONFIG;
                  userData_store.readingCompConfig = resp.readingCompConfig || defaultConfig.READING_COMP_CONFIG;
                  userData_store.spellingConfig = resp.spellingConfig || defaultConfig.SPELLING_CONFIG;
                  userData_store.letternameConfig = resp.letternameConfig || defaultConfig.LETTERNAME_CONFIG;
                  userData_store.vocabularyScreenerConfig = resp.vocabularyScreenerConfig || defaultConfig.VOCABULARY_SCREENER_CONFIG;
                  userData_store.dyslexiaTestEnabled = ((resp.dyslexiaTestEnabled !== null) && (resp.dyslexiaTestEnabled !== undefined)) ? resp.dyslexiaTestEnabled : true;
                  userData_store.screenerEnabled = ((resp.screenerEnabled !== null) && (resp.screenerEnabled !== undefined)) ? resp.screenerEnabled : false;
                  userData_store.autoAssign = resp.autoAssign || false;
                  userData_store.schoolYearStartDate = resp.schoolYearStartDate;
                  userData_store.screeningStartDate = resp.screeningStartDate;
                  userData_store.screeningEndDate = resp.screeningEndDate;
                  userData_store.tutorWhitelist = resp.tutorWhitelist;
                  let types = Object.keys(assignmentTypes);
                  let formOverrides = {}
                  types.map(type=>formOverrides[type] = []);
                  userData_store.formOverrides = resp.formOverrides ? resp.formOverrides : formOverrides;
                  userData_store.spanishConfig = resp.spanishConfig || "BOTH_ONE_SESSION";
                }else{
                  userData_store.assessmentEnabled = false;
                  userData_store.assessmentPageNavEnabled = true;
                  userData_store.tutorEnabled = true;
                  userData_store.demoMode = false;
                  userData_store.dyslexiaEnabled = true;
                  userData_store.progressMonitoring = false;
                  userData_store.nwfConfig = defaultConfig.NWF_CONFIG;
                  userData_store.listeningCompConfig = defaultConfig.LISTENING_COMP_CONFIG;
                  userData_store.readingCompConfig = defaultConfig.READING_COMP_CONFIG;
                  userData_store.spellingConfig = defaultConfig.SPELLING_CONFIG;
                  userData_store.letternameConfig = defaultConfig.LETTERNAME_CONFIG;
                  userData_store.vocabularyScreenerConfig = defaultConfig.VOCABULARY_SCREENER_CONFIG;
                  userData_store.dyslexiaTestEnabled = true;
                  userData_store.screenerEnabled = false;
                  userData_store.autoAssign = false;
                  userData_store.spanishConfig = "BOTH_ONE_SESSION";
                  let types = Object.keys(assignmentTypes);
                  let formOverrides = {}
                  types.map(type=>formOverrides[type] = []);
                  userData_store.formOverrides = formOverrides;
                }

                //Once we have all the "real" information on the student, check to see if any overrides are necessary
                if(userData_store.demoMode  || (process.env.IGNORE_STUDENT_HISTORY === 'TRUE')){
                  userData_store.grade = userData_store.actualGrade;
                  let defaultScores = getDefaultScores(userData_store.grade);
                  userData_store.AREA = defaultScores.areaScore;
                  userData_store.decodeScore = defaultScores.decodeScore;
                }

                if(studentInfo){
                  userData_store.tutorEnabled = ((studentInfo.metadata.tutorEnabled !== undefined) && (studentInfo.metadata.tutorEnabled !== null)) ? studentInfo.metadata.tutorEnabled : userData_store.tutorEnabled;
                  userData_store.assessmentEnabled = ((studentInfo.metadata.assessmentEnabled !== undefined) && (studentInfo.metadata.assessmentEnabled !== null)) ? studentInfo.metadata.assessmentEnabled : userData_store.assessmentEnabled;
                  userData_store.screenerEnabled = ((studentInfo.metadata.screenerEnabled !== undefined) && (studentInfo.metadata.screenerEnabled !== null)) ? studentInfo.metadata.screenerEnabled : userData_store.screenerEnabled;
                  console.log(userData_store)
                }

                return initAssignmentProgression(userData_store)
                .then(async ()=>{
                  return Promise.resolve(userData_store);
                });
              });
            }else{
              //If there's nothing in licensing, allow both
              userData_store.assessmentEnabled = true;
              userData_store.tutorEnabled = true;
              return Promise.resolve(userData_store);
            }
          });
      });
    }else{
      return studentInformationService.getSchoolsAndDistricts(resp,authData,resp.username,userData_store.userId,resp.attributes.skipMagic)
      .then((resp)=>{
        userData_store.schools = resp.schools;
        userData_store.district = resp.district;
        userData_store.districtId = resp.district.id;
        userData_store.schoolId = resp.schools[0].id;
        return studentRecordService.getEntitlements(resp.district.id,resp.schools[0].id)
        .then((entitlements)=>{
          userData_store.dyslexiaEnabled = entitlements ? entitlements.dyslexiaEnabled : true;
          userData_store.texasResources = entitlements ? entitlements.texasResources : false;
          userData_store.schoolYearStartDate = entitlements.schoolYearStartDate;
          if(authData.locale){
            userData_store.locale = authData.locale;
          }else{
            userData_store.locale = (entitlements && entitlements.locale)? entitlements.locale : DEFAULT_LOCALE;
          }

          return Promise.resolve(userData_store);
        });
      });
    }
  })
  .catch(err => {
    console.log("Error in auth",JSON.stringify(err));
    if(retries){
      console.log("Retrying auth",retries);
      return saveUserData(authData,retries-1);
    }else{
      return Promise.reject(err);
    }
  });
}

export function magicGradeToAmiraGrade(inMagicGrade){
  const gradeLookup = [
    {label: "Kindergarden", grade: 0},  //NOTE: Misspelling intentional - this is how magic returns it.
    {label: "Kindergarten", grade: 0},
    {label: "First grade", grade: 1},
    {label: "Second grade", grade: 2},
    {label: "Third grade", grade: 3},
    {label: "Fourth grade", grade: 4},
    {label: "Fifth grade", grade: 5},
    {label: "Sixth grade", grade: 6}
  ];

  let grade = gradeLookup.filter(lookup => {
    return lookup.label === inMagicGrade;
  });

  let returnGrade = grade.length ? grade[0].grade : 0;

  return returnGrade;
}

function getStudentInfo(userName){
  const url = "https://api.getmagicbox.com/services//user/v1.0/"+userName+"?token=11b2d93f06ac11e9a2d10a2dfa68e30a";

  return fetch(url,{method: "GET"})
  .then((resp) => resp.json())
  .then(function(resp){
    let info = {
      districtId: resp.data.districtID,
      schoolId: resp.data.schoolId,
    };
    info.grade = magicGradeToAmiraGrade(resp.data.grades[0]);
    return Promise.resolve(info);
  })
  .catch((err) => {
      return Promise.reject(err);
  });
}

function getSessionID () {
  // add user data when
  return `Amira-Field-Trial:${Date.now()}`;
}

// returns a deepCopy of the given object
// this can help us guard against accidentally mutating the store
function deepCopy(obj){
  return JSON.parse(JSON.stringify(obj));
}


//NOTE: This is ONLY used when GET_STORIES_LOCALLY is true
function getLocalAssessmentStories(inStories,inGrade){
  if(GET_STORIES_LOCALLY){
    let recommended_stories = [];
    for(let i=0;i<inStories.length;i++){
      if((inStories[i].grade == inGrade) && (inStories[i].type == assignmentTypes.ASSESSMENT)){
        recommended_stories.push({
          title: inStories[i].title,
          author: inStories[i].author,
          id: inStories[i].storyId,
        });
        return recommended_stories;
      }
    }
  }
  else{
    throw new Error("Tried to call get assessment stories from back end");
  }
}

function getLocalSpellingStories(inStories,inGrade){
  if(GET_STORIES_LOCALLY){
    let userData = getUserData();
    let locale = userData.locale;
    if(locale == "es-mx"){
      return [inStories[4]];
    } else {
      return [inStories[3]];
    }
  }else{
    throw new Error("Tried to call get local spelling stories instead of pulling from backend");
  }
}

function getLocalQuizStories(inStories,inGrade){
  if(GET_STORIES_LOCALLY){
    return [inStories[5]];
  }else{
    throw new Error("Tried to call get local spelling stories instead of pulling from backend");
  }
}

function getLocalNWFStories(inStories,inGrade){
  if(GET_STORIES_LOCALLY){
    let userData = getUserData();
    let locale = userData.locale;
    if(locale == "es-mx"){
      return [inStories[2]];
    } else {
      return [inStories[1]];
    }
  }else{
    throw new Error("Tried to call get local NWF stories instead of pulling from backend");
  }
}

function getLocalDyslexiaStories(inStories,inGrade){
  //NOTE: we don't currently have a local spanish version of the dyslexia
  if(GET_STORIES_LOCALLY){
    return [inStories[3]];
  }else{
    throw new Error("Tried to call get local dyslexia stories instead of pulling from backend");
  }
}

function getLocalReadAloudStories(inStories,inGrade){
  if(GET_STORIES_LOCALLY){
    // return [inStories[66]]; //audio
    return [inStories[0]]; //video
  }else{
    throw new Error("Tried to call get local read aloud stories instead of pulling from backend");
  }
}

//NOTE: This is ONLY used when GET_STORIES_LOCALLY is true
function getLocalTutorStories(inStories,inGrade,inNumberOfStories){
  if(GET_STORIES_LOCALLY){
    let recommended_stories = [];
    for(let i=0;i<inStories.length;i++){
      if((inStories[i].grade == inGrade) && (inStories[i].type == assignmentTypes.TUTOR)){
        recommended_stories.push({
          title: inStories[i].title,
          author: inStories[i].author,
          id: inStories[i].storyId,
          storyid: inStories[i].storyid,
        });
        if(recommended_stories.length > inNumberOfStories){
          break;
        }
      }
    }
    return recommended_stories;
  }else{
    throw new Error("Tried to call get tutor stories from back end");
  }
}

function getLocalReadingComprehensionStories(inStories,inGrade){
  if(GET_STORIES_LOCALLY){
    let readingCompStories = inStories.filter(s => s.type === assignmentTypes.READING_COMPREHENSION);
    return [readingCompStories[0]];
  }else{
    throw new Error("Tried to call get local reading comprehension stories instead of pulling from backend");
  }
}

function getLocalVocabularyScreenerStories(inStories,inGrade){
  if(GET_STORIES_LOCALLY){
    let vocabScreenerStories = inStories.filter(s => s.type === assignmentTypes.VOCABULARY_SCREENER);
    return [vocabScreenerStories[0]];
  }else{
    throw new Error("Tried to call get local vocabulary screener stories instead of pulling from backend");
  }
}



const tutorWhitelist = [
  { 
    "storyid": "93405360-362f-11e9-bb3b-e7e2c0de6bee",
    "title": "The Life Cycle of Butterflies",
    "AREA_85": 8.6,
    "AREA_95": 10.2,
  },
  {
    "storyid": "d2669700-1ed8-11eb-83fe-57c4f9003880",
    "title": "Mustache Day",
    "AREA_85": 7.4,
    "AREA_95": 10.1,
  },
  {
    "title": "Animal Homes",
    "storyid": "73d63580-f9b0-11ea-8ba7-4f55b44592d0",
    "AREA_85": 6.8,
    "AREA_95": 8.7,
  },
  {
    "title": "FYI for kids: Bigger than an elephant",
    "storyid": "aa9a8ee0-f9c9-11ea-9b55-25ca75ea58d7",
    "AREA_85": 8.1,
    "AREA_95": 10.1,
  },
  {
    "title": "Bumblebees",
    "storyid": "f9ce3830-0974-11eb-8a99-238a1e6e21be",
    "AREA_85": 8,
    "AREA_95": 10.9,
  }
];



async function recommendFromWhitelist(whiteList = tutorWhitelist){
  let takenActivities = await studentRecordService.checkForCompletedActivities(getUserData().userId);

  let availableStories = whiteList.filter((story)=>{
    return (takenActivities.filter((activity)=>{
      return ((activity.storyId === uuidToHEX(story.storyid)) && (activity.status == "scored" || activity.status == "rescored" || activity.displayStatus == "completed"))
    }).length === 0);
  });

  if(availableStories.length){
    //Recommend the story that has the closest to the midpoint between AREA_85 and AREA_95
    let difficulties = availableStories.map((story)=>{
      let diff = (story.AREA_95 - story.AREA_85)/2 + story.AREA_85;
      return Math.abs(getUserData().AREA - diff);
    })
    let indexOfSmallest = difficulties.indexOf(Math.min.apply(Math, difficulties));
    console.log("RECOMMEND",getUserData().AREA,availableStories[indexOfSmallest]);
    return studentRecordService.getStory(availableStories[indexOfSmallest].storyid)
    .then((story)=>{return Promise.resolve([story])});
  }else{
    return [];
  }

}

function getDyslexiaStories(type,grade){
  //NOTE: Until we get this code out into production and can publish both dyslexia stories
  //      we need to hard code an override into the app;
  const dyslexiaOverride = [
    "bb9d56e0-2810-11ea-b834-f74d2639038b",
    "56794f80-2810-11ea-afee-45932f4b455a",
    null,
    null,
    null,
    null
  ];

  let formOverrides = getUserData().formOverrides;
  let locale = getUserData().locale;

  //No form override for spanish (yet)
  if(!(locale === "es-mx") && formOverrides[assignmentTypes.DYSLEXIA] && formOverrides[assignmentTypes.DYSLEXIA][grade]){
    return getStory(formOverrides[assignmentTypes.DYSLEXIA][grade])
      .then(story=>{
        return Promise.resolve([story]);
      });
  }else{
    //If the letter names are configured and we have a letter name form, grab it. Otherwise just grab the "normal" test.
    if(!(locale === "es-mx") && (type == assignmentTypes.DYSLEXIA) && dyslexiaOverride[grade] && getUserData().letternameConfig[grade]){
      return getStory(dyslexiaOverride[grade])
      .then(story=>{
        return Promise.resolve([story]);
      })
    }else{
      return getRecommendedStories(grade,type);
    }
  }
}

// gets a story by id and then paginates it for use in the tutor app
export function getPaginatedStory(id){
  return getStory(id).then((story) => {
    return paginateStory(story, getPhrasesPerPage(story));
  });
}

// gets a story by id and then squashes it for use in assessment
export function getSquashedStory(id){
  return getStory(id).then((story) => {
    return paginateStory(squashStory(story));
  });
}

// gets a story paginated at 1 phrase per page, combining phrases as necessary to make long enough pages for assessment mode
export function getAssessmentStory(id){
  return getStory(id).then((rawStory) => {
    let story = addStoryAttributes(rawStory);
    let wordsPerPhrase = 50;
    if(story.type != assignmentTypes.ASSESSMENT){ //TODO: get this from the assignment object
      wordsPerPhrase = null;
    }
    let paginatedStory = paginateStory(story, 1, wordsPerPhrase);
    return paginatedStory;
  });
}

// divides story into a given number (default 3) of phrase pages
export function paginateStory(story, phrasesPerPage=3, wordsPerPhrase=null){
  let pages = [];
  for(let i = 0; i < story.chapters.length; i++){
    let chapter = story.chapters[i];
    let currentPhrase = "";
    let currentPage = [];
    for(let j = 0; j < chapter.phrases.length; j++){
      let phrase = chapter.phrases[j];

      //Map logical item types to display types
      if(chapter.items && chapter.items[j]){
        chapter.items[j].type = getDisplayType(chapter.items[j].type);
        if(chapter.items[j].instructions && chapter.items[j].instructions.type){
          chapter.items[j].instructions.type = getDisplayType(chapter.items[j].instructions.type);
        }
      }

      if(!wordsPerPhrase || currentPhrase.split(" ").length + phrase.split(" ").length > wordsPerPhrase){
        if(currentPhrase !== ""){
          currentPage.push(currentPhrase);
        }
        currentPhrase = phrase;
      } else {
        currentPhrase = currentPhrase + " " + phrase;
      }
      if(currentPage.length >= phrasesPerPage){
        pages.push(currentPage);
        currentPage = [];
      }

      // if this is the last phrase add the current phrase and page we are working on even if they are not long enough yet
      if(j >= chapter.phrases.length - 1){
        currentPage.push(currentPhrase);
        pages.push(currentPage);
      }
    }
  }

  return {
    title: story.title,
    author: story.author,
    alternateIntroText: story.alternateIntroText,
    pages: pages,
    items: story.chapters[0].items,
    phrases: story.chapters[0].phrases,
    questions: story.questions,
    storyId: story.storyId,
    type: story.type,
    version: story.version,
    grade: story.grade,
    nonAudio: story.nonAudio,
    brand: story.brand,
    tags: story.tags,
  };
}

function getPhrasesPerPage(story){
  let phrasesPerPage;
  if(story.tags && story.tags.some(t => t === contentTags.PICTURE_STORY)){
    phrasesPerPage = 1;
  }

  return phrasesPerPage;
}

  //This method maps the abstract types of an item to our display types
function getDisplayType(type){
    switch(type){
      case 'blending':
        return "video";
      case 'wordList':
        return "word";
      case 'letterSound':
        return "sound";
      case 'ran':
        return "RAN";
      case 'spelling':
        return "textInput";
      case 'quiz':
        return 'quiz';
      case 'readAloudVideo':
        return 'readAloudVideo';
      default:
        return type;
    }
}

// returns a story with all phrases concatinated into one single phrase
function squashStory(story){
  let metaPhrase = "";
  for(let i = 0; i < story.chapters.length; i++){
    let chapter = story.chapters[i];
    for(let j = 0; j < chapter.phrases.length; j++){
      let phrase = chapter.phrases[j];
      if(!(i == 0 && j == 0)){
        metaPhrase += " ";
      }
      metaPhrase += phrase;
    }
  }
  return({
    title: story.title,
    author: story.author,
    storyId: story.storyId,
    version: story.version,
    type: story.type,
    chapters: [
      {phrases: [metaPhrase]}
    ],
  });
}


//TODO: this should not be necessary when we are getting back scored story data from the back end
// unwrap phrases with possibility of adding meta data. originally was considering keeping errors,
// mispronunciations etc in here, but since we are mutating them parallel arrays makes it easier for now
function unwrapPhrases(activity){
  let story = activity.story;
  let errors = activity.errors;
  let phrases = [];
  for(let i = 0; i < story.chapters.length; i++){
    let chapter = story.chapters[i];
    for(let j = 0; j < chapter.phrases.length; j++){
      let phrase = chapter.phrases[j];
      let phraseErrors = errors ? errors[j] : [];   //relying on the fact that we are not actually subdividing by chapter, and that the errors array is not currently indexed by chapter
      let markedPhrase = {
        text: phrase,
      }
      phrases.push(markedPhrase);
    }
  }
  return phrases;
}

//returns an object containing a paginated story, an audio file of a student reading it, and amira's guess at errors
// to be used in teacher correction UI
export function getScoredStory(activityId){
  return studentRecordService.getActivity(activityId).then((response) => {
    let activity = response.data.getActivity[0];

    //Handle empty error elements
    let phrases = activity.story.chapters[0].phrases;
    let errors = activity.errors;
    for(let i=0;i<errors.length;i++){
      if(errors[i].length === 0){
        errors[i] = new Array(phrases[i].split(' ').length).fill(true);
      }
    }

    //TODO: this really should not be three chained calls on this end, this info needs to be consolidated on the backend

    return ({
      squashedStory: squashStory(activity.story),
      audio: null,                              //activity.audio,  TODO: link this on the backend
      errors: activity.errors,
      mispronunciations: activity.mispronunciations || [],
      skips: activity.skips || [],
      selfCorrections: activity.selfCorrections || [],
      phrases: unwrapPhrases(activity),
      studentId: activity.studentId,
      studentName: activity.studentName,
      activityId: activity.activityId,
      storyId: activity.storyId,
      updatedAt: new Date(activity.updatedAt),
      timeRead: activity.timeRead || 0,
      type: activity.type,
      student: {
        studentId: activity.studentId,
      },
      flaggedPhrases: activity.flagging
    });
  }).then((scoredStory) => {
    // after we get back the story, populate the audio field manualy. Eventually this will be linked on the back end
    return searchSessionAudio(activityId).then((sessionAudio) => {
      scoredStory.audio = {url: sessionAudio};
      return scoredStory;
    });
  }).then((scoredStory) => {
    return studentInformationService.getUserInfoByUserId(scoredStory.student.studentId).then((studentData) => {
      if(!studentData){
        return scoredStory;
      }

      let student = {
        studentId: scoredStory.student.studentId,
        firstName: studentData.FirstName,
        lastName: studentData.LastName,
        userName: studentData.UserName,
      }
      scoredStory.student = student;
      return scoredStory;
    });
  });
}

// return an assignment object for a given student id. If there is no current assignment, return null
export async function getAssignment(studentId){
  return studentRecordService.checkForAssignments([studentId])
  .then((activities)=>{
    return findAssignments(activities,studentId)
    .then(async (data)=>{
      if((userData_store.assessmentEnabled || userData_store.screenerEnabled) && data && ((data.type == assignmentTypes.ASSESSMENT) || (data.type == assignmentTypes.DYSLEXIA) || (data.type == assignmentTypes.NWF) || (data.type == assignmentTypes.SPELLING) || (data.type == assignmentTypes.LISTENING_COMPREHENSION) || (data.type == assignmentTypes.READING_COMPREHENSION) || (data.type == assignmentTypes.VOCABULARY_SCREENER))){ //for now the type of the assignment means nothing
        let assignmentType = data.type;
        let children = data.children;

        //Since reading comp is a child of the assessment but comes after the assessment, use the assessment's children
        if((assignmentType === assignmentTypes.READING_COMPREHENSION)){
          let parentAssessment = activities.find(activity => activity.activityId === data.parentId);
          if(parentAssessment){
            children=parentAssessment.children.filter(child=>child.displayStatus !== statusType.UNASSIGNED);
            //Since we're using this to filter on complete activities, push the parent activity as well so that gets marked as complete
            children.push(parentAssessment);
          }else{
            return Promise.resolve(null);
          }
        }

        let childIds = [];

        if(children && children.length){
          childIds = children.map(child => child.activityId);
        }

        // figure out which of our assignment types have been already completed.
        // filter those completed types out of our normal progression
        let filteredAssignment = getIncompleteAssignments(children);

        //if we've completed all assigned tasks, there is no assignment after all
        if(filteredAssignment.length <= 0){
          return Promise.resolve(null);
        }

        //make this activityid the id of the first assignment so that it can be marked completed when we create the first child activity
        if(filteredAssignment && filteredAssignment[0]){
          filteredAssignment[0].activityId = data.activityId;
          filteredAssignment[0].childIds = childIds; //TODO make this work
          filteredAssignment[0].displayStatus = data.displayStatus;

          //Preserve the heirarcy with a reading comp assignment
          if(assignmentType === assignmentTypes.READING_COMPREHENSION){
            filteredAssignment[0].parentId = data.parentId;
          }
        }

        // the filtered progression is our assignment. eventually this whole thing should come from the backend.
        return filteredAssignment;
      }else{
        let anyCompleted = await checkForAnyCompletedActivity(userData_store.userId);
        userData_store.forceTutor = userData_store.tutorEnabled && !anyCompleted && !userData_store.isEarlyReader ;
        return Promise.resolve(null);
      }
    });
  });
}


export async function checkForAnyCompletedActivity(studentId){
  let returnValue = false;
  let completed = await studentRecordService.checkForCompletedActivities(studentId);

  completed.map((activity)=>{
    // We are going to consider a previous activity completed if it is tutor or assessment AND:
    // 1. It is scored or rescored OR
    // 2. It is a tutor and has been completed, but not necessarily scored OR
    // 3. The student has been classified as a prereader
    if(((activity.type === assignmentTypes.ASSESSMENT) || (activity.type === assignmentTypes.TUTOR))&&
      ((activity.status === statusType.SCORED) || (activity.status === statusType.RESCORED) ||
       ((activity.type === assignmentTypes.TUTOR) && (activity.displayStatus === statusType.COMPLETED)) ||
       (activity.displayStatus == statusType.PREREADER))){
        returnValue = true;
    }
  });

  return Promise.resolve(returnValue);
}


// return average WCPM and accuracy and total points accrued for this student
// TODO: for now this calculated front end based on the past 10 activities. Eventually these should be stats associated with our student data which we can get directly from the API
export function getStudentMetrics(){
  return getValidActivitiesForStudents([{id: getUserData().userId}], 30).then(activities => {
    let stats = {
      avgWPM: 0,
      avgAccuracy: 0,
      totalPointsAccrued: 0,
      testsTaken: 0,
      storiesRead: 0,
    };
    activities.forEach(activity => {
      stats.avgWPM += activity.scores.wcpmScore ? Math.round(activity.scores.wcpmScore) : 0;
      stats.avgAccuracy += activity.errors ? calculateAccuracy([activity.errors]) : 0; //TODO this is temporary until accuracy score starts getting passed through
      stats.totalPointsAccrued += activity.points || 0;
      stats.testsTaken += (activity.type === assignmentTypes.ASSESSMENT) ? 1 : 0;
      stats.storiesRead += (activity.type === assignmentTypes.TUTOR) ? 1 : 0;
    });
    stats.avgWPM = activities.length ? Math.round(stats.avgWPM / activities.length) : 0;
    stats.avgAccuracy = activities.length ? Math.round(stats.avgAccuracy / activities.length) : 0;
    return stats;
  }).catch(err => {
    console.log("error in getStudentMetrics: ", err);
    return {
      avgWPM: 0,
      avgAccuracy: 0,
      totalPointsAccrued: 0,
    };
  });
}

//stub to save teacher corrections to scoring
export function saveScoredAssessment(activityId, errors, score, skips, selfCorrections, mispronunciations, timeRead, flat = true){
  let formattedErrors = errors ? errors : [[]]; // TODO modify backend so that this is not necessary

  if(flat){
    formattedErrors = [errors.flat(4)];
  }

  //Remove any empty error elements (so we don't implicitly pad)
  formattedErrors = formattedErrors.filter(function (el) {
    return el.length > 0;
  });

  studentRecordService.scoreActivity(activityId, formattedErrors, score, skips, selfCorrections, mispronunciations, timeRead);
}

export function getRhymingWord(inWord,callback)
{
  //Get a transcription
  let apiName = 'lexaSpeech';
  let path = '/RhymesWith';
  let myInit = { // OPTIONAL
    headers: {  'Content-Type': 'application/json'
    },
    body: {wordToRhyme: inWord},
    response: false // OPTIONAL (return entire response object instead of response.data)
  }

  //console.log('Sending...')
  API.post(apiName, path, myInit)
    .then(resp => {
        callback(resp);
    })
    .catch(err => {
      console.log('API call to Rhyme failed: ',err);
      return(err);
    })

}

//can be called by itself to preload an utterance, just throw away the return value
export function getUtterance(text, includeSpeechMarks=false, locale="en-us"){
  let key = text.replace(/\s/g, '');
  if(utterance_store.hasOwnProperty(key)){
    // if we've already stored this utterance, pull it from the cache
    // make sure to make it thenable
    return new Promise((resolve, reject) => {resolve(deepCopy(utterance_store[key]))}); //copy the utterance before returning to eliminate any chance of mutating the store
  } else {
    //Invoke the text to speech API
    if(!text.includes("<speak>")){
      text = '<speak>'+text+'</speak>';
    }
    let args = {
      textToSpeak: text,
      includeSpeechMarks: includeSpeechMarks,
      locale: locale,
    }
    return getTextToSpeech(args)
    .then(resp => {
      //Build the audio buffer
      let uInt8Array = new Uint8Array(resp.speech_audio.AudioStream.data);
      let arrayBuffer = uInt8Array.buffer;
      let blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
      let audioURL = URL.createObjectURL(blob);

      let utterance = {
        speech_marks: resp.speech_marks,
        speech_audio: resp.speech_audio.AudioStream.data,
        audioURL: audioURL,
      };

      //cache the utterance
      utterance_store[key] = utterance;
      return Promise.resolve(deepCopy(utterance));
    })
    .catch(err => {return Promise.reject(err)});
  }
}


export async function getTextToSpeech(args,retries=4) {
  let inText = args.textToSpeak;
  let returnSpeechMarks = args.includeSpeechMarks;
  let locale = args.locale;
  //Get a transcription
  let apiName = 'lexaSpeech';
  let path = '/TextToSpeech';
  let myInit = { // OPTIONAL
    headers: {  'Content-Type': 'application/json'
    },
    body: {inText, locale},
    returnSpeechMarks: returnSpeechMarks,
    locale: locale,
    response: false // OPTIONAL (return entire response object instead of response.data)
  };

  return API.post(apiName, path, myInit)
  .then(resp => {
    return Promise.resolve(resp);
  })
  .catch(err => {
    if(retries){
      console.log("RETRYING TTS")
      return getTextToSpeech(args,retries-1);
    }else{
      return Promise.reject("Retries failed");
    }
  });
}

function splitLongAttributes(inString,inBasePropertyName){
  let outObject = {};
  let index = 0;
  let propertyValue = "";
  do{
    propertyValue = inString.substring(index*1000,(index*1000)+1000);

    if(propertyValue){
      outObject[inBasePropertyName + (index ? index : "")] = propertyValue;
    }
    index++;
  }while(propertyValue && (index < 5));

  return outObject;
}

// TODO: this is a stub for a real api call. For now it is returning dummy data.
export function logQuiz(data){
  return Promise.resolve({
    ...data,
    status: "completed",
  });
}

export function saveAssessmentTiming(inActivityId,inTimings,inRaw,inRetries=3){
  const options = {
    bucket: process.env.TIMINGBUCKET,
    contentType: 'application/json',
    level: "public",
    customPrefix: {
      public: "",
    },
  };

  Storage.put(inActivityId+"_timing",JSON.stringify(inTimings),options)
  .then(()=>{
    if(inRaw) Storage.put(inActivityId+"_RAW",JSON.stringify(inRaw),options);
  })
  .catch((err) => {
    if(inRetries){
      console.log("RETRYING TIMING WRITE")
      logSessionInfo("retryTimingWrite",{error: err, options: options});
      saveAssessmentTiming(inActivityId,inTimings,inRaw,inRetries-1);
    }else{
      console.log("TIMING PUT FAIL:",err);
      logSessionInfo("timingWriteFail",{
        error: err,
        options: options,
        activityId: inActivityId,
        timings: inTimings,
        raw: inRaw
      });
    }
  });
}

export async function calculatePhraseSplits(timings,storyId,stopTime,shouldPad){
  return getStory(storyId)
  .then(story =>{
    let phraseIndex = 0;
    let phrases = story.chapters[0].phrases;
    let nextPhraseBreak = phrases[phraseIndex].split(' ').length;
    let slices = [{phrase: 0, start: 0}];
    let phraseBreaks = [nextPhraseBreak];
    //console.log("PHRASES:",phrases.length,JSON.stringify(phrases)); //Leave in for troubleshooting
    //console.log(JSON.stringify(timings)); //Leave in for troubleshooting
    for(let i=0;i<timings.length;i++){
      if(timings[i].position > nextPhraseBreak){
        if((i<timings.length - 1)&& shouldPad){
          slices[phraseIndex].end =  timings[i+1].time;
        }
        else{
          if(shouldPad || (i === 0)){
            slices[phraseIndex].end =  timings[i].time;
          }else{
            slices[phraseIndex].end =  timings[i-1].time;
          }

        }
        phraseIndex++;
        if(i>0){
          if(i>1 && shouldPad){
            slices.push({phrase: phraseIndex, start: timings[i-2].time});  //Enforce overlap
          }
          else{
            slices.push({phrase: phraseIndex, start: timings[i-1].time});  //Enforce overlap
          }
        }else{
          slices.push({phrase: phraseIndex, start: timings[i].time});  //Enforce overlap
        }
        if(phrases[phraseIndex]){
          nextPhraseBreak += phrases[phraseIndex].split(' ').length;
          phraseBreaks.push(nextPhraseBreak);
        }
      }
    }
    slices[phraseIndex].end = stopTime;
    //console.log("slices:",JSON.stringify(slices));  //Leave in for troubleshooting

    if(slices.length > phrases.length){
      slices = slices.slice(0,phrases.length);
    }
    //console.log("phrase breaks:",JSON.stringify(phraseBreaks)); //Leave in for troubleshooting
    return Promise.resolve(slices);
  })
  .catch(err => {console.log("ERROR CALCULATING TIMINGS:",err); return Promise.reject(err);});
}

//Using this helper function because the studentIds coming from SIS
//have a different format than the ones coming from the activities call
//TODO: We should store the studentId the same way in SIS and "ActivitiesDB" so we don't have to format these ids
function getFormatedId(id) {
  return String(id).replace(/\-/g, '').toUpperCase();
}

export function getParentReport(studentId, equated=false) {
  return studentRecordService.getParentReport(studentId, equated).then((data) => {
    return data;
  }, (error) => {
    console.log(error);
  });
}

export function getAllAssessmentsForStudents(students, limit=null, type=["assessment"], equated=false) {
  return getActivitiesWithStudentInfo(students, limit, type, ["scored","rescored","assigned","not_started","in_progress","scoring","underReview"], equated);
}

export function getScoredAssessmentForStudents(students, equated=false, locale = null) {
  return getActivitiesWithStudentInfo(students, 10, "assessment", ["scored","rescored"], equated, locale).then((activities) => {
    return activities.filter((activity)=> activity && activity.scores && activity.scores.wcpmScore > 0);
  });
}

export function getValidDyslexiaAssessmentsForStudents(students, limit=null) {
  //collect ids from all students
  const studentIds = students.map(({ id }) => getFormatedId(id));
  return studentRecordService.dyslexiaActivities(studentIds,limit)
    .then((activities) => {
      activities = filterByDate(activities);
      if(Array.isArray(activities) && activities.length > 0){
        let englishActivities = students.map(({id})=>{
          return activities.find(activity => ((getFormatedId(id) == activity.studentId) && !isSpanishActivity(activity)));
        });
        englishActivities = englishActivities.filter(act=> act);

        let spanishActivities = students.map(({id})=>{
          return activities.find(activity => ((getFormatedId(id) == activity.studentId) && isSpanishActivity(activity)));
        });
        spanishActivities = spanishActivities.filter(act=> act);

        let returnActivities = englishActivities.concat(spanishActivities);
        //return the activities with the student information
        return returnActivities.map((activity) => ({
          ...activity,
          student: students.filter(({ id }) => getFormatedId(id) == activity.studentId)[0],
        }));
      }
      return [];
    });
}

export function isSpanishActivity(activity){
  return activity.tags && activity.tags.includes("ES_MX");
}

export function getValidActivitiesForStudents(students, limit=null, type=["assessment","tutor"], equated=false, locale=null) {
  return getActivitiesWithStudentInfo(students, limit, type, ["scored","rescored"], equated, locale)
    .then((activities) => {
      console.log("getActivities",activities)
      return activities.filter((activity)=> activity && activity.scores && activity.scores.wcpmScore > 0);
    });
}

export function getProgressActivitiesForStudents(students, limit=null, type=["assessment","tutor"], equated=false, locale) {
  if(locale === locales.ES_MX) equated=false; //We don't support equating for spanish yet
  const studentIds = students.map(({ id }) => getFormatedId(id));
  return studentRecordService.progressActivities(studentIds, limit, type, equated)
    .then((activities) => {
      activities = filterByDate(activities);
      activities = filterByLocale(activities,locale);

      if(Array.isArray(activities) && activities.length > 0){
        //return the activities with the student information
        return activities.map((activity) => ({
          ...activity,
          student: students.filter(({ id }) => getFormatedId(id) == activity.studentId)[0],
        }));
      }
      return [];
    }).then((activities) => {
      return activities.filter((activity)=> activity && activity.scores && activity.scores.wcpmScore > 0);
    });
}

function getActivitiesWithStudentInfo(students, limit=null, type=["assessment,tutor"], status=["scored","rescored","assigned","not_started","in_progress","scoring"], equated=false, locale){
  if(locale === locales.ES_MX) equated=false; //We don't support equating for spanish yet
  const studentIds = students.map(({ id }) => getFormatedId(id));
  return studentRecordService.studentActivities(studentIds, limit, type, status, equated)
    .then((activities) => {
      activities = filterByDate(activities);
      if(locale){
        activities = filterByLocale(activities,locale);
      }

      if(Array.isArray(activities) && activities.length > 0){
        //return the activities with the student information
        return activities.map((activity) => ({
          ...activity,
          student: students.filter(({ id }) => getFormatedId(id) == activity.studentId)[0],
        }));
      }
      return [];
    });
}

function getDefaultScores(inGrade){
  const default_scores = [
    {
        'areaScore': 5.200691551661794,
        'decodeScore': 79.56625405844156,
        'esriScore': 68.81435846200803,
        'phonAwareScore': 70.46186794464171,
        'vocabSize': 1911.5625,
        'wcpmScore': 36.46863990085196
    },
    {
        'areaScore': 6.303115044093312,
        'decodeScore': 85.62736687243763,
        'esriScore': 97.2541197320828,
        'phonAwareScore': 86.0491521913347,
        'vocabSize': 4495.773148148148,
        'wcpmScore': 50.836586565000836
    },
    {
        'areaScore': 7.003687317038951,
        'decodeScore': 90.82779859969637,
        'esriScore': 98.59781172056606,
        'phonAwareScore': 91.59326475798281,
        'vocabSize': 6012.501992031873,
        'wcpmScore': 82.07652562014665
    },
    {
        'areaScore': 7.805100135704936,
        'decodeScore': 92.61302800358887,
        'esriScore': 99.72856285704745,
        'phonAwareScore': 93.21768266287745,
        'vocabSize': 7125.880952380952,
        'wcpmScore': 93.50002711177387
    },
    {//###NEED Default scores for 4th
      'areaScore': 7.805100135704936,
      'decodeScore': 92.61302800358887,
      'esriScore': 99.72856285704745,
      'phonAwareScore': 93.21768266287745,
      'vocabSize': 7125.880952380952,
      'wcpmScore': 93.50002711177387
    },
    {//###NEED Default scores for 5th
      'areaScore': 7.805100135704936,
      'decodeScore': 92.61302800358887,
      'esriScore': 99.72856285704745,
      'phonAwareScore': 93.21768266287745,
      'vocabSize': 7125.880952380952,
      'wcpmScore': 93.50002711177387
    }
  ];

  return ((inGrade || (inGrade == 0)) && inGrade < default_scores.length) ? default_scores[inGrade] : default_scores[1];
}

export function endUserSession(){
  if(window.opener){
    window.open('', '_self').close();
  } else {
    if (userData_store.skipMagic) {
      window.location.href = "/sessionEnded.html";
    } else {
      location.reload();
    }
  }
}


let messageTimestamp = 0;
//https://stackoverflow.com/questions/28230845/communication-between-tabs-or-windows/28230846#28230846
// use local storage for messaging. Set message in local storage and clear it right away
// This is a safe way how to communicate with other tabs while not leaving any traces
//
export function message_broadcast(message)
{
  let messageToSend = {message: message};
  messageTimestamp = Date.now();
  messageToSend.timeStamp  = messageTimestamp;
  try{
    localStorage.setItem('amiraLogin',JSON.stringify(messageToSend));
    localStorage.removeItem('amiraLogin');
  }catch(err){
    console.log("could not shut down other windows");
  }

}


// receive message
//
export function message_receive(ev)
{
    if (!ev || ev.key!='amiraLogin') return; // ignore other keys
    var message=JSON.parse(ev.newValue);

    if (!message || (ev.oldValue && JSON.parse(ev.oldValue).timeStamp == messageTimestamp)) return; // ignore empty msg or msg reset

    if((message.message == 'logout') && (message.timeStamp > messageTimestamp)){
      console.log("End session because of other tab",ev);
      if(getUserData()){
        logSessionInfo("amira_session_launched_in_other_tab",{key: ev.key, value: ev.newValue, time: Date.now()})
        .then(()=>{
          endUserSession();
        })
        .catch((err)=>{
          console.log("ERROR",err);
          endUserSession()
        });
      }else{
        console.log("NO LOG - not signed in")
      }
    }
}



