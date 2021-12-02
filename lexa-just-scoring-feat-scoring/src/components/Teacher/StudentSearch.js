// External depedencies
import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Link } from 'react-router-dom';

// Internal dependencies
import { getValidActivitiesForStudents } from "../../services/API";
import { getActivityStatus } from "../../services/displayStatus";
import { sortByStatus, sortActivitiesByDate } from "../../services/util";
import Loading from '../Global/Loading';
import Dropdown from '../Global/Dropdown';
import Toggle from '../Global/Toggle';
import creators from '../Reports/state/roster/creators';
import { dropdownTypes } from '../Reports/values/enums';
import {assignmentTypes} from '../../constants/constants';
import { getMostRecentEquating, setMostRecentEquating, getMostRecentShowAssessments, setMostRecentShowAssessments } from '../../services/teacher/recentTeacherSelections';
import ClassWithNoStudents from './ErrorMessages/ClassWithNoStudents';
import { educatorSupportHelpLinks } from '../../constants/helpLinks';

const NoActivitiesBox = () => (
  <div className="teacherNoStudentsNotice">
    <div>There are currently no activities to display for this class.</div>
    <div>After your students have sufficient practice with Amira, assign the benchmark assessment <Link className="noActivityLink" to={`/teacher/reports/type/tracking`}>here</Link>.</div>
    <div>
      We recommend students read at least 5-10 stories with Amira in the default practice mode before taking an assessment.
      For more information, see <a className="noActivityLink" href={educatorSupportHelpLinks.studentPracticeExperience} target="_blank">The Student Practice Experience</a> (password: “ILoveReading”).
    </div>
  </div>
);

function ActivityCard({ activities, parentOnClick }) {

  let onClick = (activityId, status) => {
    if(status.ready){
      parentOnClick(activityId);
    }
  }

  let getActivityType = (activity) => {
    switch(activity.type){
      case(assignmentTypes.TUTOR):
        return "PRACTICE";
        break;
      case(assignmentTypes.ASSESSMENT):
        return "ASSESSMENT";
        break;
      default:
        return "";
        break;
    }
  }

  let sortedActivities = sortByStatus(activities, true);

  return sortedActivities.map((activity) => {
    let status = getActivityStatus(activity);
    let cardClasses = cx({
      'activityCard': true,
      'clickable': status.ready,
      'error': status.needsAttention,
      'disabled': !status.ready,
      'started': status.started,
    });
    return(
      <div key={`activity${activity.activityId}`} className={cardClasses} onClick={() => onClick(activity.activityId, status)}>
        <div className="activityDetails">
          <div className="label">{activity && activity.student && activity.student.ui && activity.student.ui.label}</div>
          <div className="date">{new Date(activity.updatedAt || activity.createdAt).toLocaleDateString("en-US")}</div>
          <div className="type">{getActivityType(activity)}</div>
        </div>
        <div className="subtext">{status.error}</div>
        <div className="score">
          {activity.scores && status.ready ? Math.round(activity.scores.wcpmScore) : " "}
          {(activity.scores && status.ready) &&
            <span className="units">WCPM</span>
          }
          <div className="status">{status.label}</div>
        </div>
      </div>
    );
  });
}

class StudentSearch extends React.PureComponent {
  constructor(props) {
    super(props);

    let cachedShowAssessmentsSelection = getMostRecentShowAssessments();
    if(cachedShowAssessmentsSelection == null){
      cachedShowAssessmentsSelection = true;
    }

    let cachedEquatingSelection = getMostRecentEquating();
    if(cachedEquatingSelection == null) {
      cachedEquatingSelection = true;
    }

    this.state = {
      activities: null,
      loading: true,
      showAssessments: cachedShowAssessmentsSelection,
      equatedScores: cachedEquatingSelection,
    };
  }

  componentDidMount(){
    //Fetch the classrooms to populate the Dropdown
    this.props.initializeRoster();
  }

  componentDidUpdate(prevProps, prevState){
    if(this.props.status !== 'PENDING' && !this.props.selectedClass && this.props.classrooms && this.props.classrooms.length > 0){
      //Select the first classroom
      this.props.rosterSelect({
        type: 'classroom',
        data: this.props.selectedClass || this.props.classrooms[0].ui,
      });
    } else if(!this.state.activities && this.props.selectedClass || (prevProps.selectedClass && prevProps.selectedClass.value) != (this.props.selectedClass && this.props.selectedClass.value) && this.props.students && prevProps.students != this.props.students){
      //Fetch students if we have selected a classroom
      this.fetchActivities(this.state.showAssessments, this.state.equatedScores);
    }else{
      if((this.props.status !== 'PENDING')&&(this.props.classrooms.length === 0)){
        this.setState({activities: null, loading: false});//TODO: Find a better way to do this
      }
    }
  }

