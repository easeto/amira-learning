import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

const SortSelect = ({ selection, sorts, onChange }) => {
  const sortChange = (selection) => {
    onChange && onChange(selection)
  }

  const onSelect = (data) => {
    sortChange({
      type: SortSelect.TYPES.SORT,
      data: data,
    })
  }

  return (
    <div className=" reports-select select-sort">
      <div className="sort-select">
        <Select
          menuPlacement="auto"
          className="sorts-select"
          classNamePrefix="sorts-select"
          value={selection || ''}
          onChange={onSelect}
          options={sorts}
          placeholder={''}
        />
      </div>
    </div>
  )
}

SortSelect.TYPES = {
  SORT: 'sort',
}

SortSelect.propTypes = {
  // describe
  sorts: PropTypes.object,
  // describe
  selection: PropTypes.object,
  onChange: PropTypes.func,
}

export default SortSelect