import actions from './actions';

const reportClear = () => (dispatch) => {
  dispatch(actions['REPORT_CLEAR']());
};

export default {
  reportClear,
}