import React from 'react';
import Select from 'react-select';
import cx from 'classnames';
import { dropdownTypes } from '../Reports/values/enums'

// TODO extend this component to support both primary and secondary selection styles
class Dropdown extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    let primaryDropdown = false;
    if(this.props.type === dropdownTypes.PRIMARY) {
      primaryDropdown = true;
    }

    const dropdownStyle = cx({
      "teacherDisabledSelect": this.props.isDisabled,
      "teacherSecondarySelect": !primaryDropdown,
      "teacherPrimarySelect": primaryDropdown,
    });

    const dropdownPrefixStyle = cx({
      "teacherDisabledSelect": this.props.isDisabled,
      "teacherSecondarySelect": !this.props.isDisabled && !primaryDropdown,
      "teacherPrimarySelect": !this.props.isDisabled && primaryDropdown,
    });

    return (
      <Select
        menuPlacement="auto"
        isSearchable={false}
        className={dropdownStyle}
        classNamePrefix={dropdownPrefixStyle}
        value={this.props.value}
        onChange={this.props.onChange}
        options={this.props.options}
        placeholder={this.props.placeholder}
      />
    );
  }
}

Dropdown.defaultProps = {
  type: dropdownTypes.SECONDARY,
  placeholder: '',
  isDisabled: false,
  value: null,
  options: [],
}

export default Dropdown;