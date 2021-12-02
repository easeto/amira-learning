import get from 'lodash.get'
import React from 'react'
import PropTypes from 'prop-types'

import AggregateMiller from './Aggregate'
import CurrentSelectionMiller from './Current'

import { app } from '../../values/ui'

class MillerControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      aggregateClassMillerIsOpen: false,
      aggregateSchoolMillerIsOpen: false,
    }
  }

  onAggregateClassMillerOpened() {
    this.setState({
      aggregateClassMillerIsOpen: true,
    });
  }
  onAggregateClassMillerClosed() {
    this.setState({
      aggregateClassMillerIsOpen: false,
    });
  }
  onAggregateSchoolMillerOpened() {
    this.setState({
      aggregateSchoolMillerIsOpen: true,
    });
  }
  onAggregateSchoolMillerClosed() {
    this.setState({
      aggregateSchoolMillerIsOpen: false,
    });
  }

  render() {
    let currentSelection;
    let currentSelectionOptions;
    let currentSelectionType;
    let aggregateMillerIsOpen = false;
    if(this.props.isAggregateReport) {
      currentSelectionOptions = this.props.classes;
      currentSelection = this.props.selectedClass;
      currentSelectionType = "classroom"; // TODO use enum
      if(this.state.aggregateSchoolMillerIsOpen) {
        aggregateMillerIsOpen = true;
      }
      if(this.props.isSchoolReport) {
        currentSelection = this.props.selectedSchool;
        currentSelectionOptions = this.props.schools;
        currentSelectionType = 'school';
      }
    } else {
      currentSelectionOptions = this.props.students;
      currentSelection = this.props.selectedStudent;
      currentSelectionType = "student"; // TODO use enum
      if(this.state.aggregateSchoolMillerIsOpen || this.state.aggregateClassMillerIsOpen) {
        aggregateMillerIsOpen = true;
      }
    }
    return (
      <div className="miller">
        {!this.props.isSchoolReport && <AggregateMiller
          isAggregateReport={this.props.isAggregateReport}
          classes={this.props.classes}
          schools={this.props.schools}
          selectedSchool={this.props.selectedSchool}
          selectedClass={this.props.selectedClass}
          onClassMillerSelection={(data) => this.props.onMillerSelection(data, "classroom")}
          onSchoolMillerSelection={(data) => this.props.onMillerSelection(data, "school")}
          onAggregateClassMillerOpened={() => this.onAggregateClassMillerOpened()}
          onAggregateClassMillerClosed={() => this.onAggregateClassMillerClosed()}
          onAggregateSchoolMillerOpened={() => this.onAggregateSchoolMillerOpened()}
          onAggregateSchoolMillerClosed={() => this.onAggregateSchoolMillerClosed()}
        />}
        <CurrentSelectionMiller
          isAggregateReport={this.props.isAggregateReport}
          aggregateMillerIsOpen={aggregateMillerIsOpen}
          options={currentSelectionOptions}
          selection={currentSelection}
          onMillerSelection={(data) => this.props.onMillerSelection(data, currentSelectionType)}
          rosterStatus={this.props.rosterStatus}
        />
      </div>
    );
  }
}

// TODO default props
MillerControl.defaultProps = {

}

// TODO update proptypes
  /*type=null,
  types=[],
  results=[],
  recent=[],
  selections={},
  search='',
  onSelect,
  onSearch,
  onType,
  onClose,
  isAggregateReport,
  schools,
  classes,
  students,
  selectedSchool,
  selectedClass,
  selectedStudent,
  onMillerSelection,
  rosterStatus,*/

MillerControl.propTypes = {
  type: PropTypes.string,
  // hierarchical order
  types: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
  search: PropTypes.string,
  // describe
  results: PropTypes.object,
  // describe
  selections: PropTypes.object,
  // describe
  recents: PropTypes.object,
  onSearch: PropTypes.func,
  onSelect: PropTypes.func,
  onType: PropTypes.func,
  onClose: PropTypes.func,
  aggregateReport: PropTypes.bool
}

export default MillerControl