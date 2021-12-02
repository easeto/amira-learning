import get from 'lodash.get'
import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import { app } from '../../../values/ui'


// this is horrible.
// think me

const getType = (selections) => {
  const types = RosterSelect.TYPES
  // pseudo - WRONG
  if (!selections) return types.school
  if (selections.student) return types.student
  if (selections.school) return types.classroom
  if (selections.classroom) return types.student
}

const RosterSelect = ({ active=true, selections, roster, search, recent, onChange }) => {
  const rosterChange = (selection) => {
    onChange && onChange({
      type: type,
      data: selection,
    })
  }

  if (!active) return (<div />)

  const type = getType(selections)
  return (
    <div className="roster">
      <div className="roster-column-left">
        <div className="roster-type">
          {RosterSelect.LABELS[type]}
        </div>
      </div>
      <div className="roster-column-right">
        <div className="roster-search">
        {/* Menu for recent searches https://react-select.com/components */}
          <Select
            menuPlacement="auto"
            isSearchable
            className="roster-select"
            classNamePrefix="roster-select"
            value={get(selections, type, '')}
            onChange={onRosterChange}
            options={roster[type].map((it) => ({value: it.id, label: it.label}))}
            placeHolder={app.selectRoster.schools}
          />
        </div>
      </div>
    </div>
  )
}

RosterSelect.LABELS = {
  school: 'Schools',
  classroom: 'Classrooms',
  student: 'Students',
}

RosterSelect.TYPES = {
  school: 'school',
  classroom: 'classroom',
  student: 'student',
}

RosterSelect.propTypes = {
  active: PropTypes.bool,
  type: PropTypes.oneOf(Object.keys(RosterSelect.TYPES)),
  // [TYPES.]: true/false
  visibility: PropTypes.object,
  onChange: PropTypes.func,
  search: PropTypes.string,
  // describe
  recent: PropTypes.object,
  // describe
  selections: PropTypes.object,
  // describe
  roster: PropTypes.object,
}

export default RosterSelect