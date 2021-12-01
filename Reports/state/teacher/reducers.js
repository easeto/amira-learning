// External Dependencies
import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';
import set from 'lodash.set';

// Internal Dependencies
import types from './constants';
import {locales, msbType} from '../../../../constants/constants';
import { metrics, dyslexiaMetric, comprehensiveAssessmentMetrics } from '../../values/metrics';
import { schoolBenchmarksDirectory } from '../../../../dummy_data/schoolBenchmarksDirectory';
import {
  generateBenchmarkOptions,
  getDefaultBenchmark,
  generateApplicableGrades
} from '../../util/applicableAndDefaultBenchmarks';
import {
  getMostRecentMSB,
  setMostRecentMSB,
  getMostRecentEquating,
  setMostRecentEquating,
  getMostRecentLocale,
  setMostRecentLocale, setMostRecentReadingRisks, getMostRecentReadingRisks,
} from '../../../../services/teacher/recentTeacherSelections';

const defaultReducer = (state, action) => (state);

const teacherCustomBenchmarksPending = (state, action) => {
  let next = cloneDeep(state);
  if(!next.customBenchmarks) {
    next.customBenchmarks = {};
  }
  next.customBenchmarks.status = 'PENDING';
  return next;
}

const teacherCustomBenchmarksComplete = (state, action) => {
  let next = cloneDeep(state);
  if(!next.customBenchmarks) {
    next.customBenchmarks = {};
  }
  next.customBenchmarks.status = 'COMPLETE';
  next.customBenchmarks.district = action.benchmarkData;
  return next;
}

const teacherSelect = (state, action) => {
  let next = cloneDeep(state);
  const selection = action.selection;
  const district = action.district;
  const students = action.students;

  if(selection.type == "equating") {
    next.equatingSelection = selection.data;
    // Cache equating selection as most recent
    setMostRecentEquating(next.equatingSelection);
  } else if (selection.type === "locale") {
    next.selectedLocale = selection.data;
    setMostRecentLocale(next.selectedLocale);
  } else if (selection.type === "readingRisks") {
    next.selectedReadingRisks = selection.data;
    setMostRecentReadingRisks(next.selectedReadingRisks)
  }

  if(selection.type === "metric") {
    const {selections, scales, benchmarks} = resetAvailableScalesAndBenchmarks(selection.data, district, students);
    next.selections = selections;
    next.scales = scales ? scales : [];
    next.benchmarks = benchmarks ? benchmarks : [];
  } else {
    if(selection.type === 'benchmark') {
      if(selection.data.grade || selection.data.grade == 0) {
        next.grade = selection.data.grade;
      } else {
        console.log('error: invalid benchmark');
      }
    }
    set(next, 'selections', merge(next.selections, {[selection.type]: selection.data}));

    // TODO: analyze why cloneDeep makes this necessary
    next.scales = state.scales;
    next.selections.metric.scales = state.scales;
    next.benchmarks = state.benchmarks;
  }

  // Cache selections as most recent
  setMostRecentMSB(next.selections);

  return next;
}

