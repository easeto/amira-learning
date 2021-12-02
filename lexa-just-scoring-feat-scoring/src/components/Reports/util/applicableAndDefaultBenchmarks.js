
export function generateApplicableGrades(students) {
  let grades = [];
  for(let i = 0; i < students.length; i++) {
    if(!grades.includes(students[i].grade)) {
      grades.push(students[i].grade);
    }
  }
  return grades;
}

// TODO generalize this function for districts and schools
// TODO consolidate this function with "generateBenchmarkOptions"
// TODO consider whether the consolidated function should be called from TeacherSelections
export function generateDistrictBenchmarkOptions(applicableGrades) {
  // TODO make this more robust, so that users don't have to define every grade for their custom benchmarks
  let benchmarks = [];
  applicableGrades = applicableGrades.sort();
  applicableGrades = applicableGrades.filter(grade=>grade <=3); //TODO: Remove these when we get custom benchmarks for 4&5
  if(applicableGrades.length == 1) {
    benchmarks = benchmarks.concat(applicableGrades.map(grade => {
      return {
        value: 'District_' + grade,
        label: 'District',
        grade,
      }
    }));
  } else {
    benchmarks = benchmarks.concat(applicableGrades.map(grade => {
      let label = grade == 0 ? 'District - Kindergarten' : ('District - Grade ' + grade);
      return {
        value: 'District_' + grade,
        label,
        grade,
      }
    }));
  }
  return benchmarks;
}

// generate a list of available benchmark options
// TODO Reconsider this function
export function generateBenchmarkOptions(metric, district, applicableGrades) {
  let rawBenchmarksData = metric.benchmarks;

  if(rawBenchmarksData.length == 0) {
    return [{
      label:'not applicable',
      value:'none',
      id:'none',
      grade: 0,
    }];
  }

  // generate options for each season and applicable grade, per benchmark
  let benchmarks = [];
  rawBenchmarksData.forEach(benchmark => {
    if(!benchmark.grades) {
      benchmark.grades = [];
    }

    // Match available grades on relevant grades. This is necessary because
    // some benchmarks may not support every grade.
    // Don't label by grade unless there's more than one grade.
    let filteredGrades = benchmark.grades.filter(grade => applicableGrades.includes(grade));
    if(applicableGrades.length == 1) {
      benchmarks = benchmarks.concat(filteredGrades.map(grade => {
        return {
          value: benchmark.value + '_' + grade,
          label: benchmark.label,
          grade,
        }
      }));
    } else {
      benchmarks = benchmarks.concat(filteredGrades.map(grade => {
        let labelSuffix = grade == 0 ? ' - Kindergarten' : (' - Grade ' + grade);
        return {
          value: benchmark.value + '_' + grade,
          label: benchmark.label + labelSuffix,
          grade,
        }
      }));
    }
  });

  if(metric.value === 'ORF') {
    const districtBenchmarks = generateDistrictBenchmarkOptions(applicableGrades);
    benchmarks = benchmarks.concat(districtBenchmarks);
  }

  if(benchmarks.length === 0) {
    return [{
      label:'not applicable',
      value:'none',
      id:'none',
      grade: 0,
    }];
  }
  return benchmarks;
}

export function getDefaultBenchmark(benchmarks, applicableGrades, cachedBenchmark) {
  const defaultBenchmarkToReturn = {
    label:'not applicable',
    value:'none',
    id:'none',
    grade: 0,
  };

  let defaultBenchmark = defaultBenchmarkToReturn;

  // If benchmarks exist for this metric
  // TODO account for district benchmark type
  // TODO handle the case where benchmark doesn't support the grade
  if(benchmarks && benchmarks.length >= 1 && applicableGrades) {
    if(!cachedBenchmark) {
      defaultBenchmark = benchmarks.find(benchmark => (benchmark.grade === applicableGrades[0]));
    } else {
      if(applicableGrades.includes(cachedBenchmark.grade)) {
        defaultBenchmark = benchmarks.find(benchmark => benchmark.value === cachedBenchmark.value);
      } else {
        defaultBenchmark = benchmarks.find(benchmark => (benchmark.grade === applicableGrades[0]));
      }
    }
  }
  if(!defaultBenchmark){
    defaultBenchmark = defaultBenchmarkToReturn;
  }
  return defaultBenchmark;
}

export default {
  generateBenchmarkOptions,
  getDefaultBenchmark,
  generateApplicableGrades,
  generateDistrictBenchmarkOptions,
}