// TODO consider moving these constants into the constants directory
export const readingLevels = {
  beginner: "beginner",
  capable: "capable",
  proficient: "proficient",
};

const gradeToProficiencyMapping = [
  readingLevels.beginner,
  readingLevels.beginner,
  readingLevels.capable,
  readingLevels.proficient,
  readingLevels.proficient,
  readingLevels.proficient
];

const proficientWPMCutoff = 75;
const capableWPMCutoff = 45;
const preWPMCutoff = 15;
const proficientErrorCutoff = 0.09;
const capableErrorCutoff = 0.20;
const preErrorCutoff = 0.50;

// TODO compare the child's speed to their own known speed,
// based on prior activities. For a child's first activity,
// use a norm for their specific age
// TODO double check Mark's accuracy values with Sharon or Billy
// (we should use a level that is about 15% below the typical accuracy rate for a student of this age)
const rushingThresholds = {
  kinder: {
    wpm: 15,
    errorRate: .25,
  },
  firstGrade: { // these values applicable for k-1
    wpm: 30,
    errorRate: .20,
  },
  secondGrade: {
    wpm: 70,
    errorRate: .15,
  },
  thirdGrade: {
    wpm: 90,
    errorRate: .1,
  },
  fourthGrade: {
    wpm: 90,
    errorRate: .1,
  },
  fifthGrade: {
    wpm: 90,
    errorRate: .1,
  },
}

// Misspelling matches API
const grade_dict = {
  0: "Kindergarden",
  1: "Firstgrade",
  2: "Secondgrade",
  3: "Thirdgrade",
  4: "Fourthgrade",
  5: "Fifthgrade",
}

let studentReadingLevel = readingLevels.beginner;
let studentGrade = null;
const GRADE_DEFAULT = 0;

export function setStudentReadingLevel(inLevel){
  //TODO add validation
  studentReadingLevel = inLevel;
}

export function getStudentReadingLevel(){
  return studentReadingLevel;
}

export function setStudentGradeLevel(grade) {
  // TODO add validation
  studentGrade = grade;
}

export function setStudentGradeLevelWithAREA(inArea){
  if(inArea < 6){
    studentGrade = 0;
  }else{
    if(inArea < 7){
      studentGrade = 1;
    }else{
      if(inArea < 8){
        studentGrade = 2;
      }else{
        if(inArea <9 )
          studentGrade = 4;
        else{
          studentGrade = 5;
        }
      }
    }
  }
  //###setStudentLevelByGrade(studentGrade);
  return studentGrade;
}

export function setStudentLevelByGrade(inGrade){
  let grade = (inGrade > gradeToProficiencyMapping.length-1) ? (gradeToProficiencyMapping.length-1) : inGrade;
  studentReadingLevel = gradeToProficiencyMapping[grade];
}

export function getStudentGradeLevel(noDefault=false){
  return noDefault ? studentGrade : (studentGrade || GRADE_DEFAULT);
}

export function updateStudentReadingLevel(wpm,accuracy){
  let errorRate = 1-(accuracy/100);
  let newLevel = readingLevels.beginner;

  if((wpm > proficientWPMCutoff) && (errorRate < proficientErrorCutoff)){
    newLevel = readingLevels.proficient;
  }
  else if((wpm > capableWPMCutoff) && (errorRate < capableErrorCutoff)){
    newLevel = readingLevels.capable;
  }
  else if((wpm < preWPMCutoff) && (errorRate < preErrorCutoff)){
    //newLevel = readingLevels.pre; ###We don't support PRE anywhere. Keep here for when we do
  }
  setStudentReadingLevel(newLevel);
}

// This method attempts to discern whether the user is rushing.
// We're currently using the most recently calculated wpm and accuracy to make
// this determination.
// Note: current wpm calculation is based on *how far the student gets in the story*,
// NOT the length of their transcript
//
// Returns true if the reader is rushing
export function detectRushing(wpm, accuracy) {
  let errorRate = 1-(accuracy/100);
  // TODO: incorporate skips into this detection (potentially post-MVP)
  if (!wpm || !accuracy) {
    return false;
    console.log('error: invalid detectRushing params');
  }

  let gradeThresholds;
  switch(studentGrade) {
    case 0:
      gradeThresholds = rushingThresholds.kinder;
      break;
    case 1:
      gradeThresholds = rushingThresholds.firstGrade;
      break;
    case 2:
      gradeThresholds = rushingThresholds.secondGrade;
      break;
    case 3:
      gradeThresholds = rushingThresholds.thirdGrade;
      break;
    case 4:
      gradeThresholds = rushingThresholds.fourthGrade;
      break;
    case 3:
      gradeThresholds = rushingThresholds.fifthGrade;
      break;
    default:
      console.log('error: grade out of range');
      gradeThresholds = rushingThresholds.firstGrade;
  }
  let wpmThreshold = gradeThresholds.wpm;
  let errorThreshold = gradeThresholds.errorRate;

  if(wpm > wpmThreshold && errorRate > errorThreshold) {
    return true;
  }
  return false;
}
