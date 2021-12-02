import { metrics, comprehensiveAssessmentMetrics } from '../values/metrics';
import moment from 'moment';
import {getUserData, isSpanishActivity} from '../../../services/API.js';
import {locales} from "Constants/constants";

// if metric, scale, and benchmark are defined,
// if the metric is associated with the provided scale and benchmark,
// then return true, else false
// TODO figure out why this doesn't return false on district custom benchmark
// https://amiralearning.atlassian.net/browse/AE-1324
export function validateSelections(metricId, scaleId, benchmarkId) {
  let valid;

  // TODO re-enable for NWF and spelling
  /* let compMets = metrics.concat(comprehensiveAssessmentMetrics); */

  if(metricId && scaleId && benchmarkId) {
    valid = metrics.filter((metric) => metric.value === metricId).map((metric) => { // for every valid metric
      return metric.scales.filter((scale) => scale.value === scaleId).map((scale) => { // if the metric is associated with the current scale
        if(benchmarkId.value !== "none") {
          if(metric.benchmarks.length > 0) {
            return true; //valid metric/scale/benchmark set found
          }
        } else if(metric.benchmarks.length === 0) {
          return true; //valid metric/scale/benchmark set found
        }
      });
    });
  };
  // if the search found a valid metric, scale, and benchmark set, return true
  if(valid && valid.length > 0 && valid[0].length > 0) {
    return true;
  } else {
    return false;
  }
}

// Returns activities that are valid (if they have all five score fields defined).
// Throws an error if no activities are valid
export function filterInvalidActivities(activities) {
  activities.map((activity)=>{
    if(activity.scores && activity.scores.wcpmScore && activity.scores.wcpmScore > 250){
      activity.scores.wcpmScore = 250;
    }
  })

  let filteredActivities = activities.filter(activity => ((activity.studentStatus && activity.studentStatus == 'unassessed') || (activity.scores && activity.scores.wcpmScore && activity.scores.wcpmScore <= 250 &&
    activity.scores.esriScore && activity.scores.phonAwareScore && activity.scores.vocabSize && activity.scores.areaScore &&
    activity.createdAt))
  );

  filteredActivities = filterByDate(filteredActivities);
  if(filteredActivities.length == 0 && activities.length > 0) {
    console.log('warning: no valid activities: ' + JSON.stringify(activities));
  }
  return filteredActivities;
}

export function filterByDate(activities){
  let filteredActivities = activities.filter(activity => ((moment(activity.createdAt).valueOf() >= moment(getSchoolYear().startDate)))
  );

  return filteredActivities
}

export function getSchoolYear(){
  let schoolYearStartSetting = getUserData().schoolYearStartDate;
  let schoolYearStart = Date.now();
  let schoolYearEnd = Date.now();

  if(schoolYearStartSetting && moment(schoolYearStartSetting) < moment()){
    //The school year setting is past us, so just use it and set the end date to end of day 7/31 during the next year
    schoolYearStart = new Date(schoolYearStartSetting);
    schoolYearEnd = new Date((moment(schoolYearStart).year()+1)+"-08-01");
  }else{
    let startYear = moment().year();
    if(!schoolYearStartSetting){
      //There is no setting - set start date to the last occurrence of 08-01 and the end date to the next occcurrence of 7/31
      if(moment().month() < 7) {
        startYear = startYear - 1;
      }
      schoolYearEnd = new Date((startYear+1)+"-08-01");
      schoolYearStart = new Date(startYear + "-08-01");
    }else{
      //Setting exists and is in the future. - set start date to the last occurrence of 08-01 and the end date to 1 second before the set start date
      startYear = moment(schoolYearStartSetting).year()-1;
      schoolYearEnd = new Date(schoolYearStartSetting);
    }
    schoolYearStart = new Date(startYear + "-08-01");
  }

  schoolYearEnd.setTime(schoolYearEnd.getTime()-1000);
  return {startDate: schoolYearStart, endDate: schoolYearEnd};
}

export function filterByLocale(activities, locale){
  return activities.filter(activity => {
    return (locale === locales.ES_MX && isSpanishActivity(activity))
      || (locale !== locales.ES_MX && !isSpanishActivity(activity));
  });
}

export default {
  validateSelections,
  filterInvalidActivities,
}