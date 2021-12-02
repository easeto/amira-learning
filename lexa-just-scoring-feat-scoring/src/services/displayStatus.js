import { activityStatus } from "../constants/constants";


// TODO merge w activity status in constants
export const statusType = {
  //ABANDONED: 'abandoned', //TODO implement this on the backend
  //REVIEWED: 'reviewed', //TODO implement this on the backend
  RESCORED: 'rescored',
  SCORED: 'scored',
  ASSIGNED: 'assigned',
  ASSIGNED_WITH_SPACES: ' assigned ',
  NOT_STARTED: 'not_started', //TODO do backend work to make this work for assigned assessments too, right now it only works for self assigned assessments
  IN_PROGRESS: 'in_progress',
  SCORING: 'scoring',
  LAUNCHED: 'launched', //Activity started
  STARTED: 'started', //Student started the activity and at least got to the point where they see the first page
  ABORTED: 'aborted', //Student hit the abort button
  ABANDONED: 'abandoned', //Student closed the browser mid-activity. TODO: Implement this when the browser closes.
  DOWNLEVELED: "downleveled", // We decided to downlevel the student
  PREREADER: "prereader", //We downleveled the student out of K
  COMPLETED: "completed", //Student finished the test and is waiting to be scored
  UNASSIGNED: 'unassigned', //An "assignment" activity has been unassigned, typically done when the assignment has been started
  RESCORING: 'rescoring', //Submitted for rescoring by scoring screen
  MUTED: 'muted', //Aborted because of muted audio
  STUCK_PLACEMENT: 'stuck_placement',
  UNDER_REVIEW: 'underReview', //Activity flagged for review
};

export function getActivityStatus(activity){

  // If there is no activity, then the activity has no status
  if(!activity) {
    return null;
  }

  let status = activity.status;
  let displayStatus = activity.displayStatus;
  let updatedAt = activity.updatedAt || activity.createdAt;

  if(activity.assessmentStatus){//This is used on Tracking Report
    status = activity.assessmentStatus.id;
  }

  // if we don't have an activity,
  //  or the activity is not currently being scored but also has no scores,
  //  mark as an error
  if((displayStatus !== statusType.PREREADER) && (!activity
        || !status
        || (status == statusType.SCORED && (activity.type === "assessment") && !(activity.scores && activity.scores.wcpmScore > 0))
  )){
    return {
      label: "REASSESS",
      id: "ERROR",
      needsAttention: true,
    };
  }

  //UNDER REVIEW: The activity or any if it's children are flagged for review
  if(displayStatus === statusType.UNDER_REVIEW || status === statusType.UNDER_REVIEW
    || (activity.children && activity.children.some(x => x.status === statusType.UNDER_REVIEW))){
    return {
      id: "UNDER_REVIEW",
      label: "UNDER REVIEW...",
      started: true,
    };
  }

  // Partially completed assignments are either multipart assignments in which some, but not all of the parts have been completed,
  //   or assignments with a status of "started" (which is set when an activity starts, and remains until the activity
  //   is terminated by downleveling, abort, timeout, or even sometimes finishing normally.)
  // If enabled, reading comprehension is the last activity in the progression but is a child of the ORF activity.
  //   As a result, assessments can still be scored/completed when the reading comp activity is abandoned.
  //   To show the appropriate status in the case, we check if scored/completed have any children in the assigned state.
  // We will mark assignments in this partially completed state as "IN PROGRESS" for the first 10 minutes (hopefully approximately *while* the student is taking the test)
  //   but if more than 10 minutes pass with an assignment in this state, and no update, we will mark the assignment as "INCOMPLETE"
  //   as a call to action for the teacher to have the student log back in and finish the assignment
  if((status == statusType.ASSIGNED && (displayStatus == statusType.STARTED || (activity.children && (activity.children.length > 0))))
    || (displayStatus == statusType.COMPLETED && activity.children && activity.children.some(c => c.status === activityStatus.ASSIGNED))){
    if(updatedAt && (new Date() - new Date(updatedAt)) > 600000){
      return {
        id: "INCOMPLETE",
        label: "INCOMPLETE",
        needsAttention: true,
        started: true,
      };
    }else{
      return {
        id: "IN_PROGRESS",
        label: "IN PROGRESS",
        started: true,
      };
    }
  }

  //PREREADER: Downleveled out of K and scored
  if(displayStatus == statusType.PREREADER){
    return {
      id: "PRE-READER",
      label: "EARLY READER",
      ready: true,
      needsAttention: true,
    };
  }

  // ABORTED: User hit end assessment and the test is not scored
  if(displayStatus == statusType.ABORTED && status !== statusType.SCORED){
    return {
      id: "REASSESS (aborted)",
      label: "ABORTED",
      ready: true,
      needsAttention: true,
    };
  }

  if(displayStatus == statusType.RESCORED){
    return {
      id: "COMPLETE (rescored)",
      label: "RESCORED",
      ready: true,
    };
  }

  //SCORING: The activity was marked as completed and it's not yet scored (for whatever reason)
  if((displayStatus == statusType.COMPLETED) && ((status !== statusType.SCORED) && (status !== statusType.RESCORED))){
    return {
      id: "SCORING",
      label: "SCORING...",
      started: true,
    };
  }

  switch(status.toLowerCase()) {
    case statusType.SCORED:
      return {
        id: "COMPLETE",
        label: "COMPLETE",
        ready: true,
      };
    case statusType.ASSIGNED:
    case statusType.ASSIGNED_WITH_SPACES:
      return {
        id: "ASSIGNED",
        label: "ASSIGNED",
      };

    default:
      return {
        id: "ERROR",
        label: "REASSESS",
        needsAttention: true,
      };
  }
}
