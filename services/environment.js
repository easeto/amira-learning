import * as Sentry from '@sentry/browser';
import {getUserData} from './API';
import { func } from 'prop-types';

export function isMicAllowed(){
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !navigator.mediaDevices.enumerateDevices){
    return Promise.resolve(false);
  }

  if(!getUserData().sessionData.isiPad){
    return navigator.mediaDevices.getUserMedia({audio: true})
    .then((stream)=>{
      return Promise.resolve(stream ? true : false);
    })
    .catch((err)=>{
      console.log("MIC NOT ALLOWED",err);
      Sentry.captureException(err);
      return Promise.resolve(false);
    });
  }else{
    return navigator.mediaDevices.enumerateDevices().then((devices) => {
      for(let i = 0; i < devices.length; i++){
        let device = devices[i];
        if(device.kind == "audioinput" && device.label){
          return Promise.resolve(true);
        }
      }
      return Promise.resolve(false);
    }).catch((err) =>{
      Sentry.captureException(err);
      return Promise.resolve(false);
    });
  }
}

export function isiPad(){
  return  ((navigator.userAgent.match(/iPad/i) != null /* iOS pre 13 */ ||
          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) /* iPad OS 13 */));
}

export function supportsSpeechRec(browser){
  console.log(browser)
  let name = browser.name.toLowerCase();
  let version = browser.version;

  return( ((name === 'chrome') && !isiPad()) ||
          ((name === 'safari') && !isiPad() && (version >= "14.1"))
  );
}