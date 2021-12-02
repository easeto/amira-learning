import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import isEqual from 'lodash.isequal';
import merge from 'lodash.merge';
import orderBy from 'lodash.orderby';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import formatNumberWithCommas from '../../../util/formatNumberWithCommas';
import studentRecordService from '../../../../../services/StudentRecordService';
import { app } from '../../../values/ui';
import CalendarCheck from '../../../../../images/assessment_tracking_icons/CalendarCheck';
import CalendarRedoIcon from '../../../../../images/assessment_tracking_icons/CalendarRedo';
import CalendarAssignedIcon from '../../../../../images/assessment_tracking_icons/CalendarAssigned';
import {getUserData} from '../../../../../services/API';
import esIcon from '../../../../../images/language-code-icons/es.png';

import FaRepeat from 'react-icons/lib/fa/repeat';
import Loading from '../../../../Global/Loading';
import Caret from '../../../../Global/svg/Caret';
import { tooltipTypes, Tooltip } from '../../../../Global/Tooltip';

const headers = app.trackingTable.headers;
const statusOfAssignment = {
  ASSIGNED: 'Assigned',
  SCORING: 'Scoring...',//To be used later
  INPROGRESS: 'In progress',//To be used later
};

const getHeaderLabelTooltip = (label) => {
  switch (label) {
    case 'Score':
      return (
        <Tooltip type={tooltipTypes.score} />
      )
  }
}
// ABSTRACT ME FOR GEN TABLE REUSE
const Header = ({ sorts, onClick }) => {
  const headerClick = (data) => {onClick(data)}
  // newline splits -> tooltips
  return (
    <thead className="tracking-table-header">
      <tr className="tracking-table-header-row">
        {headers.map((it, i) => {
          let value = it.value;
          let tooltip = getHeaderLabelTooltip(it.label);
          let found = false; //
          let iconClass = "tracking-table-header-icon";
          let down = false;
          if(sorts.length > 0) {
            found = (sorts[0].type === value);
            down = sorts[0].dir === 'asc' ? true : false;
          }

          // dump me for clean class naming
          let cls = `tracking-table-header-cell ${found && 'active'}`
          let headerClick = () => {onClick(value)}
          return (
            <th key={i} onClick={headerClick} className={cls}>
              <span className="tracking-table-header-data">
                {it.label}{tooltip}
                {found && <Caret iconClass={iconClass} down={down} />}
              </span>
              {it.subText &&
                <span className="tracking-table-header-subText">{it.subText}</span>
              }
            </th>
          )
        })}
      </tr>
    </thead>
  )
}

const Row = ({ data, index, onClick, cutoffs, min, max, onRowSelected, selected, loading, assignmentMode }) => {
  const cellClick = (datum) => {onClick({index: index, row: data, cell: datum})}
  const selectedClass = cx({
   'tracking-table-body-row': true,
   'selected-row': selected,
   'non-selectable': data.assessmentStatus && (data.assessmentStatus.id == 'ASSIGNED' || data.assessmentStatus.id == 'INCOMPLETE'|| data.assessmentStatus.id == 'IN_PROGRESS'|| data.assessmentStatus.id == 'UNDER_REVIEW'),
   'error': data.assessmentStatus && data.assessmentStatus.needsAttention,
   'highlight': data.assessmentStatus && data.assessmentStatus.started && !data.assessmentStatus.needsAttention,
   'assignedInAssignmentMode': assignmentMode && data.assessmentStatus && data.assessmentStatus.id == 'ASSIGNED',
  });
  const localeIcon = data.isSpanishActivity ? esIcon : null;
  return (
    <tr className={selectedClass} onClick={() => onRowSelected(data)}>
      <Cell data={{last_name: data.last_name}} onClick={cellClick} />
      <Cell data={{first_name: data.first_name}} onClick={cellClick} />
      <ScoreCell
        loading={loading}
        score={data.score}
        date= {data.date}
        localeIcon={localeIcon}
        onClick={cellClick}
        cutoffs={cutoffs}
        min={min}
        max={max}
      />
      <AssessmentCell status={data.assessmentStatus} selected={selected} />
    </tr>
  )
}

// make cell inner injectable
const Cell = ({ data, onClick, isNumber = false }) => {
  const cellClick = () => {onClick(data)}
  let numberStyling = isNumber ? 'tracking-number-cell' : '';
  return (
    <td onClick={cellClick} className={`tracking-table-body-cell ${numberStyling}`}>
      {Object.values(data)[0]}
    </td>
  );
}

