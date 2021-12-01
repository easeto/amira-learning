import get from 'lodash.get'
import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import { app } from '../../../values/ui'
import metrics from '../../../values/metrics'

const MetricSelect = ({ selection, onChange }) => {
  const metricChange = (selection) => {
    onChange && onChange(selection)
  }

  const onSelect = (data) => {
    metricChange({
      type: MetricSelect.TYPES.METRIC,
      data: data,
    })
  }

  return (
    <div className="reports-select">
      <div className="score-select">
        <Select
          menuPlacement="auto"
          classNamePrefix="score-select"
          value={selection || ''}
          onChange={onSelect}
          options={Object.values(metrics)}
          placeholder={app.selectPanel.metrics}
        />
      </div>
    </div>
  )
}

MetricSelect.TYPES = {
  METRIC: 'metric',
}

MetricSelect.propTypes = {
  // describe
  selection: PropTypes.object,
  onChange: PropTypes.func,
}

export default MetricSelect