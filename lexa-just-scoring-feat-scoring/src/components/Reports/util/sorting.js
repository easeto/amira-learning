import cloneDeep from 'lodash.clonedeep'
import uniqBy from 'lodash.uniqby'
import sortBy from 'sort-by'
import { sortByStatus } from '../../../services/util';

// MULTI-VALUE SORTING

// defaults: {
//   type: dir,
//   type: dir,
// }
class Sorting {
  constructor (defaults) {
    // bring in types: values map for nested key sorting
    this.defaults = defaults
  }

  // sort: type
  // sorts: [{type: dir:}]
  nextSorts (sort, sorts, flip) {
    const dirs = Sorting.DIRS
    const found = sorts.find((s) => sort === s.type)
    let next = {type: sort}

    if (found) {
      if(flip) {
        next.dir = found.dir === dirs.asc ? dirs.desc : dirs.asc;
      } else {
        next.dir = found.dir === dirs.asc ? dirs.asc : dirs.desc;
      }
    } else {
      next.dir = this.defaults[sort];
    }

    sorts.unshift(next)

    return uniqBy(sorts, 'type')
  }

  // naming
  ordersDirs (sorts) {
    let orders = []
    let dirs = []
    sorts.forEach((sort) => {
      orders.push(sort.type)
      dirs.push(sort.dir)
    })
    return [orders, dirs]
  }

  sort (data, orders, dirs) {
    const asc = dirs[0] == 'asc' ? true : false;
    if(orders[0] == 'status'){
      return sortByStatus(data, asc);
    }else {
      return asc ? data.sort(sortBy(orders[0])) : data.sort(sortBy('-' + orders[0]));
    }

// @Kathleen and @Ben asked for this added code to remain commented for further reference
//
//    let howToSort = dirs[0] == 'asc' ? sortBy(orders[0]) : sortBy('-' + orders[0]);
//    if(Object.keys(data[0]).includes('assessmentStatus') && orders[0] == 'score'){
//      let scored = [];
//      let assigned = [];
//      data.map((d) => {
//        if(d.assessmentStatus && d.assessmentStatus.label && d.assessmentStatus.label != 'COMPLETE'){
//          assigned.push(d);
//        }else {
//          scored.push(d);
//        }
//      });
//
//      const arrScored = scored.sort(dirs[0] == 'asc' ? sortBy(orders[0]) : sortBy('-' + orders[0]));
//      const arrAssigned = assigned.sort(dirs[0] == 'asc' ? sortBy(orders[0], 'assessmentStatus.label') : sortBy('-' + orders[0], 'assessmentStatus.label'));
//      return arrScored.concat(arrAssigned);
//    }else {
//      return data.sort(howToSort);
//    }
  }

  run (data, sort, sorts, flip=true) {
    const next = this.nextSorts(sort, sorts,flip)
    return {
      sorts: next,
      data: this.sort(data, ...this.ordersDirs(next))
    }
  }
}

Sorting.DIRS = {
  asc: 'asc',
  desc: 'desc',
}

export default Sorting
