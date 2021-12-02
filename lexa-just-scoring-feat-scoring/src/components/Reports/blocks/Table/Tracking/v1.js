import React from 'react'
import PropTypes from 'prop-types'
import 'react-virtualized/styles.css'

import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import Column from 'react-virtualized/dist/commonjs/Table/Column'
import ColumnSizer from 'react-virtualized/dist/commonjs/ColumnSizer'
import Table from 'react-virtualized/dist/commonjs/Table'

const Tracking = ({ data }) => (
  <Table
    width={800}
    height={600}
    headerHeight={40}
    rowHeight={40}
    rowCount={data.length}
    rowGetter={({ index }) => data[index]}
  >
    <Column
      width={800}
      dataKey='first_name'
      label='First Name'
    />
    <Column
      width={800}
      dataKey='last_name'
      label='Last Name'
    />
    <Column
      width={800}
      dataKey='score'
      label='Score'
    />
    <Column
      width={800}
      dataKey='practice_week'
      label='Practice This Week'
    />
    <Column
      width={800}
      dataKey='practice_year'
      label='Practice This Year'
    />
  </Table>
)

Tracking.propTypes = {
  // rename
  data: PropTypes.arrayOf(PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    score_name: PropTypes.string,
    practice_week: PropTypes.number,
    practice_year: PropTypes.number,
  })),
}

export default Tracking