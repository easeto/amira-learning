import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import { app } from '../../../values/ui'
import levels from '../../../values/levels'

// these should all derive from a common base that wraps some select of some kind
const LevelSelect = ({ selection, onChange }) => {
  const levelChange = (selection) => {
    onChange && onChange(selection)
  }

  const onSelect = (data) => {
    levelChange({
      type: LevelSelect.TYPES.LEVEL,
      data: data,
    })
  }

  return (
    <div className="reports-select select-level">
      <div className="level-select">
        <Select
          menuPlacement="auto"
          className="levels-select"
          classNamePrefix="levels-select"
          value={selection || ''}
          onChange={onSelect}
          options={Object.values(levels)}
          placeholder={app.selectPanel.levels}
        />
      </div>
    </div>
  )
}

LevelSelect.TYPES = {
  LEVEL: 'level',
}

LevelSelect.propTypes = {
  // describe
  selection: PropTypes.object,
  onChange: PropTypes.func,
}

export default LevelSelect