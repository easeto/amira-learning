// External dependencies
import get from 'lodash.get'

// Internal dependencies
import actions from './actions'
import types from './constants'
import services from '../../services/roster'
import { selectionRules, initializationRules } from './rules'

const rosterType = (data) => (dispatch) => {
  dispatch(actions[types.ROSTER_TYPE](data))
}

const rosterActive = (data) => (dispatch) => {
  dispatch(actions[types.ROSTER_ACTIVE](data))
}

const rosterSelect = (selection) => (dispatch, getState) => {
  dispatch(actions[types.ROSTER_PENDING]())
  selectionRules(selection, services.fetchRoster, get(getState(), 'reports.roster'))
  .then((data) => {
    dispatch(actions[types.ROSTER_SELECT](data))
  })
  .catch((e) => {
    dispatch(actions[types.ROSTER_ERROR](e))
  })
}

const rosterSearch = (data) => (dispatch) => {
  dispatch(actions[types.ROSTER_SEARCH](data))
}

// Fetches the roster for a level and it's child level
const fetchRoster = (type, id, paging) => (dispatch) => {
  dispatch(actions[types.ROSTER_PENDING]())
  return services.fetchRoster(type, id, paging)
  .then((data) => {
    dispatch(actions[types.ROSTER_COMPLETE]({type, data}))
    return data;
  })
  .catch((e) => {
    dispatch(actions[types.ROSTER_ERROR](e))
    return Promise.reject(e)
  });
}

// Initializes the roster at all levels
const initializeRoster = () => (dispatch) => {
  dispatch(actions[types.ROSTER_PENDING]())
  initializationRules(services.fetchRoster)
  .then((data) => {
    dispatch(actions[types.ROSTER_SELECT](data))
  })
  .catch((e) => {
    dispatch(actions[types.ROSTER_ERROR](e))
  })
}

export default {
  rosterType,
  rosterActive,
  rosterSelect,
  rosterSearch,
  fetchRoster,
  initializeRoster,
}
