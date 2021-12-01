// External dependencies
import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';
import get from 'lodash.get';
import set from 'lodash.set';

// Internal Dependencies
import types from './constants';
import transformers from './transformers';
import { states } from '../../values/enums';
import { setMostRecentRoster } from '../../../../services/teacher/recentTeacherSelections';

const defaultReducer = (state, action) => (state)

const rosterType = (state, action) => {
  let next = cloneDeep(state)
  set(next, 'ui.type', action.data)
  return next
}

const rosterActive = (state, action) => {
  let next = cloneDeep(state)
  const active = get(next, 'ui.active', true)
  const type = get(next, 'ui.type')
  active && type === action.active && set(next, `ui.active`, !active)
  !active && set(next, `ui.active`, true)
  set(next, `ui.type`, action.active)
  return next
}

// in list search atm - maybe remote search + cache
const rosterSearch = (state, action) => {
  let next = cloneDeep(state)
  const type = action.search.type
  let search = action.search.data || ''
  const roster = get(next, `data.${type}`)
  const results = !search ? roster : roster.filter((it) => {
    return it.ui.label.toLowerCase().indexOf(search.toLowerCase()) > -1
  })
  set(next, `ui.search.${type}`, search)
  set(next, `ui.results.${type}`, results)
  return next
}

const rosterSelect = (state, action) => {
  let next = cloneDeep(state)

  // Cache selections
  setMostRecentRoster(action.selections);

  set(next, `ui.selections`, action.selections)
  set(next, `data`, action.data)
  set(next, 'status', {type: states.COMPLETE})
  return next
}

const rosterPending = (state, action) => {
  let next = cloneDeep(state)
  set(next, 'status', {type: states.PENDING})
  return next
}

const rosterComplete = (state, action) => {
  let next = cloneDeep(state)
  const type = action.roster.type
  set(next, 'status', {type: states.COMPLETE})
  set(next, `data.${type}`, transformers[type](action.roster.data))
  return next
}

const rosterError = (state, action) => {
  let next = cloneDeep(state)
  set(next, 'status', {type: states.ERROR, data: action.error})
  return next
}

const actionReducer = {
  [types.ROSTER_TYPE]: rosterType,
  [types.ROSTER_ACTIVE]: rosterActive,
  [types.ROSTER_SEARCH]: rosterSearch,
  [types.ROSTER_SELECT]: rosterSelect,
  [types.ROSTER_PENDING]: rosterPending,
  [types.ROSTER_COMPLETE]: rosterComplete,
  [types.ROSTER_ERROR]: rosterError,
}

export default (state = {}, action = {type: null}) => {
  const reducer = actionReducer[action.type] || defaultReducer
  return reducer(state, action)
}

// STATE: {reports: {roster: {
//     ui: {
//       active: true,
//       type: '',
//       search: '',
//       types: [{
//         value: '',
//         label: '',
//       }],
//       recent: {
//         district: [{
//           value: '',
//           label: '',
//         }],
//         school: [{
//           value: '',
//           label: '',
//         }],
//         // etc
//       }
//       selections: {
//         district: [{
//           value: '',
//           label: '',
//         }],
//         school: [{
//           value: '',
//           label: '',
//         }],
//         // etc
//       }
//       results: {
//         district: [{
//           value: '',
//           label: '',
//         }],
//         school: [{
//           value: '',
//           label: '',
//         }],
//         // etc
//       }
//     },
//     status: {type: states.PENDING},
//     meta: {},
//     data: {
//       districts: [],
//       schools: [],
//       classrooms: [],
//       students: [],
//     }
//   },
// }}