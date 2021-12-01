import Amplify, { API, graphqlOperation } from 'aws-amplify';
import aws_exports from '../aws-exports';
import { getRecommendedStories } from './API';
import {activityStatus, assignmentTypes, recommendationModes} from '../constants/constants';
import {formatLocale_UpperCaseUnderscore} from "Services/util";
const request = require('superagent');

Amplify.configure(aws_exports);


/***************************************************************************
*
* GRAPHQL QUERIES
*
****************************************************************************/

const GQL_ALL_REPORTS = `
query studentReport($studentId: String!){
  studentReport(studentId: $studentId){
    diagnosis{
      phon {
        id
        label
        contents{
          fields
        }
      }
      sight {
        id
        label
        contents{
          fields
        }
      }
      vocab {
        id
        label
        contents{
          fields
        }
      }
    }
  },
  diagnosis{
    phon {
      id
      label
      contents{
        fields
      }
    }
    sight {
      id
      label
      contents{
        fields
      }
    }
    vocab {
      id
      label
      contents{
        fields
      }
    }
  }
}`;

// query to fetch a detailed activity object, complete with wav file
// used on scoring page
const GQL_OP_ACTIVITY_BY_ID = `
query Activity($activityId: [String]!) {
  getActivity(activityId: $activityId) {
    activityId
    type
    studentId
    story {
      storyId
      title
      chapters {
        phrases
      }
    }
    audio {
      url
    }
    createdAt
    updatedAt
    score
    status
    errors
    flagging {
      triggered
    }
    timeRead
    mispronunciations
    skips
    selfCorrections
  }
}`;

// shallow query to fetch attributes of the child of an activity object
const GQL_OP_GETCHILD = `
query Activity($activityId: [String]!) {
  getActivity(activityId: $activityId) {
    children{
      activityId
      type
      status
    }
  }
}`;

const GQL_OP_GET_CHILD_ERRORS = `
query Activity($activityId: [String]!) {
  getActivity(activityId: $activityId) {
    children{
      activityId
      type
      status
      errors
    }
  }
}`;

const GQL_OP_ACTIVITY_ERRORS_BY_ID = `
query Activity($activityId: [String]!) {
  getActivity(activityId: $activityId) {
    errors
    flagging {
      triggered
    }
  }
}`;

// gets a complete story by id
const GQL_OP_STORY_BY_ID = `
query GetStory($storyId: String!,$locale: String) {
  getAmiraStoryById(storyid: $storyId) {
    storyid
    grade
    author
    title
    type,
    nonAudio,
    tags,
    chapters(locale: $locale){
      phrases
      items{
        type
        assetURL
        videoURL
        imageURL
        writtenInstructions
        timeoutInMS
        questions{
          correct
          distractors
          feedbackMode
          readQuestion
          text
        }
        predictionQuestions{
          correct
          distractors
          text
        }
        instructions{
          verbalInstructions
          repeatable
          repeatVariation
          videoURL
          imageURL
          text
          type
          transition
        }
      }
    }
    questions {
      text
      distractors
      correct
    }
  }
}`;

// gets a list of stories
// for now this is being used in place of recommendations
const GET_STORIES = `
query Stories {
  stories {
    storyId
    title
    chapters {
      phrases
    }
  }
}`;

const RECOMMEND = `
  query storyRecommendationService(
    $studentID: String,
    $studentGrade: String!,
    $storyType: String!,
    $numStoriesToReturn: Int!,
    $storyID: String,
    $mode: RecommendationMode
    $locale: StoryLocale){
    storyRecommendationService  (filter: {
    studentID: $studentID
    studentGrade: $studentGrade
    storyType: $storyType
    numStoriesToReturn: $numStoriesToReturn
    storyID: $storyID
    mode: $mode
    locale: $locale
    }){
      storyid
      title
      tags
      AREA_85
      AREA_95
    }
  }`;