const AssessmentCell = ({ status, selected }) => {
  if(selected) {
    return (
      <td className="tracking-table-body-cell trackingAssessment">
        <div className="statusIcon"></div>
        <span className='assignmentStatusLabel selected'>selected</span>
      </td>
    )
  }
  if(status) {
    let label = status.label;
    if(status.id == "SCORING") { // special case this label on this page
      label = "SCORING";
    }
    return (
      <td className="tracking-table-body-cell trackingAssessment">
        {status.id == "ASSIGNED" && <div className="statusIcon"><CalendarAssignedIcon color="#555561" /></div>}
        {status.id == "INCOMPLETE" && <div className="statusIcon"><CalendarAssignedIcon color="#ffd700" /></div>}
        {(status.id == "ABORTED" || status.id == "ERROR") && <div className="statusIcon"><CalendarRedoIcon color="#ff6666" /></div>}
        {(status.id == "PRE-READER") && <div className="statusIcon"><CalendarCheck color="#ffd700" /></div>}
        {(status.id == "COMPLETE" || status.id == "RESCORED") && <div className="statusIcon"><CalendarCheck color="#555561" /></div>}
        {(status.id == "IN_PROGRESS" || status.id == "SCORING" || status.id == "UNDER_REVIEW") && <div className="statusIcon">...</div>}
        {!status.id && <div className="statusIcon"></div>}
        <span className='assignmentStatusLabel'>{status.label}</span>
      </td>
    );
  }
  return (<td className="tracking-table-body-cell trackingAssessment"></td>);
}

// TODO break this out into it's own file/component
const ScoreCell = ({ score, date, onClick, cutoffs, min, max, loading, localeIcon }) => {
  const cellClick = () => {onClick({score: score})}
  let className = '';
  if(score) {
    if(score < cutoffs.POOR) {
      className = 'tracking-score-low';
    } else if(score < cutoffs.AVERAGE) {
      className = 'tracking-score-medium';
    } else if(score < cutoffs.GOOD) {
      className = 'tracking-score-medium';
    } else {
      className = 'tracking-score-high';
    }
    // TODO create a less fragile check for the existence of benchmarks
    if(cutoffs.POOR === -1000) {
      className = 'trackingScoreNoBenchmarks';
    }
  }

  let formattedDate = '';
  if(date) {
    const datePieces = date.split("T")[0].split("-");
    formattedDate = datePieces[1] + '/' + datePieces[2];
  }

  if(loading){
    return (
      <td className="tracking-table-body-cell trackingAssessment">
        <Loading />
      </td>
    );
  }

  return (
    <td onClick={cellClick} className="tracking-table-body-cell tracking-table-score-cell">
        <div className="tracking-table-score-data">
          <div className="tracking-table-score-text">
            <div className={`tracking-table-score ${className}`}>{formatNumberWithCommas(score)}</div>
            <div className="tracking-table-score-date">
              {score && formattedDate}
            </div>
            <div className="tracking-table-score-locale">
              {localeIcon && <img src={localeIcon} className="locale-icon" alt=""/>}
            </div>
          </div>
          {score && <Score score={score} className={className} min={min} max={max}/>}
        </div>
    </td>
  )
}

const Score = ({score, className, min, max}) => {
  const perc = ((score - min) * 100) / (max - min);
  return (
    <hr style={{width: `calc(${perc}%)`}} className={`tracking-table-score-length ${className}`}></hr>
  )
}

