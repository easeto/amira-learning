import ReactGA from 'react-ga';

// This middleware adapted from
// https://medium.com/@benshope/how-to-add-google-analytics-to-redux-ef5b6d8aa70e

// TODO filter out boring actions
// TODO customize the the event_labels of particularly interesting actions
const analyticsMiddleware = store => next => action => {
  if(action.type == 'TEACHER_SELECT') {
    if(action.selection && action.selection.data && action.selection.type) {
      ReactGA.event({
        category: 'M/S/B Selection',
        action: action.selection.type,
        label: action.selection.data.label,
      });
    }
  } else if (action.type == 'ROSTER_SELECT') {
    if(action.selection) {
      ReactGA.event({
        category: 'Roster Selection',
        action: action.selection.type,
      });
    }
  }

  return next(action);
};
export default analyticsMiddleware;