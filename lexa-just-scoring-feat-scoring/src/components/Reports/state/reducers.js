import cloneDeep from 'lodash.clonedeep';
import set from 'lodash.set';
import types from './constants';

const reportClear = (state) => {
  let next = cloneDeep(state);
  set(next, 'report', null);
  return next;
}

export default {
  [types.REPORT_CLEAR]: reportClear,
}