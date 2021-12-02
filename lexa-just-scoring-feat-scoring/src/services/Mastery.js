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

let studentReadingLevel = readingLevels.beginner;

export function setStudentReadingLevel(inLevel){
  //TODO add validation
  studentReadingLevel = inLevel;
}

export function setStudentLevelByGrade(inGrade){
  let grade = (inGrade > gradeToProficiencyMapping.length-1) ? (gradeToProficiencyMapping.length-1) : inGrade;
  studentReadingLevel = gradeToProficiencyMapping[grade];
}

export function getStudentReadingLevel(){
  return studentReadingLevel;
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