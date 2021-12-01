// External dependencies
import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import isEqual from 'lodash.isequal';
import merge from 'lodash.merge';
import orderBy from 'lodash.orderby';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Select from 'react-select';
import cx from 'classnames';
import FaAngleLeft from 'react-icons/lib/fa/angle-left';

// Components
import MillerControl from '../../blocks/Miller';
import Dropdown from '../../../Global/Dropdown';
import { tooltipTypes, Tooltip } from '../../../Global/Tooltip';

// Internal dependencies
import { roster, states } from '../../values/ui';
import { selectionTypes } from '../../values/enums';
import { metrics, comprehensiveAssessmentMetrics } from '../../values/metrics';
import rosterCreators from '../../state/roster/creators';
import teacherCreators from '../../state/teacher/creators';
import { generateDistrictBenchmarkOptions } from '../../util/applicableAndDefaultBenchmarks';
import { msbType, locales } from '../../../../constants/constants';

class TeacherSelections extends React.Component {
  constructor (props) {
    super(props)

    this.onSelectMetric = this.onSelectMetric.bind(this);
    this.onSelectBenchmark = this.onSelectBenchmark.bind(this);
    this.onSelectScale = this.onSelectScale.bind(this);
    this.handleLocaleChange = this.handleLocaleChange.bind(this);
    this.onMillerSelection = this.onMillerSelection.bind(this);
    this.handleToggleEquating = this.handleToggleEquating.bind(this);
    this.handleRosterDependentInitialization = this.handleRosterDependentInitialization.bind(this);
    this.handleReadingRiskChange = this.handleReadingRiskChange.bind(this);
  }

  componentDidMount () {
    this.props.initializeRoster();
  }

  componentDidUpdate(prevProps, prevState) {
    // Once the roster is initialized, handle roster dependent intialization
    if(this.props.rosterStatus !== 'PENDING') {
      // If this is an ORF report, and metrics have been correctly populated, there should be 1 metric
      // Else, the num available metrics should match the metric options from values.
      let targetNumAvailableMetrics = metrics.length;
      let currMsbType = this.props.teacherSelectionTypes.msbType;
      if(currMsbType && currMsbType == msbType.ORF || currMsbType == msbType.DYSLEXIA) {
        targetNumAvailableMetrics = 1;
      } else if(currMsbType && currMsbType == msbType.COMPREHENSIVE) {
        targetNumAvailableMetrics += comprehensiveAssessmentMetrics.length;
      }
      if(this.props.metrics.length != targetNumAvailableMetrics && this.props.selectedClass && this.props.schools) {
        this.handleRosterDependentInitialization();
      } else if(this.props.district) {
        // If roster is complete, and the current class changed, update selections accordingly
        if(prevProps.selectedClass != this.props.selectedClass) {
          this.handleRosterDependentInitialization();
        }
      }
    }
  }

  // Initializes values that change depending on the roster
  // This currently includes M/S/B and custom benchmarks
  handleRosterDependentInitialization() { // Note: function abstracted for readability
    this.props.setDefaultSelections(this.props.district, this.props.students, this.props.teacherSelectionTypes.msbType);
    this.props.loadCustomBenchmarks(this.props.district); // TODO add school and state as params
  }

  handleToggleEquating(equatingSelected) {
    this.props.teacherSelect(
      {
        type: "equating",
        data: equatingSelected,
      },
      this.props.district,
      this.props.students
    );
  }

  onMillerSelection(data, currentSelectionType) {
    // Aggregate reports have class as primary selection
    this.props.rosterSelect({
      type: currentSelectionType,//type of selection
      data,
    });
  }

  onSelectMetric(selectedOption) {
    this.props.teacherSelect(
      {
        type: 'metric',
        data: selectedOption,
      },
      this.props.district,
      this.props.students
    );
  }

  onSelectScale(selectedOption) {
    this.props.teacherSelect(
      {
        type: 'scale',
        data: selectedOption,
      },
      this.props.district,
      this.props.students,
    );
  }

  onSelectBenchmark (selectedOption) {
    this.props.teacherSelect(
      {
        type: 'benchmark',
        data: selectedOption,
      },
      this.props.district,
      this.props.students,
    );
  }

  handleLocaleChange(selectedOption) {
    this.props.teacherSelect(
      {
        type: 'locale',
        data: selectedOption,
      },
      this.props.district,
      this.props.students,
    );
  }

  handleReadingRiskChange(selectedOption){
    const { selectedReadingRisks } = this.props;

    this.props.teacherSelect(
      {
        type: 'readingRisks',
        data: selectedReadingRisks.includes(selectedOption)
          ? selectedReadingRisks.filter(t => t !== selectedOption) : [selectedOption, ...selectedReadingRisks],
      },
      this.props.district,
      this.props.students,
    );
  }

  onGoHome() {
    if(this.props.isAdminReport) {
      return () => this.props.history.push('/admin');
    }
    return () => this.props.history.push('/teacher/reports');
  }

