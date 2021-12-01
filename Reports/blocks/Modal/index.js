import get from 'lodash.get'
import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

// font awesome me
const CloseIcon = ({ onClick }) => (<i onClick={onClick}>X</i>)

const ReportModal = ({ elementId, header, onClose, children }) => {
  const modalClose = () => {onClose && onClose()}
  // will break in universal/isomorphic/ssr
  // UGH. REQUIRES REACT UPGRADE TO 16.
    // currently at react 15...
  // return ReactDOM.createPortal(
  //   <div className="reports-modal">
  //     <div className="reports-modal-header">
  //       {/* mod me/add elements if/when  */}
  //       <h4>{header}<CloseIcon onClose={modalClose} /></h4>
  //     </div>
  //     <div className="reports-modal-body">
  //       {children}
  //     </div>
  //   </div>, document.getElementById(elementId)
  // )
  return(
    <div className="reports-modal">
      <div className="reports-modal-header">
        {/* mod me/add elements if/when  */}
        <h4>{header}<CloseIcon onClick={modalClose} /></h4>
      </div>
      <div className="reports-modal-body">
        {children}
      </div>
    </div>
  )
}

ReportModal.propTypes = {
  elementId: PropTypes.string,
  header: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.element,
}

export default ReportModal