  fetchActivities(showAssessments, equatedScores){
    getValidActivitiesForStudents(
      this.props.students, //list of student ids
      1, // limit one activity  per student
      showAssessments ? [assignmentTypes.ASSESSMENT] : [assignmentTypes.TUTOR], //array of activity types to fetch
      this.state.equatedScores // whether or not to fetch equated WCPM scores
    ).then((activities) => {
        if(showAssessments == this.state.showAssessments && equatedScores == this.state.equatedScores){
          activities.length > 0 ? this.setState({activities, loading: false}) : this.setState({activities: null, loading: false});
        }
      })
      .catch((err) => this.setState({activities: null, loading: false}));//TODO: Find a better way to do this
  }

  toggleActivityType(){
    let showAssessments = !this.state.showAssessments;
    setMostRecentShowAssessments(showAssessments);
    this.setState({
      showAssessments: showAssessments,
      loading: true,
    }, () => this.fetchActivities(this.state.showAssessments, this.state.equatedScores));
  }

  toggleEquating(){
    let equatedScores = !this.state.equatedScores;
    // cache the selection
    setMostRecentEquating(equatedScores);
    this.setState({
      equatedScores,
      loading: true,
    }, () => this.fetchActivities(this.state.showAssessments, this.state.equatedScores));
  }

  handleChange(data){
    //if we selected the same class twice in a row, do nothing
    if((this.props.selectedClass && this.props.selectedClass.value) == data.value){
      return;
    }
    const select = () => {
      this.props.rosterSelect({
        type: 'classroom',//type of selection
        data,
      });
    };
    this.setState({
      activities: [],
      loading: true,
    }, select);
  }

  renderActivities() {
    const { students } = this.props;
    if(this.state.loading){
      return <Loading />;
    } else if(this.state.activities && this.state.activities.length > 0) {
      return (
        <ActivityCard
          activities={sortActivitiesByDate(this.state.activities)}
          parentOnClick={(id) => this.props.history.push("/teacher/gradebook/scoring/" + id)}
        />
      );
    } else if (!students || (Array.isArray(students) && students.length == 0)) {
      return <ClassWithNoStudents />;
    }else {
      return <NoActivitiesBox />;
    }
  }

  render(){
    // TODO: move some reader styles to paper and move paper to a different file
    // TODO: Notify user when Graphql query fails or when there are no Activities ready to score.
    return (
      <div className="studentSearch">
        <div className="header">
          <div className="studentSearchHeader">Select a Recent Activity to Review</div>
          <div className="controls">
            {this.props.classrooms &&
              <Dropdown
                placeholder="Select Classroom"
                value={this.props.selectedClass}
                options={this.props.classrooms.map(classroom => classroom.ui)}
                onChange={(data) => this.handleChange(data)}
                type={dropdownTypes.PRIMARY}
              />
            }
            <Toggle
              onToggle={this.toggleActivityType.bind(this)}
              leftOptionName="Assessment"
              rightOptionName="Practice"
              left={this.state.showAssessments}
              className="activityTypeToggle"
            />
            <Toggle
              onToggle={this.toggleEquating.bind(this)}
              leftOptionName="Adjusted"
              rightOptionName="Unadjusted"
              left={this.state.equatedScores}
              className="equatingToggle"
            />
          </div>
        </div>
        <div className="activityContainer">
          {this.renderActivities()}
        </div>
      </div>
    );
  }
}

StudentSearch.defaultProps = {
  classrooms: [],
  students: [],
  status: '',
}

const mapStateToProps = ({ reports }) => {
  const { roster } = reports;

  return {
    classrooms: roster.data ? roster.data.classroom : [],
    students: roster.data ? roster.data.student : [],
    status: roster.status ? roster.status.type : null,
    selectedClass: roster.ui ? roster.ui.selections.classroom : null,
  };
};

const mapDispatchToProps = (dispatch) => ({
  rosterSelect: (selection) => dispatch(creators.rosterSelect(selection)),
  initializeRoster: () => dispatch(creators.initializeRoster()),
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentSearch);