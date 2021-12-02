// External Dependencies
import React from 'react';
import amiraLogo from '../../images/AmiraLogo.svg'
import FaSignOut from 'react-icons/lib/fa/sign-out';

// Internal Dependencies
import { getUserData, endUserSession } from '../../services/API';
import { userTypes } from '../../constants/constants';

export default class GlobalNav extends React.Component {
  constructor (props){
    super(props);

    this.menuOptions = [
      {value: 'SCORING', label: 'Review Activity', route: '/teacher/gradebook/activities', identifier: 'gradebook'},
    ];

    // if admin, add the admin page
    if(getUserData().userType == userTypes.SCHOOL_ADMIN || getUserData().userType == userTypes.DISTRICT_ADMIN) {
      //TODO - re-enable this when admins can run reports: this.menuOptions.unshift({value: 'ADMIN', label: 'Admin', route: '/admin', identifier: 'admin'});
      this.menuOptions = [];
    }

    this.goHome = this.goHome.bind(this);
    this.logOut = this.logOut.bind(this);
    this.goHome();
  }

  getButtonClick(menuOption){
    return () => {this.props.history.push(menuOption.route)};
  }

  goHome(){
    this.props.history.push("/teacher/gradebook/activities");
  }

  logOut(){
    endUserSession();
  }

  // determine whether a menu item is active by comparing to the current URL
  // TODO: implement a better solution
  isActive(menuOption){
    return this.props.location.pathname.includes(menuOption.identifier);
  }

  render() {
    return (
      <div className="globalNav">
        <div className="navButtonContainer">
          <span className="home" onClick={this.goHome}><img src={amiraLogo} /></span>
          <div className="rightButtons">
            {this.menuOptions.map((opt) => {
              let className = "navButton" + (this.isActive(opt) ? " active" : "");
              return (<span key={opt.value} className={className} onClick={this.getButtonClick(opt)}> {opt.label} </span>);
            })}
            <span className="navButton logoutButton" onClick={this.logOut}><FaSignOut className="logoutIcon" size="20" /> Log Out</span>
          </div>
        </div>
      </div>
    );
  }
}
