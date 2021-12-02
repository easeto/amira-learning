import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import cx from 'classnames';

const AggregateMiller = ({
  isAggregateReport=false,
  classes,
  schools,
  selectedSchool,
  selectedClass,
  onClassMillerSelection,
  onSchoolMillerSelection,
  onAggregateSchoolMillerOpened,
  onAggregateSchoolMillerClosed,
  onAggregateClassMillerOpened,
  onAggregateClassMillerClosed,
}) => {

  // Class styles
  const inactiveClassSelect = (classes.length == 0 || classes.length == 1);
  const classSelectStyle = cx({
    "reportsAggregateSelect": true,
    "reportsInactiveSelect": inactiveClassSelect,
  });
  const classSelectPrefixStyle = cx({
    "reportsAggregateSelect": !inactiveClassSelect,
    "reportsInactiveSelect": inactiveClassSelect,
  });

  // School styles
  const inactiveSchoolSelect = (schools.length == 0 || schools.length == 1);
  const schoolSelectStyle = cx({
    "reportsAggregateSelect": true,
    "reportsSingleSelect": isAggregateReport,
    "reportsInactiveSelect": inactiveSchoolSelect,
  });
  const schoolSelectPrefixStyle = cx({
    "reportsAggregateSelect": !inactiveSchoolSelect,
    "reportsInactiveSelect": inactiveSchoolSelect,
  });

  // Prepare data for ingestion by select component
  // TODO either eliminate this, or extend this pattern as part of AE-1220
  let formattedSchools = schools.map(school => {
    school.value = school.id;
    return school;
  });

  // TODO, extend global dropdown component to accomodate these styles and get rid of "select"
  return (
    <div className="aggregateMiller">
        <Select
          menuPlacement="auto"
          className={schoolSelectStyle}
          classNamePrefix={schoolSelectPrefixStyle}
          options={schools}
          onMenuOpen={() => onAggregateSchoolMillerOpened()}
          onMenuClose={() => onAggregateSchoolMillerClosed()}
          value={selectedSchool}
          onChange={onSchoolMillerSelection}
        />
        {!isAggregateReport && <Select
          menuPlacement="auto"
          className={classSelectStyle}
          classNamePrefix={classSelectPrefixStyle}
          options={classes}
          value={selectedClass}
          onMenuOpen={() => onAggregateClassMillerOpened()}
          onMenuClose={() => onAggregateClassMillerClosed()}
          onChange={onClassMillerSelection}
        />}
    </div>
  )
}

export default AggregateMiller;