import React from 'react';

export default class Header extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    //Only show this banner on the Login Screen
    if(this.props.authState == 'signedIn'){
      return null;
    }

    return (
      <header className="amiraBanner">
        <h1 className="brand">AMIRA</h1>
      </header>
    );
  }
}