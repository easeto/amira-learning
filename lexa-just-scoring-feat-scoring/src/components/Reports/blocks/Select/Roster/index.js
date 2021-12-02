import get from 'lodash.get'
import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import { app } from '../../../values/ui'

const RosterSelect = ({ selections, roster, search, recent, visibility={}, onChange }) => {
  const rosterChange = (selection) => {
    onChange && onChange(selection)
  }

  const onSchoolChange = (data) => {
    rosterChange({
      type: RosterSelect.TYPES.SCHOOL,
      data: data,
    })
  }

  const onClassroomChange = (data) => {
    rosterChange({
      type: RosterSelect.TYPES.CLASSROOM,
      data: data,
    })
  }

  const onStudentChange = (data) => {
    rosterChange({
      type: RosterSelect.TYPES.STUDENT,
      data: data,
    })
  }

  const schools = get(roster, 'schools', [])
  const classrooms = get(roster, 'classrooms', [])
  const students = get(roster, 'students', [])

  // ripe for refactor/reduction through objecvt descr + iteration
  // FILTER ME ACCORDING TO HIERARCHICAL SELECTION

  return (
    <div className="select-roster reporting-select">
      {visibility.school &&
        <div className="roster-select">
          <Select
            menuPlacement="auto"
            className="schools-select"
            classNamePrefix="schools-select"
            value={get(selections, `${RosterSelect.TYPES.SCHOOL}`, '')}
            onChange={onSchoolChange}
            options={schools.map((it) => ({value: it.id, label: it.label}))}
            placeHolder={app.selectRoster.schools}
          />
        </div>
      }
      {visibility.classroom &&
        <div className="roster-select">
          <Select
            menuPlacement="auto"
            className="classrooms-select"
            classNamePrefix="classrooms-select"
            value={get(selections, `${RosterSelect.TYPES.CLASSROOM}`, '')}
            onChange={onClassroomChange}
            options={classrooms.map((it) => ({value: it.id, label: it.label}))}
            placeHolder={app.selectRoster.schools}
          />
        </div>
      }
      {visibility.student &&
        <div className="roster-select">
          <Select
            menuPlacement="auto"
            className="students-select"
            classNamePrefix="students-select"
            value={get(selections, `${RosterSelect.TYPES.STUDENT}`, '')}
            onChange={onStudentChange}
            options={students.map((it) => ({value: it.id, label: it.first_name}))}
            placeHolder={app.selectRoster.students}
          />
        </div>
      }
    </div>
  )
}

RosterSelect.TYPES = {
  SCHOOL: 'school',
  CLASSROOM: 'classroom',
  STUDENT: 'student',
}

RosterSelect.propTypes = {
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