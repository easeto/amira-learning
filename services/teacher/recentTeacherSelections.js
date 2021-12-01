import { selectionTypes } from '../../components/Reports/values/enums';
import { getUserData } from '../../services/API';

// Define "combo" types for METRIC / SCALE / BENCHMARK and SCHOOL / CLASS / STUDENT
const MSB_TYPE = selectionTypes.METRIC + selectionTypes.SCALE + selectionTypes.BENCHMARK;
const ROSTER_TYPE = selectionTypes.SCHOOL + selectionTypes.CLASS + selectionTypes.STUDENT;

const EQUATING_TYPE = 'EQUATING';
const SHOW_ASSESSMENTS = 'SHOW_ASSESSMENTS';
const LOCALE = 'LOCALE';
const READING_RISK_TYPES = 'READING_RISK_TYPES';

// Store a recent selection
function storeRecentSelection(selections, selectionKey) {
  let userKey = selectionKey + getUserData().userId; // append userId
  sessionStorage.setItem(userKey, JSON.stringify({ // selectionType as key
    timestamp: new Date(),
    content: selections,
  }));
}

// Fetch a recent selection
function fetchRecentSelection(selectionKey) {
  let userKey = selectionKey + getUserData().userId; // append userId
  let rawSelection = sessionStorage.getItem(userKey);
  let selection = null;
  if(rawSelection && !hasTimedOut(rawSelection, userKey)){
    selection = JSON.parse(rawSelection).content;
  }
  return(selection); // TODO consider doing some validation on selection
}

// Returns true if the content is more than two months old
// TODO talk through an appropriate timeout with the team
export function hasTimedOut(rawMetadata, key) {
  let data = JSON.parse(rawMetadata);

  // Calculate expiration time for content, to force periodic refresh after 2 months
  let now = new Date();
  let expiration = new Date(data.timestamp);
  expiration.setMonth(expiration.getMonth() + 2);

  // Ditch the content if too old
  if (now.getTime() > expiration.getTime()) {
      sessionStorage.removeItem(key);
      return true;
  }
  return false;
}

// Metric / Scale / Benchmark
export function getMostRecentMSB() {
  return fetchRecentSelection(MSB_TYPE);
}
export function setMostRecentMSB(msbSelections) {
  storeRecentSelection(msbSelections, MSB_TYPE);
}

// Equating
export function getMostRecentEquating() {
  return fetchRecentSelection(EQUATING_TYPE);
}
export function setMostRecentEquating(equatingSelection) {
  storeRecentSelection(equatingSelection, EQUATING_TYPE);
}

// Roster
export function getMostRecentRoster() {
  return fetchRecentSelection(ROSTER_TYPE);
}
export function setMostRecentRoster(rosterSelections) {
  storeRecentSelection(rosterSelections, ROSTER_TYPE);

  // If applicable, set cache for school/class and class/student pairs
  if (rosterSelections.school && rosterSelections.classroom) {
    setMostRecentParentChildPair(rosterSelections.school.value, rosterSelections.classroom, 'classroom');
    if(rosterSelections.classroom && rosterSelections.student) {
      setMostRecentParentChildPair(rosterSelections.classroom.value, rosterSelections.student, 'student');
    }
  }
}

// Parent Child Pairings (e.g. district/school, school/class, and class/student)
export function getMostRecentParentChildPair(parentId, type) {
  // generate key from child type + parentId
  const key = 'mostRecentPairingFor' + type + parentId;
  return fetchRecentSelection(key);
}
export function setMostRecentParentChildPair(parentId, child, type) {
  // generate key from child type + parentId
  const key = 'mostRecentPairingFor' + type + parentId;
  storeRecentSelection(child, key);
}

// Show assessments
export function getMostRecentShowAssessments() {
  return fetchRecentSelection(SHOW_ASSESSMENTS);
}
export function setMostRecentShowAssessments(showAssessments) {
  storeRecentSelection(showAssessments, SHOW_ASSESSMENTS);
}

// Locale
export function getMostRecentLocale() {
  return fetchRecentSelection(LOCALE);
}

export function setMostRecentLocale(locale) {
  storeRecentSelection(locale, LOCALE);
}

// Reading risk types
export function getMostRecentReadingRisks() {
  return fetchRecentSelection(READING_RISK_TYPES);
}

export function setMostRecentReadingRisks(riskTypes) {
  storeRecentSelection(riskTypes, READING_RISK_TYPES);
}