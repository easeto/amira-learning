export function getProgressReport(studentId){
  return {
    data: [105, null, 110, null, 128, null, 130, null, 135, 140, null, null],
    poorCutoff: [110, 112, 115, 117, 115, 120, 123, 125, 127, 125, 129, 130],
    averageCutoff: [20, 18, 20, 15, 22, 15, 12, 10, 12, 14, 14, 9],
    goodCutoff: [20, 20, 15, 18, 13, 15, 15, 15, 11, 11, 7, 11],
    studentName: "Rebecca",
    studentId: studentId,
  };
}

export function getBenchmarkReport(classId){
  return {
    scoreData: [{name: "Rebecca", score: 140, marker: 130}, {name: "Sam", score: 90}, {name: "Allison", score: 100}, {name: "Josh", score: 130}, {name: "Susan", score: 120}],
    classId: classId,
    cutLine: 120,
    averageCutoff: 120,
    poorCutoff: 100,
  };
}