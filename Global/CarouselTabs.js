import React from 'react';
import cx from 'classnames';
import ProgressBubbles from './ProgressBubbles';
import { tooltipTypes, Tooltip } from './Tooltip';

export default class CarouselTabs extends React.Component {
  constructor (props){
    super(props);

    this.state = {
      selectedTabIndex: this.props.selectedTabIndex || 0,
    }
  }

  render() {
    if(!(this.props.tabs && this.props.tabs.length > 0)){
      return null;
    }

    let tabs = [];
    for(let i = 0; i < this.props.tabs.length; i++){
      let tabData = this.props.tabs[i];
      let tooltip = this.getTitleTooltip(tabData.title);
      let details = [];
      for(let j = 0; j < (tabData.detail ? tabData.detail.length : 0); j++){
        let tabDetail = tabData.detail[j];

        let detailStyles = cx({
         'carouselTabDetail': true,
         'longDetail': tabDetail.length > 14,
        });
        details.push(
          <div className={detailStyles} key={"carouselTabDetail" + j}>
            {tabDetail}
          </div>
        );
      }

      let onTabClick = () => {
        this.setState({
          selectedTabIndex: i,
        });
      }

      let selected = this.state.selectedTabIndex == i;

      let tabStyles = cx({
       'carouselTab': true,
       'selected': selected,
       'longContent': tabData.detail.length >= 3,
      });

      tabs.push(
        <div className={tabStyles} key={"carouselTab" + i} onClick={onTabClick}>
          <div className="carouselTabTitle">{tabData.title}{tooltip}</div>
          {selected && details}
        </div>
      );
    }

    return (
      <div className="carouselTabs">
        {tabs}
        <ProgressBubbles
          selectedIndex={this.state.selectedTabIndex}
          highlightPast={false}
          numBubbles={this.props.tabs && this.props.tabs.length}
          smallBubbles={true}
        />
	      {this.props.tabs[this.state.selectedTabIndex].content}
	    </div>
    );
  }

  getTitleTooltip(title) {
    switch (title) {
      case 'Appropriately Challenging Skills':
        return (
          <Tooltip type={tooltipTypes.appropriatelyChallengingSkills} />
        )
    }
  }
}
