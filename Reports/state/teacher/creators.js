import get from 'lodash.get';
import actions from './actions';
import types from './constants';
import { getCustomBenchmark } from '../../../../services/customBenchmarkService';

const teacherSelect = (selection, district, students) => (dispatch) => {
  dispatch(actions[types.TEACHER_SELECT](selection, district, students));
};

const teacherDefaultSelections = (district, students, msbType) => (dispatch) => {
  dispatch(actions[types.TEACHER_DEFAULT_SELECTIONS](district, students, msbType));
}

const loadCustomBenchmarks = (district) => (dispatch) => {
  dispatch(actions[types.TEACHER_CUSTOM_BENCHMARKS_PENDING]());
  getCustomBenchmark(district.value).then(benchmarkData => {
    dispatch(actions[types.TEACHER_CUSTOM_BENCHMARKS_COMPLETE](benchmarkData));
  });
}

export default {
  teacherSelect,
  teacherDefaultSelections,
  loadCustomBenchmarks
};
