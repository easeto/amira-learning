import types from './constants'

export default {
  [types.TEACHER_SELECT]: (selection, district, students) => ({
   type: types.TEACHER_SELECT,
   selection,
   district,
   students,
  }),
  [types.TEACHER_DEFAULT_SELECTIONS]: (district, students, msbType) => ({
   type: types.TEACHER_DEFAULT_SELECTIONS,
   district,
   students,
   msbType,
  }),
  [types.TEACHER_CUSTOM_BENCHMARKS_COMPLETE]: (benchmarkData) => ({
   type: types.TEACHER_CUSTOM_BENCHMARKS_COMPLETE,
   benchmarkData,
  }),
  [types.TEACHER_CUSTOM_BENCHMARKS_PENDING]: () => ({
   type: types.TEACHER_CUSTOM_BENCHMARKS_PENDING,
  }),
}