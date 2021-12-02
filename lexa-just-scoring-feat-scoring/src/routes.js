import StudentSearch from './components/Teacher/StudentSearch';
import ReportingPortal from './components/Reports/index';
import CorrectionManager from './components/Teacher/CorrectionManager';
import Resources from './components/Teacher/Resources';
import config from './config';
import category from './routesCategory';

/*
***************************** ROUTES ********************************************
**
** const category:
** Think of category as the views/pages of our app organized by userType.
**
** const routeStore:
** The routeStore object contains all the possible routes of the App.
** Routes are organized by user type, so we have routeStore.student
** for userType student and we have routeStore.teacher for teachers.
**
** Each userType has a DEFAULT route that will be used to redirect our 404's match
** and the IntentManager to redirect to our Home Page via ChatBot.
**
** We have a routes property containing an array of Route objects with all the properties
** necessary to create a route + any other property that you wish to pass to the component
** being rendered in that Route.
**
** Each Route object contains a category that's used to match Intent Names with our Views/Categories
**
** --- Receiving Params from ChatBot ---
**
** If a certain path/route uses URL parameters, we need to create a
** matchRouteWithSlots({...expected_params_from_chatBot}) method to do the mapping
** of the ChatBot's parameters with our Route's Parameter.
**
** e.g.:
{
  //Rest of the route properties (category, path, component...)
  matchRouteWithSlots: function({activityId='1F8783C4D2ED11E89543168CA1AFEB4A'}){
    return this.path.replace(':activityId', activityId);
  },
}
** In this example we're expecting the answer from the ChatBot to contain an "activityId" property, if for any
** reason this property is coming back as chatBot_activity_id then we would have to change our code to be:
{
  //Rest of the route properties (category, path, component...)
  matchRouteWithSlots: function({chatBot_activity_id='1F8783C4D2ED11E89543168CA1AFEB4A'}){
    return getCleanPath(this.path).replace(':activityId', chatBot_activity_id);
  },
}
** --- IMPORTANT ---
**
** make sure to include the : when replacing a parameter with the desired value
    getCleanPath(this.path).replace(':activityId', chatBot_activity_id);
    //-----------------------------> ^
*/

export const routeStore = {
  teacher: {
    DEFAULT: '/teacher/gradebook/activities',
    routes: [
      {
        category: category.teacher.ACTIVITIES,
        path: '/teacher/gradebook/activities',
        component: StudentSearch,
        config: config.studentSearch,
      },
      {
        category: category.teacher.REPORTS,
        path: '/teacher/reports/type/:report',
        component: ReportingPortal,
        config: config.teacher,
        exact: true,
      },
      {
        category: category.teacher.REPORTS,
        path: '/teacher/reports',
        component: ReportingPortal,
        config: config.teacher,
        exact: true,
      },
      {
        //category: category.teacher.GRADEBOOK, TODO: Add the relevant Category when we have an Intent for this route
        path: '/teacher/gradebook/scoring/:activityId',
        component: CorrectionManager,
        config: config.teacher,
        //TODO: Implement matchRouteWithSlots
        //matchRouteWithSlots: function({activityId='1F8783C4D2ED11E89543168CA1AFEB4A'}){
          //activityId variable should match the name of the property sent from chatBot under slots
          //Inserting some dummy data as default to be safe
          //return this.path.replace(':activityId', activityId);
        //},
      },
      {
        category: category.teacher.DIAGNOSTIC,
        path: '/teacher/resources',
        component: Resources,
        config: config.teacher,
        exact: true,
      },
      /*{
        category: category.teacher.REPORTS,
        path: '/teacher/reports/:reportType/:reportId',
        component: ReportingPortal,
        config: config.teacher,
        matchRouteWithSlots: function({reportType='benchmark', reportId='12345'}){
          //reportType and reportId variables should match the name of the properties sent from chatBot under slots
          //Inserting some dummy data as default to be safe
          return this.path.replace(':reportType', reportType).replace(':reportId', reportId);
        },
      },*/
    ],
  },
  student: {
    DEFAULT: '/student/home',
    routes: [
      {
        category: category.student.STUDENTHOME,
        path: '/student/home',
        //Rendered on App.js
        config: config.studentHome,
      },
      {
        category: category.student.TUTOR,
        path: '/student/tutor',
        //Rendered on App.js
        config: config.student,
      },
      {
        category: category.student.TUTOR,
        path: '/student/test',
        //Rendered on App.js
        config: config.studentTest,
      },
      {
        category: category.student.ASSESSMENT,
        path: '/student/assessment',
        //Rendered on App.js
        config: config.assessment,
      },

      {
        category: category.teacher.GRADEBOOK,
        path: '/teacher/scoring/:activityId',
        component: CorrectionManager,
        config: config.teacher,
        matchRouteWithSlots: function({activityId='1F8783C4D2ED11E89543168CA1AFEB4A'}){
          //activityId variable should match the name of the property sent from chatBot under slots
          //Inserting some dummy data as default to be safe
          return this.path.replace(':activityId', activityId);
        },
      },
    ],
  },
};