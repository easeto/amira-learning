import merge from 'lodash.merge'
import orderBy from 'lodash.orderby'

/*
* TRANSFORMERS.js
*
* Transforms roster items so that they are ready for consumption within the UI.
*
* Currently, the transformations include sorting items, and reformatting how each
* object is structured, for consumption by our dropdown component.
*/

// TODO move to services
// TODO this is the source of all of our issues with id/value
// https://amiralearning.atlassian.net/browse/AE-1220
// aaargh should also match value/levels
const transformers = {
  district: (data) => {
    // watchme
    data = orderBy(data, ['label'], ['asc'])
    return data.map((it) => {
      return merge({}, it, {ui: {value: it.id, label: it.label}})
    })
  },
  school: (data) => {
    // watchme
    data = orderBy(data, ['label'], ['asc'])
    return data.map((it) => {
      // label as placeholder
      return merge({}, it, {ui: {value: it.id, label: it.label}})
    })
  },
  classroom: (data) => {
    // watchme
    data = orderBy(data, ['label'], ['asc'])
    return data.map((it) => {
      // label as placeholder
      return merge({}, it, {ui: {value: it.id, label: it.label}})
    })
  },
  student: (data) => {
    // watchme
    data = orderBy(data, ['last_name'], ['asc'])
    return data.map((it) => {
      return merge({}, it, {ui: {value: it.id, grade: it.grade, label: `${it.first_name} ${it.last_name}`}})
    })
  },
}

export default transformers;