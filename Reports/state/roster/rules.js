// External Dependencies
import cloneDeep from 'lodash.clonedeep'
import get from 'lodash.get'
import set from 'lodash.set'
import merge from 'lodash.merge'
import uniqBy from 'lodash.uniqby'

// Internal Dependencies
// maybe curry levels/list onAbstraction
import levels from '../../values/roster';
import transformers from './transformers';
import { getMostRecentRoster, getMostRecentParentChildPair } from '../../../../services/teacher/recentTeacherSelections';

// hierarchical list (top, down)
const list = levels.map((l) => (l.value))
const l = list.length
const getChild = (level) => (level === l - 1 ? null : list[level + 1])

const recentLimit = 5;

// Appropriately update the roster when a selection is made
export const selectionRules = (selection, fetcher, roster) => {
  const data = roster.data || {};
  const ui = cloneDeep(roster.ui || {});

  // If applicable, get this type's child (e.g. school-> class, or class -> student)
  let type = selection.type;
  let level = list.findIndex((it) => (it === type));
  let child = getChild(level);
  let out = {
    selection: selection,
    selections: merge({}, ui.selections, {[selection.type]: selection.data}),
    data: data,
  }

  return child ? populateRoster(child, fetcher, selection.data.value, out, true) : Promise.resolve(out); // TODO clean up value versus id

  // TODO renenable this code if we decide to display or sort by recent selections
  // let recent = get(ui, `recent.${type}`, []);
  // recent.push(selection.data);
  // recent = uniqBy(recent, 'ui.value').slice(0, recentLimit);
  // set(ui, `recent.${type}`, recent);
}

// Apply a set of rules in order to populate initial roster data and selections
export const initializationRules = fetcher => {
  // Initialize the roster, starting on the "district" level
  let topLevel = levels[0].value;
  let out = {
    selections: {},
    data: {},
  };

  return populateRoster(topLevel, fetcher, null, out, true);
}

/*
* Recursively populate each level of the roster
*
* PARAMETERS
// level: school, class, or student. Eventually, we may add district, or other leveled hierarchies
// fetcher: a function which returns a roster for each level
// id: the id of the selection from the parent level
// out: the output (selections and data for each level)
// cacheIsValid: bool, which is set to false for all child levels if the cache is invalidated
*/
function populateRoster(level, fetcher, id, out, cacheIsValid) {
  return fetcher(level, id)
  .then((results) => {
    // First, set the results for this level
    results = transformers[level](results); // Sort and format results
    out.data[level] = results;

    // If district level, return next level down, no id necessary
    if(level == 'district') { // TODO use enum
      return populateRoster(levels[1].value, fetcher, null, out, cacheIsValid);
    }

    // Next, determine whether we should default a selection
    let selection;
    let cache = cacheIsValid && getMostRecentRoster();
    // If a cached selection exists, check if there's a valid cached selection for this level
    if(cache && cache[level] && results.filter(r => {
        // TODO straighten out id versus label so that this isn't necessary
        let idIsValid = false;
        if(cache[level].id) {
          idIsValid = true;
          if(cache[level].ui && cache[level].ui.label && cache[level].ui.label != cache[level].label) {
            idIsValid = false;
          }
        }
        return r.id == cache[level].value || (idIsValid && r.id == cache[level].id);
      }).length > 0) {
      selection = cache[level];
    } else {
      // If we haven't found a valid "primary" cached value for the selection,
      // and this id is associated with a valid child pairing
      cacheIsValid = false;
      let secondaryCache = getMostRecentParentChildPair(id, level);
      if(secondaryCache && results.filter(r => {
        // TODO straighten out id versus label so that this isn't necessary
        let idIsValid = false;
        if(secondaryCache.id) {
          idIsValid = true;
          if(secondaryCache.ui && secondaryCache.ui.label && secondaryCache.ui.label != secondaryCache.label) {
            idIsValid = false;
          }
        }
        return r.id == secondaryCache.value || (idIsValid && r.id == secondaryCache.id);
      }).length > 0) {
        selection = secondaryCache;
      } else if(level != 'student') { // TODO use enum
        selection = results[0];
      }
    }

    // Set the selection
    out.selections[level] = selection;

    // TODO handle the error case where a teacher doesn't have access to any classes
    // If not the base case (student level),
    if(level != 'student') { // TODO use enum
      // Get the next level down
      id = selection.value ? selection.value : selection.id; // TODO make this unnecessary (issue with id/value not being the same for classes)
      level = getChild(list.findIndex((it) => (it === level)));
      return populateRoster(level, fetcher, id, out, cacheIsValid);
    } else {
      return out;
    }
  })
  .catch((e) => Promise.reject(e))
}

export default { selectionRules, initializationRules }