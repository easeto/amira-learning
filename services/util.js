import { getActivityStatus } from './displayStatus';

export function formatAREAScore(score, long=false, veryshort=false){ // TODO pass these props more cleanly
  let years = Math.floor(score);
  let months = Math.round((score - years) * 12);
  if(long){
    return (years + " year, " + months + " month");
  }
  if(veryshort) {
    return(years + "y, " + months + "m");
  }
  return(years + " y, " + months + " m");
}

// TODO dedup this function
export function uuidToHEX(value){
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if(pattern.test(value)){
    value = value.replace(/\-/g, '').toUpperCase();
  }
  return value;
}

export function formatGuidForSIS(guid){
  let formattedGuid = guid.toLowerCase();

  //Check for valid UUID and fix if not
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if(pattern.test(formattedGuid) === false){
    formattedGuid = formattedGuid.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, "$1-$2-$3-$4-$5");
  }
  return formattedGuid;
}

export function makeStringPosessive(nameString){
  return nameString + (nameString[nameString.length -1] == 's' ? "'" : "'s");
}

//arrToSort - [Array]
//asc - [Boolean]
// order the activities by status. Completed first, then errors, then processing, then assigned
export function sortByStatus(arrToSort, asc){
  let result = arrToSort.sort((element1, element2) => {
    let status1 = element1.assessmentStatus ? element1.assessmentStatus.id : getActivityStatus(element1).id;
    let status2 = element2.assessmentStatus ? element2.assessmentStatus.id : getActivityStatus(element2).id;
    if (status1 == status2) {
      if(element1.updatedAt && element2.updatedAt){
        return element2.updatedAt - element1.updatedAt;
      }else if(element1.date && element2.date) {
        return new Date(element1.date).getTime() - new Date(element2.date).getTime();
      }
    } else if(status1 == "ERROR"){
      return -1;
    } else if(status1 == "ABORTED" && status2 != "ERROR"){
      return -1;
    } else if(status1 == "COMPLETE" && status2 != "ERROR" && status2 != "ABORTED"){
      return -1;
    } else if(status1 == "RESCORED" &&  status2 != "ERROR" && status2 != "ABORTED" && status2 != "COMPLETE"){
      return -1;
    } else if(status1 == "SCORING" &&  status2 != "ERROR" && status2 != "ABORTED" && status2 != "COMPLETE" && status2 != "RESCORED"){
      return -1;
    } else if(status1 == "IN_PROGRESS" &&  status2 != "ERROR" && status2 != "ABORTED" && status2 != "COMPLETE" && status2 != "RESCORED" && status2 != "SCORING"){
      return -1;
    } else if(status1 == "ASSIGNED" &&  status2 != "ERROR" && status2 != "ABORTED" && status2 != "COMPLETE" && status2 != "RESCORED" && status2 != "SCORING" && status2 != "IN_PROGRESS"){
      return -1;
    } else if(status1 == "UNASSESSED" &&  status2 != "ERROR" && status2 != "ABORTED" && status2 != "COMPLETE" && status2 != "RESCORED" && status2 != "SCORING" && status2 != "IN_PROGRESS" && status2 != "ASSIGNED"){
      return -1;
    } else {
      return 1;
    }
  });

  return asc ? result : result.reverse();
}

export function parseSkipTranslationTags(speechString){
  let cleanSpeechString = speechString.replace(/<\/*speak>/g, "");
  let splitSpeechString = cleanSpeechString.split(/<mark [a-zA-Z|\s|=|"|:]*skipTranslation[a-zA-Z|\s|=|"|:]*\/>/g);
  let parsedSpeechText = [];
  for(let i = 0; i < splitSpeechString.length; i++){
    let textToSpeak = splitSpeechString[i];
    if(textToSpeak && textToSpeak != ""){
      parsedSpeechText.push({
        textToSpeak: textToSpeak,
        skipTranslation: i%2 == 1,
      })
    }
  }
  return parsedSpeechText;
}

// takes an array of activity objects and returns that array sorted by date created, most recent first
export function sortActivitiesByDate(activities){
  let compare = function (activity1,activity2) {
    let date1 = new Date(activity1.updatedAt);
    let date2 = new Date(activity2.updatedAt);
    if (date1.getTime() < date2.getTime()){
      return 1;
    } else if (date1.getTime() > date2.getTime()){
      return -1;
    } else {
      return 0;
    }
  }
  return activities.sort(compare);
}

export function formatAsOrdinal(i) {
  var j = i % 10,
      k = i % 100;
  if (j == 1 && k != 11) {
      return i + "st";
  }
  if (j == 2 && k != 12) {
      return i + "nd";
  }
  if (j == 3 && k != 13) {
      return i + "rd";
  }
  return i + "th";
}

export function containsNonAlpha(str){
  return !/^[a-z]+$/i.test(str);
}

export function formatLocale_UpperCaseUnderscore(locale){
  return locale ? locale.replace('-', '_').toUpperCase() : locale;
}