// returns a list of sparse activy objects
// to be used on teacher activities (student search) page
// eventually this will need to be integrated with SIS
const GQL_ACTIVITIES = `
query GetStory($limit: Int!) {
  activities(limit: $limit) {
    activityId
    studentId
    createdAt
    updatedAt
    score
    timeRead
    student {
      studentId
      lastName
      firstName
    }
    scores {
      areaScore
      esriScore
      phonAwareScore
      vocabSize
      wcpmScore
    }
    status
  }
}`

const GQL_STUDENT_ACTIVITIES = `
query studentActivities($studentId: [String]!, $limit: Int, $activityType: [String]!, $status: [String], $equated: Boolean) {
  studentActivities(studentId: $studentId, limit: $limit, filter: {activityType: $activityType, status: $status, equatedScores: $equated}) {
    activityId
    studentId
    children{
      activityId
      type
      status
      displayStatus
      errors
    }
    createdAt
    updatedAt
    timeRead
    score
    errors
    flagging {
      triggered
    }
    type
    scores {
      areaScore
      esriScore
      phonAwareScore
      vocabSize
      wcpmScore
      decodeScore
    }
    status
    tags
    displayStatus
    story{
      tags
    }
  }
}`

const GQL_GET_TEST_METADATA = `
query studentActivities($studentId: [String]!, $limit: Int, $activityType: [String]!, $status: [String], $equated: Boolean) {
  studentActivities(studentId: $studentId, limit: $limit, filter: {activityType: $activityType, status: $status, equatedScores: $equated}) {
    activityId
    storyId
    createdAt
    updatedAt
    story{
      tags
    }
    status
    displayStatus
    tags
  }
}`

const GQL_PROGRESS_ACTIVITIES = `
query studentActivities($studentId: [String]!, $limit: Int, $activityType: [String]!, $status: [String], $equated: Boolean ) {
  studentActivities(studentId: $studentId, limit: $limit, filter: {activityType: $activityType, status: $status, equatedScores: $equated}) {
    activityId
    studentId
    story {
      title
      grade
    }
    createdAt
    updatedAt
    sessionTime
    score
    type
    errors
    tags
    scores {
      areaScore
      esriScore
      phonAwareScore
      vocabSize
      wcpmScore
      decodeScore
    }
    children{
      type
      errors
      status
      displayStatus
    }
  }
}`

const GQL_CHECK_ASSIGNMENTS = `
query studentActivities($studentId: [String]!) {
  studentActivities(studentId: $studentId filter: {activityType: ["assessment","dyslexia","nwf","spelling","listeningComprehension","readingComprehension","vocabularyScreener"], status: ["assigned","scored","rescored","not_started","scoring","in_progress","underReview"]}, limit: 30) {
    activityId
    type
    status
    displayStatus
    createdAt
    parentId
    tags
    children{
      type
      activityId
      status
      displayStatus
      tags
    }
    story{
      tags
    }
  }
}`

const GQL_CHECK_SCORED = `
query studentActivities($studentId: [String]!) {
  studentActivities(studentId: $studentId filter: {activityType: ["assessment","tutor"], status: ["scored","rescored","not_started","scoring","in_progress","underReview"]}, limit: 30) {
    activityId
    storyId
    type
    status
    displayStatus
    tags
    children{
      type
      activityId
    }
  }
}`

const GQL_DYSLEXIA_ACTIVITIES = `
query studentActivities($studentId: [String]!, $limit: Int, $activityType: [String]!, $status: [String]) {
  studentActivities(studentId: $studentId, limit: $limit, filter: {activityType: $activityType, status: $status}) {
    activityId
    studentId
    createdAt
    status
    displayStatus
    tags
    scores{
      dyslexiaRiskCategory
      dyslexiaRiskIndicator
    }
  }
}`

