import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import cx from 'classnames';


class CurrentSelectionMiller extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openedStudentPicker: false,
      openedClassPicker: false,
    }
    this.selectStudentChild = React.createRef();
    this.selectClassChild = React.createRef();
    this.handlePrimarySelection = this.handlePrimarySelection.bind(this);
  }

  componentDidMount() {
    if(this.selectStudentChild.current && !this.props.selection) {
      this.selectStudentChild.current.focus();
    }
  }

  componentDidUpdate(prevProps) {
    // TODO will need to revisit this when implementing school picker
    if(this.selectStudentChild.current) {
      if(this.props.rosterStatus == "PENDING" && !this.props.isAggregateReport && !this.props.selection) {
        this.selectStudentChild.current.focus();
      } else if(!this.state.openedStudentPicker || (!prevProps.selection && this.props.selection)) {
        this.selectStudentChild.current.blur();
      }
    }
  }

  handlePrimarySelection(data) {
    this.props.onMillerSelection(data);
    this.setState({
      openedStudentPicker: false,
    });
  }

  onStudentPickerFocused() {
    this.setState({
      openedStudentPicker: true,
    });
  }

  onStudentPickerBlurred() {
    this.setState({
      openedStudentPicker: false,
    });
  }

  onClassPickerOpened(){
    this.setState({
      openedClassPicker: true,
    });
  }

  onClassPickerClosed(){
    this.setState({
      openedClassPicker: false,
    });
    if(this.selectClassChild.current) {
      this.selectClassChild.current.blur();
    }
  }

  render() {

    // Set whether the primary picker is open
    let openedPicker = false;
    if(!this.props.isAggregateReport && (!this.props.selection || this.state.openedStudentPicker) && this.props.options.length > 0) {
      openedPicker = true;
    } else if (this.props.isAggregateReport && this.state.openedClassPicker) {
      openedPicker = true;
    }
    if(this.props.aggregateMillerIsOpen) {
      openedPicker = false;
    }

    // Apply the correct style
    let primaryPickerPrefixStyle = cx({
      "reportsPrimaryDisabledSelect": this.props.aggregateMillerIsOpen || !this.props.options || this.props.options.length == 0,
      "reports-current-select": !openedPicker && !this.props.aggregateMillerIsOpen && this.props.options && (this.props.options.length > 0),
      "reportsPrimaryPickerOpenPrefix": openedPicker,
    });

    // Generate the right placeholder
    let placeholder = "Type or select a student";
    if(!this.props.options || this.props.options.length == 0) {
      placeholder = "No students available";
    }

    // TODO deprecate this, or adapt it as our definitive strategy as part of
    // https://amiralearning.atlassian.net/jira/software/projects/AE/boards/6/backlog?assignee=5c1d1603e186550b0adf5f4b&selectedIssue=AE-1220
    let options = this.props.options;
    let selection = this.props.selection;
    if(this.props.options[0] && !this.props.options[0].value) {
      options = this.props.options.map(option => {
        option.value = option.ui.value;
        return option;
      });
      selection.value = selection.ui.value;
    }
    // TODO replace menu component
    // https://react-select.com/props#replacing-components
    return (
      <div className="reports-student-miller">
          { this.props.isAggregateReport &&
          <Select
            menuPlacement="auto"
            className="reports-current-select"
            classNamePrefix={primaryPickerPrefixStyle}
            options={options}
            value={selection}
            onChange={this.handlePrimarySelection}
            onMenuOpen={() => this.onClassPickerOpened()}
            onMenuClose={() => this.onClassPickerClosed()}
            ref={this.selectClassChild}
          />}
          { !this.props.isAggregateReport &&
          <Select
            menuPlacement="auto"
            className="reports-current-select"
            classNamePrefix={primaryPickerPrefixStyle}
            options={this.props.options}
            value={this.props.selection}
            placeholder={placeholder}
            onChange={this.handlePrimarySelection}
            ref={this.selectStudentChild}
            menuIsOpen={openedPicker}
            onFocus={() => this.onStudentPickerFocused()}
            onBlur={() => this.onStudentPickerBlurred()}
          />}
      </div>
    )
  }
}

// TODO define proptypes
// CurrentSelectionMiller.propTypes = {
//   isAggregateReport,
//   options,
//   onMillerSelection,
//   selectedClass,
//   rosterStatus,
// }

export default CurrentSelectionMiller;