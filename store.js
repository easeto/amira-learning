import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from './middleware/logger';
import reports from './components/Reports/state';
import analyticsMiddleware from './middleware/googleAnalyticsReduxEventTracking';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store;
const reducers = combineReducers({
  reports,
});

if(process.env.NODE_ENV == 'production'){
  store = createStore(reducers, applyMiddleware(thunk));
}else {
  store = createStore(reducers, composeEnhancers(
    applyMiddleware(thunk, analyticsMiddleware)
  ));
}

export default store;