// updates the error list of an activity and changes its status to rescored
const UPDATE_ACTIVITY = `
mutation UpdateActivity($activityId: String!, $sessionTime: Int, $errors: [[Boolean]], $score: Int, $skips: [Int], $selfCorrections: [Int], $mispronunciations: [Int],$timeRead: Int, $status: String, $displayStatus: String, $storyId: String, $parentId: String, $displayStatus: String, $responses: [[String]]) {
  updateActivity(activityId: $activityId, sessionTime: $sessionTime, status: $status, displayStatus: $displayStatus, errors: $errors, score: $score, skips: $skips, selfCorrections: $selfCorrections, mispronunciations: $mispronunciations, timeRead: $timeRead, status: $status, storyId: $storyId, parentId: $parentId, displayStatus: $displayStatus, responses: $responses) {
    activityId
  }
}`

const UPDATE_FLAG = `
mutation updatePhraseFlag($activityId: String!, $phraseIndex: Int, $triggered: Boolean){
  process(activityId: $activityId, phraseIndex: $phraseIndex, triggered: $triggered){
    triggered
  }
}`

const INITIAL_SCORE = `
mutation UpdateActivity($activityId: String!, $errors: [[Boolean]]!, $score: Int) {
  updateActivity(activityId: $activityId, status: "scored", errors: $errors, score: $score) {
    activityId
  }
}`;

// creates an activity with a type, an SIS student id, and a story id
const CREATE_ACTIVITY = `
mutation PutActivity($type: String!, $studentId: String!, $storyId: String!, $status: String, $displayStatus: String,$districtId: String, $schoolId: String, $tags: [ActivityTags]) {
  putActivity(type: $type, studentId: $studentId, storyId: $storyId, status: $status, displayStatus: $displayStatus, districtId: $districtId, schoolId: $schoolId, tags: $tags) {
    activityId
    type
    status
    storyId
    districtId
    schoolId
    tags
  }
}`;

const GQL_GET_LICENSING =`
query getLicensing($districtId: Int!, $schoolId: Int!){
  getAmiraLicenses(districtId: $districtId, schoolId: $schoolId) {
    tutorEnabled
    assessmentEnabled
    assessmentPageNavEnabled
    autoAssign
    demoMode
    dyslexiaEnabled
    dyslexiaTestEnabled
    formOverrides{
      dyslexia
      nwf
      spelling
      listeningComprehension
      assessment
    }
    locale
    letternameConfig
    listeningCompConfig
    readingCompConfig
    vocabularyScreenerConfig
    schoolYearStartDate
    screenerEnabled
    screeningStartDate
    screeningEndDate
    spanishConfig
    spellingConfig
    tutorWhitelist
    nwfConfig
    progressMonitoring
    texasResources
  }
}`;

const GQL_SKILL_FRAGMENT = `
  fragment skill on Skill {
    skillId
    name
    level
    resources {
      example {
        content
        resourceId
      }
      reference {
        url
        resourceId
        provider
        branding
        resourceIcon
        label
      }
    }
  }
`;

const GQL_SKILLGROUP_FRAGMENT = `
  fragment skillGroup on SkillGroup {
    percentileRank,
    LikelyMastered {
      ...skill
    }
    AppropriatelyChallenging {
      ...skill
    }
    VeryChallenging {
      ...skill
    }
  }
`;

const GQL_GET_DIAGNOSTIC_SKILLS = `
  query Skill($studentId: String!) {
    getSkills(studentId: $studentId) {
      decoding(limit: 3) {
        ...skillGroup
      }
      vocabulary(limit: 3) {
        ...skillGroup
      }
      phonologicalAwareness(limit: 3) {
        ...skillGroup
      }
      sightRecognition(limit: 3) {
        ...skillGroup
      }
    }
  }
  ${GQL_SKILLGROUP_FRAGMENT}
  ${GQL_SKILL_FRAGMENT}
`;



const ENTITY_EXPORTS =`
query entityReports($entityId: String!, $entityType: String!){
  entityReports(entityId: $entityId, entityType: $entityType){
    entityId
    createdAt
    entityType
    status
  }
}`

