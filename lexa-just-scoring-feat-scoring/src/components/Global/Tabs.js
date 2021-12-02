import React from 'react';
import { hasTimedOut } from '../../services/teacher/recentTeacherSelections';
export default class Tabs extends React.Component {
  constructor (props){
    super(props);

    this.state = {
      selectedTab: 0,
    };
  }

  componentDidMount() {
    //TODO: this doesn't belong here. Tabs is a generic component. 
    //  This caching code needs to be moved to Diagnostic Report specific code
    //  AE-3440 is the cleanup ticket
    let cachedTab = sessionStorage.getItem('diagnosticActiveTab');
    if(cachedTab && !hasTimedOut(cachedTab, 'diagnosticActiveTab')) {
      let defaultTab = JSON.parse(cachedTab).selectedTab;
      if(this.props.tabs && this.props.tabs.length > defaultTab) {
        this.setState({
          selectedTab: defaultTab,
        });
      }
    }
  }

  onTabClick(tabId){
    this.setState({
      selectedTab: tabId,
    });


    //TODO: this doesn't belong here. Tabs is a generic component. 
    //  This caching code needs to be moved to Diagnostic Report specific code
    //  AE-3440 is the cleanup ticket
    // cache tab across sessions / across component mounts
    sessionStorage.setItem('diagnosticActiveTab', JSON.stringify({ // selectionType as key
      timestamp: new Date(),
      selectedTab: tabId,
    }));
  }

  getTabs(){
    let tabs = [];
    let content = [];
    for(let i = 0; i < this.props.tabs.length; i++){
      let tabContent = this.props.tabs[i];
      let className = "tab";
      let contentClassName = "tabContent";
      let onClick = this.onTabClick.bind(this, i);
      if(i == this.state.selectedTab){
        className += " selected";
        contentClassName += " display";
      }
      if(this.props.scrollable){
        contentClassName += " scrollable";
      }
      if(!tabContent.content){
        className += " disabled";
        onClick = null;
      }
      tabContent.content && content.push(
        <div className={contentClassName} key={"content" + i}>
          <div className="printTitle">{tabContent.tab}</div>
          {tabContent.content}
        </div>
      );
      tabs.push(
        <div className={className} key={"tab" + i} onClick={onClick}>
          {tabContent.tab}
        </div>
      );
    }
    return({
      tabs: tabs,
      content: content,
    });
  }


  render() {
    let tabs = this.getTabs();
    return (
      <div className="tabs">
        <div className="tabHeader">
          {tabs.tabs}
        </div>
        {tabs.content}
      </div>
    );
  }
}

