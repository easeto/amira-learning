import get from 'lodash.get'
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const ParentTip = ({ id, number, label, link }) => {
  return (
    <div className="parent-tip-container">
      <div className="parent-tip">
        <div className="parent-tip-header">{number}</div>
        <div className="parent-tip-body">
          {link && <Link className="parent-tip-link" to={link}>{label}</Link>}
          {/* drop span if unnecessary */}
          {!link && <span className="parent-tip-item">{label}</span>}
        </div>
      </div>
    </div>
  )
}

const base = PropTypes.shape({
  // maybe not - necessary if greater/deeper context interaction || linking
  id: PropTypes.string,
  label: PropTypes.string,
  link: PropTypes.string,
})

ParentTip.propTypes = {
  tip: Object.assign({number: PropTypes.number}, base)
}

const ParentTips = ({ tips }) => {
  return (
    <div className="parent-tips-container">
      <div className="parent-tips">
        {tips.map((tip, i) => (<ParentTip {...tip} number={i + 1} />))}
      </div>
    </div>
  )
}

ParentTips.propTypes = {
  tips: PropTypes.arrayOf(base)
}

export default ParentTips