class Tracking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      selectAll: false,
      loadingSeleted: [],
      studentWithStatus: [],
    };

    this.tableSort = this.tableSort.bind(this);
    this.tableSelect = this.tableSelect.bind(this);
    this.onRowSelected = this.onRowSelected.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.createAssignment = this.createAssignment.bind(this);
    this.checkStudents = this.checkStudents.bind(this);
  }

  componentDidMount(){
    this.checkStudents(this.props.reportData);
  }

  componentDidUpdate(prevProps){
    this.state.studentWithStatus && this.props.reportData != prevProps.reportData && this.checkStudents(this.props.reportData);
  }

  tableSort(data){
    this.props.onSort && this.props.onSort(data);
  }

  tableSelect(data){
    this.props.onSelect && this.props.onSelect(data);
  }

  // Check to see if any of the students have a pending assignment
  // and add an assignmentStatus property to every student
  checkStudents(students){
    //Collect the ids of all the students
    let studentIds = students.map(({ studentId }) => studentId);

    //check which students have pending assignments
    studentRecordService.studentActivities(studentIds, 1, "assessment", ["assigned", "not_started"], false)
      .then((studentsWithAssignments) => {
        //Ids with pending assignments
        let assignmentIds = studentsWithAssignments.map(({ studentId }) => studentId);

        //Adding assignment status to students
        let studentWithStatus = students.map((student) => ({
          ...student,
          assignmentStatus: assignmentIds.includes(student.studentId) ? statusOfAssignment.ASSIGNED : "",
        }));

        //Update Students
        this.setState({studentWithStatus});
      });
  }

  createAssignment(){
    //create loading state
    this.setState({
      loadingSeleted: this.state.selected,
    });
    //Create a new assignment if and only if the student doesn't have one.
    this.state.selected.map((studentId) => {
      studentRecordService.createActivity("assessment", studentId, "1234", "assigned",null,"not_started",getUserData().districtId,getUserData().schoolId).then((response) => {
        if(response.data && response.data.putActivity && response.data.putActivity.activityId){
          this.setState((prevState) => ({
            loadingSeleted: prevState.loadingSeleted.filter((id) => id != studentId),//Remove Loading State
            studentWithStatus: prevState.studentWithStatus.map((student) => ({
              ...student,
              assessmentStatus: studentId == student.studentId ? {label: "ASSIGNED", id: "ASSIGNED"} : student.assessmentStatus,//Update Student's Status
            }))
          }));
          console.log("Activity Created - ID: ", response.data.putActivity.activityId);
        }
      });
    });

    //Remove the selection
    this.setState((prevState) => ({
      selected: [],
    }));
  }

  selectAll(){
    this.setState((prevState) => ({
      selectAll: !prevState.selectAll,
      selected: prevState.selectAll
        ? []
        : this.state.studentWithStatus
          .filter(({ assessmentStatus:status }) => (status && status.id != "ASSIGNED"))
          .map(({ studentId }) => studentId),
    }));
  }

  onRowSelected({ studentId, assessmentStatus:status }){
    if(status && status.id != "ASSIGNED"){
      this.setState((prevState) => ({
        selected: prevState.selected.includes(studentId)
          ? prevState.selected.filter((s) => s != studentId)
          : prevState.selected.concat([studentId]),
      }));
    }
  }

  findMinScore(reportData) {
    let min = reportData.reduce((prev, current) => {
      if(!current.score) {
        if(prev && prev.score) {
          return prev;
        }
        return null;
      }
      if(prev && prev.score && prev.score < current.score) {
        return prev;
      }
      return current;
    });
    min = min && 0 > min ? min : 0;
    return min;
  }

  findMaxScore(reportData) {
    let max = reportData.reduce((prev, current) => {
      if(!current.score) {
        if(prev && prev.score) {
          return prev;
        }
        return null;
      }
      if(prev && prev.score && prev.score > current.score) {
        return prev;
      }
      return current;
    });
    max = max ? max.score : 0; // if no score, then 0
    return max;
  }

  render() {
    const { reportData, cutoffs, sorts, onSort, onSelect, onScroll, isScrolled } = this.props;
    const tableStyles = cx({
     'tracking-table': true,
     'unscrolled': !isScrolled,
    });

    const assignmentStyles = cx({
     'assignmentControls': true,
     'disabledAssignmentControls': (this.state.selected.length == 0)
    });

    let noAssessmentsAssignable = false;
    const assignedAssessmentCount = this.state.studentWithStatus.reduce((acc, data) => {
      if(data.assessmentStatus.id == "ASSIGNED") {
        acc += 1;
      }
      return acc;
    }, 0);
    if(assignedAssessmentCount == this.state.studentWithStatus.length) {
      noAssessmentsAssignable = true;
    }
    const selectButtonStyles = cx({
      'primaryTeacherButton': true,
      'left': true,
      'isDisabled': noAssessmentsAssignable,
    });


    let studentWithErrorExists;
    this.state.studentWithStatus.map(studentData => {
      if(studentData.assessmentStatus && studentData.assessmentStatus.id == 'ERROR') {
        studentWithErrorExists = true;
      }
    })

    const tableBodyStyles = cx({
      'tracking-table-body': true,
      'noZebraBody': (this.state.selected.length > 0) // revisit this: (this.state.selected.length > 0) || studentWithErrorExists,
    });

    let min = this.findMinScore(reportData);
    let max = this.findMaxScore(reportData);

    const selectedBtnText = this.state.selectAll ? "Cancel" : "Select All";

    return (
      <div className="trackingTableBody">
        <div className="trackingTableContainer">
          <table className={tableStyles}>
            <Header sorts={sorts} onClick={this.tableSort} />
            <tbody className={tableBodyStyles} onScroll={onScroll}>
            {this.state.studentWithStatus.map((data, i) =>
              <Row
                key={i}
                data={data}
                selected={this.state.selected.includes(data.studentId)}
                assignmentMode={(this.state.selected.length > 0)}
                loading={this.state.loadingSeleted.includes(data.studentId)}
                index={i}
                onClick={this.tableSelect}
                onRowSelected={this.onRowSelected}
                cutoffs={cutoffs}
                min={min}
                max={max}/>
            )}
            </tbody>
          </table>
        </div>
        <div key="assignmentControls" className={assignmentStyles}>
          <button className={selectButtonStyles} onClick={this.selectAll}>{selectedBtnText}</button>
          <button className="primaryTeacherButton emphasized" onClick={this.createAssignment}>Assign {this.state.selected.length} assessments</button>
        </div>
      </div>
    );
  }
}

Tracking.propTypes = {
  onSort: PropTypes.func,
  onSelect: PropTypes.func,
  sorts: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    dir: PropTypes.string,
  })),
  reportData: PropTypes.arrayOf(PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    date: PropTypes.string,
    score: PropTypes.number,
    practice: PropTypes.number,
    total: PropTypes.number,
    cutoffs: PropTypes.array,
  })),
}

export default Tracking