  render () {
    const { type } = this.props;
    const noOptions = [{
      value: "none",
      label: "none"
    }];

    // TODO: use helper components for scales, metrics, and benchmarks
    // Metric
    let disabledMetric = !(this.props.metrics && this.props.metrics.length > 1);

    // Scale
    let disabledScale = !(this.props.scales && this.props.scales.length > 1);
    let scale =(
      <div className="reports-scale-selection">
        <div className="reportsAdditionalSelectionTitle"> SCALE
          <Tooltip type={tooltipTypes.scale} />
        </div>
        <Dropdown
          options={this.props.scales}
          value={this.props.selectedScale}
          onChange={this.onSelectScale}
          isDisabled={disabledScale}
        />
      </div>
    );

    // Benchmark
    // TODO abstract this logic somewhere. Reconsider approach.
    const { benchmarks } = this.props;
    let disabledBenchmark = !(benchmarks && benchmarks.length > 1);
    let benchmark;
    if(this.props.teacherSelectionTypes.msbType && this.props.teacherSelectionTypes.msbType == msbType.ORF) {
      benchmark = null;
    } else {
      benchmark = (
        <div className="reports-benchmark-selection">
          <div className="reportsAdditionalSelectionTitle"> BENCHMARKS
            <Tooltip type={tooltipTypes.benchmarks} />
          </div>
          <Dropdown
            options={benchmarks}
            value={this.props.selectedBenchmark}
            onChange={this.onSelectBenchmark}
            isDisabled={disabledBenchmark}
          />
        </div>
      );
    }

    let enableScoreScaling = this.props.teacherSelectionTypes.hasScoreScaling;
    if(!this.props.teacherSelectionTypes.isAggregateReport && !this.props.selectedStudent) {
      if(!this.props.teacherSelectionTypes.msbType || this.props.teacherSelectionTypes.msbType != msbType.ORF) {
        enableScoreScaling = false;
      }
    }
    const additionalSelectStyle = cx({
      "reportsAdditionalSelections": true,
      "hidden": !enableScoreScaling,
    });

    let backText = "BACK TO ALL REPORTS";
    if(this.props.isAdminReport) {
      backText = "BACK TO ADMIN";
    }

    return (
      <div className="report-selections">
        {this.props.active &&
          <div className="report-selection-body">
            <div className="report-selection-body-main">
              <div
                className="teacherSelectionBack"
                onClick={this.onGoHome()}>
                <FaAngleLeft size="22" className="teacherBackBtn"/>
                {backText}
              </div>
              <div className="teacherSelectionHeader"> {this.props.teacherSelectionTypes.pageTitle}</div>
              {!this.props.teacherSelectionTypes.disabledRostering && <MillerControl
                type={type}
                types={this.props.types}
                search={get(this.props, `search.${type}`)}
                recent={get(this.props, `recent.${type}`)}
                results={get(this.props, `results.${type}`)}
                onType={this.onType}
                onSelect={this.onSelect}
                onSearch={this.onSearch}
                isAggregateReport={this.props.teacherSelectionTypes.isAggregateReport}
                isSchoolReport={this.props.teacherSelectionTypes.isSchoolReport}
                schools={this.props.schools}
                classes={this.props.classrooms.map(classroom => classroom.ui)}
                students={this.props.students.map(student => student.ui)}
                selectedSchool={this.props.selectedSchool}
                selectedClass={this.props.selectedClass}
                selectedStudent={this.props.selectedStudent}
                onMillerSelection={this.onMillerSelection}
                rosterStatus={this.props.rosterStatus}
              />}
              {this.props.teacherSelectionTypes.hasScoreScaling &&
                <div className={additionalSelectStyle}>
                  <div className="reportsMetricConfigTitle"> SCORE CONFIGURATION </div>
                  <div>
                    <div className="reportsAdditionalSelectionTitle"> METRIC
                      <Tooltip type={tooltipTypes.metric} />
                    </div>
                    <Dropdown
                      options={this.props.metrics}
                      value={this.props.selectedMetric}
                      onChange={this.onSelectMetric}
                      isDisabled={disabledMetric}
                    />
                  </div>
                  {this.props.selectedMetric && !this.props.isAdminReport && this.props.selectedMetric.value == "ORF" &&
                  <div className="reportsSubselection">
                    <div className="reportsAdditionalSelectionTitle"> SCORE TYPE
                      <Tooltip type={tooltipTypes.scoreType} />
                    </div>
                    <div className="reportsRadioButtonSet">
                      <div className="reportsRadioButton" >
                        <input
                          type="radio"
                          onChange={() => this.handleToggleEquating(true)}
                          id="equated_radio_btn"
                          checked={this.props.selectedEquating}
                          name="selector" />
                        <label htmlFor="equated_radio_btn">Adjusted (for comparability)</label>
                        <div className="check"></div>
                      </div>
                      <div className="reportsRadioButton" >
                        <input
                          type="radio"
                          id="unequated_radio_btn"
                          onChange={() => this.handleToggleEquating(false)}
                          checked={!this.props.selectedEquating}
                          name="selector" />
                        <label htmlFor="unequated_radio_btn">Unadjusted (raw scores)</label>
                        <div className="check"></div>
                      </div>
                    </div>
                  </div>
                  }
                  {scale}
                  {benchmark}
                </div>}
                {this.props.teacherSelectionTypes.hasLanguageSelection &&
                <div className="reportsSubselection">
                  <div className="reportsAdditionalSelectionTitle"> LANGUAGE </div>
                  <div className="reportsRadioButtonSet">
                    <div className="reportsRadioButton" >
                      <input
                        type="radio"
                        id="en-us_radio_btn"
                        onChange={() => this.handleLocaleChange(locales.EN_US)}
                        checked={this.props.selectedLocale === locales.EN_US}
                        name="languageOption" />
                      <label htmlFor="en-us_radio_btn">English</label>
                      <div className="check"></div>
                    </div>
                    <div className="reportsRadioButton" >
                      <input
                        type="radio"
                        id="es-mx_radio_btn"
                        onChange={() => this.handleLocaleChange(locales.ES_MX)}
                        checked={this.props.selectedLocale === locales.ES_MX}
                        name="languageOption" />
                      <label htmlFor="es-mx_radio_btn">Spanish</label>
                      <div className="check"></div>
                    </div>
                  </div>
                </div>}
                {this.props.teacherSelectionTypes.hasReadingRiskType &&
                <div className="reportsSubselection">
                  <div className="reportsAdditionalSelectionTitle">READING RISK TYPE</div>
                  <div className="reportsCheckbox">
                    <label>
                      <input
                        id={locales.EN_US}
                        type="checkbox"
                        checked={this.props.selectedReadingRisks.includes(locales.EN_US)}
                        onChange={() => this.handleReadingRiskChange(locales.EN_US)}
                      />
                      English Reading Risk
                    </label>
                  </div>
                  <div className="reportsCheckbox">
                    <label>
                      <input
                        id={locales.ES_MX}
                        type="checkbox"
                        checked={this.props.selectedReadingRisks.includes(locales.ES_MX)}
                        onChange={() => this.handleReadingRiskChange(locales.ES_MX)}
                      />
                      Spanish Reading Risk
                    </label>
                  </div>
                </div>}
            </div>
          </div>
        }
      </div>
    )
  }
}

