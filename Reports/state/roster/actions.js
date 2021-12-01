import constants from './constants'

export default {
  [constants.ROSTER_TYPE]: (data) => ({
    type: constants.ROSTER_TYPE,
    data
  }),
  [constants.ROSTER_ACTIVE]: (active) => ({
    type: constants.ROSTER_ACTIVE,
    active
  }),
  [constants.ROSTER_SELECT]: ({data, selections, selection, types, rosterType, recent}) => ({
    type: constants.ROSTER_SELECT,
    data,
    selections,
    selection,
    types,
    rosterType,
    recent,
  }),
  [constants.ROSTER_SEARCH]: (search) => ({
    type: constants.ROSTER_SEARCH,
    search
  }),
  [constants.ROSTER_PENDING]: () => ({
    type: constants.ROSTER_PENDING,
  }),
  [constants.ROSTER_COMPLETE]: (roster) => ({
    type: constants.ROSTER_COMPLETE,
    roster
  }),
  [constants.ROSTER_ERROR]: (error) => ({
    type: constants.ROSTER_ERROR,
    error
  }),
}