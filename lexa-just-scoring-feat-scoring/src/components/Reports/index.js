import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import set from 'lodash.set';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import {locales, msbType} from '../../constants/constants';
import { metrics } from './values/metrics';
import { getUserData } from '../../services/API';
import { selectionTypes, reportTypes } from './values/enums';

// TODO: revert to mapping out reports based on routes?

import SplashScreen from './blocks/Menu/Splash';


// POST MVP // import PlanningReport from './containers/Planning';

import ReportPrintHeader from '../Teacher/Reports/ReportPrintHeader';
import rosterService from './services/roster';

// Icons

/*
ReportingPortal renders a report and TeacherSelections.
*/

// defines props of each report, which determine the available teacher selections.
// TODO refactor to move these props into routes.js



// Splashblock props -
// todo refactor so this isn't necessary
// https://amiralearning.atlassian.net/jira/software/projects/AE/boards/6/backlog?selectedIssue=AE-907&text=refactor
let menuBlocks = [

];

const InvisibleReport = () => {
  return (
    <div className="reports-container reportsHidden"></div>
  )
}

class ReportingPortal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedMetric: metrics[0],
      selectedScale: null,
      selectedBenchmark: null,
      hasFetched: false,
    }

    this.initializeData = this.initializeData.bind(this);
    this.getReportData = this.getReportData.bind(this);
  }

  // When selections change, evaluate whether a report needs to be loaded or rescaled.
  //
  // Note: component is updated immediately to pull default scale and benchmark based on default metric.
  // Therefore, calling fetchReport in componentDidMount is currently unnecessary.
  // TODO: refactor this function to be shorter
  componentDidUpdate(prevProps, prevState) {

  }

  getReportData(fetch, scale) {

  }

  initializeData() {
    this.getReportData(true, false);
  }

  getMenuItems() {
    let menuItems = menuBlocks;

    // change menu blocks depending on user permissions
    if(getUserData().dyslexiaEnabled) {
    }

    return menuItems;
  }

  render () {

    return (
      <div className="reports-root-container">
      </div>
    )
  }
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

const mapStateToProps = (state) => {

  return {}
};

// TODO cache activities within redux, as opposed to passing them in in order to rescale
const mapDispatchToProps = (dispatch) => ({});

ReportingPortal.propTypes = {
  trackingActivities: PropTypes.array,
  benchmarkActivities: PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportingPortal);
