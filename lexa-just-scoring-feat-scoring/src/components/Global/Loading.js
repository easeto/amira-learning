import React from 'react';

export default class Loading extends React.Component {
  render() {
    //This is a css loading icon from https://loading.io/css/
    // making this a global component so that we can use it throughout the app
    let loadingContainerClass = this.props.noFill ? "loadingContainer" : "loadingContainer fill";
    return (
      <div className={loadingContainerClass}><div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>
    );
  }
}