const teacherDefaultSelections = (state, action) => {
  let next = cloneDeep(state);
  const district = action.district;
  const students = action.students;
  const cachedSelections = getMostRecentMSB();

  let cachedEquatingSelection = getMostRecentEquating();
  if(cachedEquatingSelection == null) {
    cachedEquatingSelection = true;
  }

  let cachedLocale = getMostRecentLocale();
  if(cachedLocale === null){
    cachedLocale = locales.EN_US;
  }

  let cachedReadingRisksSelections = getMostRecentReadingRisks();
  if(cachedReadingRisksSelections === null){
    cachedReadingRisksSelections = [locales.EN_US, locales.ES_MX];
  }

  let isORFReport = false;
  let isDYSReport = false;
  let isCOMPReport = false;
  if(action.msbType && action.msbType == msbType.ORF) {
    isORFReport = true;
  } else if(action.msbType && action.msbType == msbType.DYSLEXIA) {
    isDYSReport = true;
  } else if(action.msbType && action.msbType == msbType.COMPREHENSIVE) {
    isCOMPReport = true;
  }

  // TODO validate that cached selections are still valid options in the current context
  // (works as-is but is brittle without this check, esp as we extend TeacherSelections)
  let selections;
  let scales;
  let benchmarks;
  if(cachedSelections && !isORFReport && !isDYSReport && cachedSelections.metric.value != "DRI" && ((cachedSelections.metric.value != 'NWF' && cachedSelections.metric.value != 'Spelling') || isCOMPReport)) {
    let optionsAndSelections = resetAvailableScalesAndBenchmarks(cachedSelections.metric, district, students, cachedSelections.benchmark, isDYSReport, isCOMPReport);
    scales = optionsAndSelections.scales;
    benchmarks = optionsAndSelections.benchmarks;
    selections = cachedSelections;

    // update benchmark from cached value, based on the newly available options
    // TODO improve upon this to take into account caching in the multiple grade case
    selections.benchmark = optionsAndSelections.selections.benchmark;
  } else {
    let optionsAndSelections;
    if(isDYSReport) {
      optionsAndSelections = resetAvailableScalesAndBenchmarks(dyslexiaMetric, district, students, null, isDYSReport);
    } else {
      optionsAndSelections = resetAvailableScalesAndBenchmarks(metrics[0], district, students);
    }
    selections = optionsAndSelections.selections;
    scales = optionsAndSelections.scales;
    benchmarks = optionsAndSelections.benchmarks;
  }

  // Cache selections as most recent
  setMostRecentMSB(selections);
  next.selections = selections;
  next.equatingSelection = cachedEquatingSelection;
  next.metrics = metrics;
  next.selectedLocale = cachedLocale;
  next.selectedReadingRisks = cachedReadingRisksSelections;
  if(isORFReport) {
    next.metrics = [metrics[0]];
  } else if(isDYSReport) {
    next.metrics = [dyslexiaMetric];
  } else if(isCOMPReport) {
    next.metrics = metrics.concat(comprehensiveAssessmentMetrics);
  }
  next.scales = scales;
  next.benchmarks = benchmarks;
  next.grade = 0;
  next.applicableGrades = generateApplicableGrades(students);
  return next;
}

const actionReducer = {
  [types.TEACHER_SELECT]: teacherSelect,
  [types.TEACHER_DEFAULT_SELECTIONS]: teacherDefaultSelections,
  [types.TEACHER_CUSTOM_BENCHMARKS_COMPLETE]: teacherCustomBenchmarksComplete,
  [types.TEACHER_CUSTOM_BENCHMARKS_PENDING]: teacherCustomBenchmarksPending,
}

export default (state = {}, action = {type: null}) => {
  const reducer = actionReducer[action.type] || defaultReducer;
  return reducer(state, action);
}

// Given a metric, grade, and schools,
// return the available benchmarks and scales, as well as the default selections
function resetAvailableScalesAndBenchmarks(metric, district, students, cachedBenchmark, allCutlinesAreIdentical = false) {
  // Set scales and default scale, set benchmarks and default benchmark
  let applicableGrades = generateApplicableGrades(students);
  let benchmarks = generateBenchmarkOptions(metric, district, applicableGrades);
  let defaultBenchmark = getDefaultBenchmark(benchmarks, applicableGrades, cachedBenchmark);
  // NOTE: we're hardcoding dyslexia to one cutline/benchmark, until/unless we create different dyslexia cutlines per grade
  // TODO determine whether all benchmarks are identical here, if possible
  // (note that cutline sets may differ from one report to the next)
  if(allCutlinesAreIdentical) {
    defaultBenchmark.label = metric.benchmarks[0].label;
    benchmarks = [defaultBenchmark];
  }
  return {
    selections: {
      metric,
      scale: metric.scales[0],
      benchmark: defaultBenchmark,
    },
    scales: metric.scales,
    benchmarks,
  }
}