const REQUEST_ENTITY_CSV_EXPORT =`
mutation exportEntityReport($entityId: String!, $entityType: String!){
  exportEntityReport(entityId: $entityId, entityType: $entityType){
    entityId
    createdAt
    entityType
    status
  }
}`

/*const onUpdateActivity = `subscription OnUpdateActivity($activityId: String) {
  onUpdateActivity(activityId: $activityId) {
    errors
  }
}
`;*/

export const onUpdateActivity = `
subscription OnUpdateActivity($activityId: String) {
  onUpdateActivity(activityId: $activityId) {
    errors
  }
}
`;


const CREATE_TUTOR_JOB = `
mutation createNrt($activityId: String!) {
  createNrtJob(activityId: $activityId) {
    activityId
    currentPass
    passes {
      model
      asr
      featureBatchFormat
      featureExtractor
      languageCode
      pipeline
      qualityAlgorithm
      scalingOverride
      slicingConfig
    }
    state
    updatedAt
    updatedBy
  }
}`



/***************************************************************************
*
* JS FUNCTIONS
*
****************************************************************************/

export default {
  async getStudentReport(studentId) {
    const data = await API.graphql(graphqlOperation(GQL_DIAGNOSTIC_REPORT, { studentId }));
    return data;
  },
  async scoreActivity(activityId, errors, score, skips, selfCorrections, mispronunciations,timeRead) {
    const displayStatus = activityStatus.RESCORED;
    const status = activityStatus.RESCORED;
    const data = await API.graphql(graphqlOperation(UPDATE_ACTIVITY, { activityId, errors, score, skips, selfCorrections, mispronunciations,timeRead, displayStatus, status }));
    console.log('DATA:', data);
    return data;
  },
  async scoreTutoring(activityId,errors,timeRead){
    const status = activityStatus.SCORED;
    const displayStatus = activityStatus.COMPLETED;
    const data = await API.graphql(graphqlOperation(UPDATE_ACTIVITY, {activityId,errors,timeRead,status,displayStatus}));
    console.log("scoreTutoring",data);
    return data;
  },
  async setParent(activityId,parentId){
    if(!activityId || !parentId) return null;

    const data = await API.graphql(graphqlOperation(UPDATE_ACTIVITY, {activityId,parentId}));
    return data;
  },
  async getChild(activityId,parentId){
    const data = await API.graphql(graphqlOperation(GQL_OP_GETCHILD, {activityId}));
    return data.data.getActivity[0].children;
  },
  async getChild(activityId,parentId){
    const data = await API.graphql(graphqlOperation(GQL_OP_GET_CHILD_ERRORS, {activityId}));
    return data.data.getActivity[0].children;
  },
  async startActivity(activityId,storyId){
    //Don't set the status here.
    const data = await API.graphql(graphqlOperation(UPDATE_ACTIVITY, {activityId,storyId}));
    console.log(data);
    return data.data.updateActivity;
  },
  async markCompleted(activityId,displayStatus){
    let status = activityStatus.SCORING_NOT_STARTED;
    const data = await API.graphql(graphqlOperation(UPDATE_ACTIVITY, {activityId,status,displayStatus}));
    return data.data.updateActivity;
  },
  async markInprogress(activityId){
    let status = activityStatus.SCORING_IN_PROGRESS;
    const data = await API.graphql(graphqlOperation(UPDATE_ACTIVITY, {activityId,status}));
    return data.data.updateActivity;
  },
  async markAbortedKeepingAssignment(activityId,displayStatus=activityStatus.ABORTED){
    let status = activityStatus.ASSIGNED;
    const data = await API.graphql(graphqlOperation(UPDATE_ACTIVITY, {activityId, displayStatus, status}));
    return data.data.updateActivity;
  },
  async markAborted(activityId,displayStatus=activityStatus.ABORTED){
    let status = activityStatus.SCORING_NOT_STARTED;
    const data = await API.graphql(graphqlOperation(UPDATE_ACTIVITY, {activityId, displayStatus, status, displayStatus}));
    return data.data.updateActivity;
  },
  async updateStatus(activityId,displayStatus){
    if(!displayStatus) return Promise.reject("no display status");
    const data = await API.graphql(graphqlOperation(UPDATE_ACTIVITY, {activityId, displayStatus}));
    return data.data.updateActivity;
  },
  async primaryScore(activityId, errors, score) {
    const data = await API.graphql(graphqlOperation(INITIAL_SCORE, { activityId, errors, score }));
    console.log('DATA:', data);
    return data;
  },
  async saveTextResponses(activityId, errors, responses) {
    let displayStatus = activityStatus.COMPLETED;
    const data = await API.graphql(graphqlOperation(UPDATE_ACTIVITY, { activityId, errors, responses, displayStatus }));
    console.log('DATA:', data);
    return data;
  },
  async activities(limit) {
    const data = await API.graphql(graphqlOperation(GQL_ACTIVITIES, { limit }));
    console.log('DATA:', data);
    return data.data.activities.filter((activity)=>{return activity && activity.scores && activity.scores.wcpmScore > 0});
  },
  async studentActivities(studentId, limit=1, activityType=["assessment","tutor"], status=["scored","rescored","assigned","not_started","in_progress","scoring"], equated = false) {
    try{
      const data = await API.graphql(graphqlOperation(GQL_STUDENT_ACTIVITIES, { studentId, limit, activityType, status, equated }));
      return data.data.studentActivities;
    }catch(err){
      console.log("Error Fetching one or more activities:",err.errors);
      return err.data.studentActivities;
    }
  },
  async getTestMetadata(studentId, limit=1, activityType=["assessment","tutor"], status=["scored","rescored","assigned","not_started","in_progress","scoring"], equated = false) {
    const data = await API.graphql(graphqlOperation(GQL_GET_TEST_METADATA, { studentId, limit, activityType, status, equated }));
    return data.data.studentActivities;
  },
  async progressActivities(studentId, limit=1, activityType=["assessment","tutor"], equated = false) {
    let status = ["scored","rescored"];
    try{
      const data = await API.graphql(graphqlOperation(GQL_PROGRESS_ACTIVITIES, { studentId, limit, activityType, status, equated }));
      return data.data.studentActivities;
    }catch(err){
      console.log('ERROR - while fetching progress activities: ',err);
      return err.data.studentActivities;
    }
  },
  async dyslexiaActivities(studentId, limit=1, status=["scored","rescored"]) {
    let activityType = 'dyslexia';
    const data = await API.graphql(graphqlOperation(GQL_DYSLEXIA_ACTIVITIES, { studentId, limit, activityType, status }));
    return data.data.studentActivities;
  },
  async getAssignedStory(studentId, activityType = ["assessment","dyslexia","nwf","spelling","listeningComprehension"], limit = 1){
    const status = [activityStatus.ASSIGNED];
    const data = await API.graphql(graphqlOperation(GQL_STUDENT_ACTIVITIES, { studentId, limit, activityType, status }));
    console.log("getAssigned:", data);
    return data.data.studentActivities;
  },
  async checkForAssignments(studentId){
    const data = await API.graphql(graphqlOperation(GQL_CHECK_ASSIGNMENTS, {studentId}));
    console.log("checkAssigned:", data);
    return data.data.studentActivities;
  },
  async checkForCompletedActivities(studentId){
    const data = await API.graphql(graphqlOperation(GQL_CHECK_SCORED, {studentId}));
    console.log("checkCompleted:", data);
    return data.data.studentActivities;
  },
  async getActivity(singleActivityId) {
    let activityId = [];
    activityId.push(singleActivityId);
    const data = await API.graphql(graphqlOperation(GQL_OP_ACTIVITY_BY_ID, { activityId }));
    console.log('DATA:', data);
    return data;
  },
  async getErrors(singleActivityId) {
    let activityId = [];
    activityId.push(singleActivityId);
    const data = await API.graphql(graphqlOperation(GQL_OP_ACTIVITY_ERRORS_BY_ID, { activityId }));
    console.log('Errors:', data);
    return data;
  },
  async getStory(storyId,locale="en-us") {
    const data = await API.graphql(graphqlOperation(GQL_OP_STORY_BY_ID, { storyId, locale }));
    data.data.getAmiraStoryById.storyId = data.data.getAmiraStoryById.storyid;
    console.log('GetStory:', storyId,locale,data);
    return data.data.getAmiraStoryById;
  },
  async getStories() {
    const data = await API.graphql(graphqlOperation(GET_STORIES, { }));
    console.log('DATA:', data);
    return data;
  },
  async getRecommendedStories(studentID,studentGrade,storyType,numStoriesToReturn,storyID="",mode=recommendationModes.SEQUENCE_EXPIRES,locale){
    //TODO: start passing locale all the way back to the back end when the dependency is ready
    locale = formatLocale_UpperCaseUnderscore(locale);
    const data = await API.graphql(graphqlOperation(RECOMMEND,{studentID,studentGrade,storyType,numStoriesToReturn,storyID,mode,locale}));
    return data.data.storyRecommendationService.map((story)=>{
      story.storyId = story.storyid;
      return story;
    });
  },
  async createActivity(type, studentId, storyId, status=activityStatus.SCORING_NOT_STARTED, callback=null,displayStatus,districtId=null,schoolId=null, tags=[]) {
    try{
      let data = await API.graphql(graphqlOperation(CREATE_ACTIVITY, { type, studentId, storyId, status, displayStatus,districtId,schoolId,tags }));
      console.log('createActivity:', data);
      return data;
    }catch(err){
      if(callback){
        callback();
      }
      console.error("Failed to Create Activity. Activity will not be saved. ", err);
    }
  },
  async getEntitlements(districtId,schoolId){
    const data = await API.graphql(graphqlOperation(GQL_GET_LICENSING, {districtId,schoolId}));
    console.log("getEntitlements",data.data.getAmiraLicenses);
    return data.data.getAmiraLicenses;
  },
  async requestCSVExport(entityId,entityType){
    const data = await API.graphql(graphqlOperation(REQUEST_ENTITY_CSV_EXPORT, {entityId,entityType}));
    return data;
  },
  async getEntityReports(entityId,entityType){
    const data = await API.graphql(graphqlOperation(ENTITY_EXPORTS, {entityId,entityType}));
    return data;
  },
  async subscribeToErrorUpdates(activityId,callback=null){
    const subscription = await API.graphql(
      graphqlOperation(onUpdateActivity,{activityId: activityId})
    )

    subscription.subscribe({
      next: (resp) => {
        console.log("SUBSCRIPTION",Date.now(),resp,subscription); //TODO: Remove once happy with error detection
        if(resp && resp.value.data && resp.value.data.onUpdateActivity && resp.value.data.onUpdateActivity.errors){
          callback(resp.value.data.onUpdateActivity.errors);
        }else{
          callback(null);
        }
      },
      error: (err) => console.log(err)
    });
  },
  async updateFlaggedPhrase(activityId,phraseIndex,triggered){
    const data = await API.graphql(graphqlOperation(UPDATE_FLAG, {activityId, phraseIndex, triggered}));
    return data;
  },
  async createEPSJob(activityId) {
    const payload = {query: CREATE_TUTOR_JOB, variables: {activityId: activityId}};
    const resp = await request.post(process.env.EPS_BASE_URL)
        .set('x-api-key', process.env.EPS_API_KEY)
        .set('Content-Type', 'application/json')
        .send(payload);
    const { body } = resp;

    if (body.errors) {
      console.log(body.errors)
      throw new Error(body.errors[0].message);
    }
    return body.data;
  },
};
