import React from 'react';
import Phrase from '../Reader/Phrase';
import {assignmentTypes} from '../../constants/constants';

export default class RunningRecord extends React.Component {
  constructor (props){
    super(props);
    this.state = {
      totalSkips: 0,
      totalMispronunciations: 0,
      totalSelfCorrections: 0,
      totalErrors: 0,
    };

    this.calculateTotals = this.calculateTotals.bind(this);
  }

  componentDidMount(){
    this.calculateTotals();
  }

  calculateNumErrors(errors){
    return errors.reduce(((totalErrors, currentError) => currentError ? totalErrors + 1 : totalErrors), 0);
  }

  calculateTotals(){
    let totalErrors = 0;
    this.props.scoredStory.phrases.forEach((phrase, index) => {
      let numErrors = this.calculateNumErrors(this.props.errors[index]);
      totalErrors += numErrors;
    });
    let totalSelfCorrections = this.props.stats.selfCorrections.reduce(((total, value) => value ? total + value : total), 0);
    this.setState({
      totalSelfCorrections: totalSelfCorrections,
      totalErrors: totalErrors,
    });
  }

  setSelfCorrections(newValue, phraseIndex){
    let selfCorrections = this.props.stats.selfCorrections;
    selfCorrections[phraseIndex] = newValue;
    let newStats = this.props.stats;
    newStats.selfCorrections = selfCorrections;
    this.props.setStats(newStats, this.calculateTotals);
  }

  setSkips(newValue, phraseIndex){
    let skips = this.props.stats.skips;
    skips[phraseIndex] = newValue;
    let newStats = this.props.stats;
    newStats.skips = skips;
    this.props.setStats(newStats, this.calculateTotals);
  }

  setMispronunciations(newValue, phraseIndex){
    let mispronunciations = this.props.stats.mispronunciations;
    mispronunciations[phraseIndex] = newValue;
    let newStats = this.props.stats;
    newStats.mispronunciations = mispronunciations;
    this.props.setStats(newStats, this.calculateTotals);
  }

  getPhraseRows(){
    return this.props.scoredStory.phrases.map((phrase, index) => {
      let errors = this.props.errors[index];
      if(errors.length > 0){
        let numErrors = this.calculateNumErrors(errors);
        return(
          <tr key={"row" + index} className="phraseRow">
            <td className="cell">{index + 1}</td>
            <td className="cell text">
              <Phrase
                text={phrase.text}
                final={true}
                errors={errors}
                key={"phrase" + index}
                isCorrection={true}
                setErrors={(errors)=>{this.props.setErrors(errors, index, this.calculateTotals)}}
                config={{}}
                phraseWordStylingEnabled={true}
                styleUnscoredWords={this.props.scoredStory && this.props.scoredStory.type === assignmentTypes.TUTOR}
                flaggedWords={this.props.flaggedWords[index]}
              />
            </td>
            <td className="cell number">{numErrors}</td>
            <td className="cell number">
              <input type='text' className="statInput"
                onChange={(event) => this.setSelfCorrections(parseInt(event.target.value), index)}
                defaultValue={this.props.stats.selfCorrections[index] || 0}
              />
            </td>
            <td className="cell number">
              <input type='text' className="statInput"
                onChange={(event) => this.setSkips(parseInt(event.target.value), index)}
                defaultValue={this.props.stats.skips[index] || 0}
              />
            </td>
            <td className="cell number">
              <input type='text' className="statInput"
                onChange={(event) => this.setMispronunciations(parseInt(event.target.value), index)}
                defaultValue={this.props.stats.mispronunciations[index] || 0}
              />
            </td>
          </tr>
        );
      } else {
        return null;
      }
    });
  }

  render() {
    return (
      <div className="runningRecord">
        <table className="table"><tbody>
          <tr className="tableHeader">
            <div className="leftLabels">
              <th className="label">PAGE</th>
            </div>
            <div className="rightLabels">
              <th className="label">E</th>
              <th className="label">S-C</th>
              <th className="label">SKIP</th>
              <th className="label">M-P</th>
            </div>
          </tr>
          <tr className="bufferRow"/>
          {this.getPhraseRows()}
          <tr>
            <th></th>
            <th className="totalLabel">Totals</th>
            <th className="total">{this.state.totalErrors}</th>
            <th className="total">{this.state.totalSelfCorrections}</th>
          </tr>
        </tbody></table>
      </div>
    );
  }
}