// TODO: refine this redux
const mapStateToProps = (state) => {
  const { roster } = state.reports;

  return {
    metrics: get(state, 'reports.teacher.metrics', []),
    scales: get(state, 'reports.teacher.scales', []),
    benchmarks: get(state, 'reports.teacher.benchmarks', []),
    roster: get(state, 'reports.roster.data'),
    status: get(state, 'reports.roster.status'),
    customBenchmarks: get(state, 'reports.teacher.customBenchmarks'),
    applicableGrades: get(state, 'reports.teacher.applicableGrades'),
    district: roster.data && roster.data.district ? roster.data.district[0].ui : null,
    selectedSchool: roster.ui && roster.ui.selections.school ? roster.ui.selections.school : null,
    selectedClass: roster.ui && roster.ui.selections.classroom ? roster.ui.selections.classroom : null,
    selectedStudent: roster.ui && roster.ui.selections.student ? roster.ui.selections.student : null,
    students: roster.data && roster.data.student ? roster.data.student : [],
    classrooms: roster.data && roster.data.classroom ? roster.data.classroom : [],
    schools: roster.data && roster.data.school ? roster.data.school : [],
    rosterStatus: roster.status ? roster.status.type : null,
    active: get(state, 'reports.roster.ui.active', true),
    type: get(state, 'reports.roster.ui.type'),
    types: get(state, 'reports.roster.ui.types'),
    selectedLocale: get(state, 'reports.teacher.selectedLocale', null),
    selectedReadingRisks: get(state, 'reports.teacher.selectedReadingRisks', []),
  }
};

const mapDispatchToProps = (dispatch) => ({
  rosterSelect: (selection) => dispatch(rosterCreators.rosterSelect(selection)),
  initializeRoster: () => dispatch(rosterCreators.initializeRoster()),
  teacherSelect: (selection, district, students) => dispatch(teacherCreators.teacherSelect(selection, district, students)),
  setDefaultSelections: (district, students, msbType) => dispatch(teacherCreators.teacherDefaultSelections(district, students, msbType)),
  loadCustomBenchmarks: (district) => dispatch(teacherCreators.loadCustomBenchmarks(district)),
});

// TODO update prop types
TeacherSelections.propTypes = {
  active: PropTypes.bool,
  recent: PropTypes.object,
  search: PropTypes.string,
  teacherSelectionTypes: PropTypes.object,
  status: PropTypes.object, // container-level status
}

export default connect(mapStateToProps, mapDispatchToProps)(TeacherSelections);