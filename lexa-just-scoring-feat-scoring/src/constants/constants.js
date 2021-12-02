// Types of action taken by AI
export const actionTypes = {
  word: 'word',
  phrase: 'phrase',
  WORD_PREP: 'WORD_PREP', // currently, calculating pause time
};

//Types of ending errors in a word
export const wordEndingErrorType = {
  ADDED: 'added',
  DROPPED: 'dropped',
  MIX: 'mix',
};

export const NO_RESPONSE = 'NO_RESPONSE_EMPTY';

//Types of Users
export const userTypes = {
  TEACHER: 'teacher',
  STUDENT: 'student',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  DISTRICT_ADMIN: 'DISTRICT_ADMIN'
};

//Type of Questions, used for Quiz Component
export const QUESTION_TYPE = {
  CLOZE: 'cloze',
  MULTI: 'multi',
};

//Type of Assignment
export const assignmentTypes = {
  ASSESSMENT: 'assessment',
  TUTOR: 'tutor',
  DYSLEXIA: 'dyslexia',
  NWF: 'nwf',
  SPELLING: 'spelling',
  LISTENING_COMPREHENSION: 'listeningComprehension',
  READING_COMPREHENSION: 'readingComprehension',
  VOCABULARY_SCREENER: 'vocabularyScreener',
};

//Activity status
export const activityStatus = {
  ASSIGNED: 'assigned',
  SCORING_NOT_STARTED: 'not_started',
  SCORING_IN_PROGRESS: 'in_progress',
  SCORED: 'scored',
  RESCORED: 'rescored',
  ABORTED: 'aborted',
  COMPLETED: 'completed',
  UNDER_REVIEW: 'underReview',
}

// This constant influences available M/S/B.
// Most reports have type default.
// Currently, all admin reports only have ORF available.
// Dyslexia report has a unique M/S/B.
export const msbType = {
  DEFAULT: 'DEFAULT',
  ORF: 'ORF',
  DYSLEXIA: 'DYSLEXIA',
  COMPREHENSIVE: 'COMPREHENSIVE',
}

export const contentTags = {
  PICTURE_STORY: 'PICTURE_STORY',
  EARLY_READER_WORD_LIST: 'EARLY_READER_WORD_LIST',
  EARLY_READER_READ_WITH_ME: 'EARLY_READER_READ_WITH_ME',
  EARLY_READER_REPETITIVE_TEXT: 'EARLY_READER_REPETITIVE_TEXT',
  EARLY_READER_SEQUENCE_END: 'EARLY_READER_SEQUENCE_END',
}

export const recommendationModes = {
  SEQUENCE_LOCKED: 'SEQUENCE_LOCKED',
  SEQUENCE_EXPIRES: 'SEQUENCE_EXPIRES',
  NO_SEQUENCE: 'NO_SEQUENCE',
}

export const locales = {
  EN_US: 'EN-US',
  ES_MX: 'ES-MX',
}