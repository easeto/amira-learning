import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './containers/AppContainer';
import store from './store';
import * as Sentry from '@sentry/browser';
import ReactGA from 'react-ga';

require('./app.scss');
window.onerror = function(e){
  if(e.includes("ResizeObserver loop limit exceeded")){
   return true;
  }

  if(e.includes("unityAbort")){
    console.log("Reloading due to Unity Abort");
    Sentry.captureException(e);
    location.reload();
  }
}

// Show the git commmit hash
console.log(BRANCH,VERSION,COMMITHASH);

// Turn off google analytics on localhost
// TODO consider other situations where GA should be turned off (staging?)
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  ReactGA.initialize('foo', { testMode: true }); // TODO write google analytics unit tests
} else { // otherwise, initialize google analytics
  ReactGA.initialize('UA-141644970-1');
}
ReactGA.pageview('landing_page');

// Render app
ReactDOM.render(
  <AppContainer store={store} />
  , document.getElementById('root'));

// Initialize Sentry
 Sentry.init({
    dsn: "https://1536de4e059c4a0ab494149a234d9ac8@sentry.io/1427299",
    beforeSend: filterEvents,
    release: process.env.COMMITHASH
  },
  );

  //TODO: move to another file.

  let alreadyAllowedEvent = false;
  function filterEvents(event,hint){
    if(event && event.exception && event.exception.values){
      let exception = event.exception.values[0];
      if(exception.type == "TypeError" && exception.value == "Unable to get property 'x' of undefined or null reference"
        && exception.stacktrace && exception.stacktrace.frames && exception.stacktrace.frames[exception.stacktrace.frames.length-1]
        && (exception.stacktrace.frames[exception.stacktrace.frames.length-1].function == "handlerFunc")){
          if(alreadyAllowedEvent){
            console.log("Eating error",event);
            return null;
          }else{
            alreadyAllowedEvent = true;
          }
      }
    }
    return event;
  }
