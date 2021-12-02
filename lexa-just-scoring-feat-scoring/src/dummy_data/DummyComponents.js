import React from 'react';

export class DummyAssignment extends React.Component {
  render() {
    return (
      <div className="readerContainer">
        <div className="reader correction paper">
          <div className="header">
            Assignment
          </div>
        </div>
      </div>
    );
  }
}
export class DummySis extends React.Component {
  render() {
    return (
      <div className="readerContainer">
        <div className="reader correction paper">
          <div className="header">
            SIS Page
          </div>
        </div>
      </div>
    );
  }
}
export class DummyPrint extends React.Component {
  render() {
    return (
      <div className="readerContainer">
        <div className="reader correction paper">
          <div className="header">
            Print
          </div>
        </div>
      </div>
    );
  }
}
export class DummyEmail extends React.Component {
  render() {
    return (
      <div className="readerContainer">
        <div className="reader correction paper">
          <div className="header">
            Send Email
          </div>
        </div>
      </div>
    );
  }
}