import { combineReducers } from 'redux';

import roster from './roster/reducers';
import teacher from './teacher/reducers';

const reports = combineReducers({
  roster,
  teacher,
})

export default reports