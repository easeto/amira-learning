import {getUserData} from './API';
import {Storage} from 'aws-amplify';
import {uuidToHEX} from './util';

export function logSessionInfo(inType,inData,forceKey=null){
  let sessionInfo = getUserData();
  if(!sessionInfo && !forceKey) return;

  let activity = forceKey ? forceKey : sessionInfo.activityId;
  if(!activity){
    if(sessionInfo.userId){
      activity = uuidToHEX(getUserData().userId);
    }
  }

  if(activity){
    const options = {
      bucket: process.env.LOGGINGBUCKET + "/" + activity,
      contentType: 'application/json',
      level: "public",
      customPrefix: {
        public: "",
      },
    };

    return Storage.put(inType+"_"+Date.now()+".json",JSON.stringify(inData),options)
    .then(()=>{
      return Promise.resolve(true);
    })
    .catch(err => {
      console.log("LOGGING PUT FAIL:",err);
      return Promise.resolve(false);
    });
  }
}

export function logSystemData(){
  logSessionInfo("browser",{browser: getUserData().browser,platform: navigator.platform,touchPoints: navigator.maxTouchPoints});
  logSessionInfo("network",getUserData().connection);
  logSessionInfo("session",getUserData());
}