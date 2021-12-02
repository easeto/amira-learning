import React from 'react';
import moment from 'moment';
import amiraLogo from '../../../images/AmiraLogo.svg'

export default class ReportPrintHeader extends React.Component {
  constructor (props){
    super(props);
  }

  render() {
    let { reportType, selectedStudent, selectedClass, school } = this.props;
    let reportName = reportType && (reportType.charAt(0).toUpperCase() + reportType.slice(1).toLowerCase() + " Report for ") + (selectedStudent ? selectedStudent.label : selectedClass)
    let schoolName = school && school[0] && school[0].label;

    return (
      <div className="ReportPrintHeader">
        <div className="reportName">{reportName}</div>
        <div className="home"><img className="amiraLogo" src={amiraLogo} /></div>
      </div>
    );
  }
}
