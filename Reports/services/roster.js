import roster from '../_test/data/roster';
import {getUserData, magicGradeToAmiraGrade} from '../../../services/API';
import { userTypes } from '../../../constants/constants';

/******************************************
* !!!!!!!!!!!!!!!!!!
* TODO: move the rest of these SIS calls from Reports/services/roster.js into StudentInformationService.js with the rest of the services, and refactor accordingly
* !!!!!!!!!!!!!!!!!!
*******************************************/

const fetches = {
  district: () => (getDistrict()),
  school: () => (getSchoolsForUser()), // Keyed off of auth
  classroom: (schoolId) => (getClassesForTeacher(schoolId)),
  student: (classroomId) => (getStudentsForClass(classroomId)),
}

export const fetchRoster = (type, id) => {
  return fetches[type](id);
}

export default {
  fetchRoster,
}

// Get district
// Note: this function is adapted from getSchoolsForUser() in order to support the
// interface specified at the top of this file. We should refactor in three steps:
// 1. re-evaluate the necessity of this function, refactor this service's interface
// 2. cache results locally to avoid unecessary API calls
// 3. consolidate backend so that only one call is necessary
function getDistrict() {
  let outObject = {};
  if(getUserData().district) {
    outObject.id = getUserData().district.id;
    outObject.label = getUserData().district.label;
  } else {
    outObject.id = "";
    outObject.label = "";
    console.log("ERROR: undefined district id/label");
  }
  let outArray = [outObject];
  return Promise.resolve(outArray);
}

function getSchoolsForUser(){
  // First, see if we already have schools for this user
  if(getUserData().userType == userTypes.DISTRICT_ADMIN || getUserData().userType == userTypes.SCHOOL_ADMIN || getUserData().schools.length > 0) {
    let formattedSchools = getUserData().schools.map(school => {
      return {
        id: school.id,
        label: school.label
      }
    });
    return Promise.resolve(formattedSchools);
  }

  // If not, directly fetch schools for user
  // TODO fully deprecate this codeblock once we verify it never executes
  // This code executes when we get inconsistent results for userData
  let userId = getUserData().userId;
  return getUserNameByUserId(userId)
  .then(userName => {
    const url = "https://api.getmagicbox.com/services//user/v1.0/"+userName+"?token=11b2d93f06ac11e9a2d10a2dfa68e30a";
    return fetch(url,{method: "GET"})
    .then((resp) => resp.json())
    .then(function(resp){
      let schoolId = resp.data.schoolId;
      const schoolUrl = "https://api.getmagicbox.com/services//school/v1.0/"+schoolId+"?token=11b2d93f06ac11e9a2d10a2dfa68e30a";
      return fetch(schoolUrl,{method: "GET"})
      .then((resp) => resp.json())
      .then(function(resp){
        let outObject = {};
        outObject.id = resp.data.schoolId;
        outObject.label = resp.data.schoolName;
        let outArray = [outObject];
        return Promise.resolve(outArray);
      });
    });
  })
  .catch(err => console.log("ERROR IN MAGIC getting schools:",err));
}

function getClassesForTeacherHMH(schoolId){
  //If this is a sideloaded admin, just return a dummy value. TODO: remove this when we have admin types who can see classes, etc.
  if(getUserData().sideloadedUser && ((getUserData().userType == userTypes.DISTRICT_ADMIN) || (getUserData().userType == userTypes.SCHOOL_ADMIN))){
    return Promise.resolve([{id: 1234, label: "Class"}]);
  }

  let userId = getUserData().userId;
  let correlationid = getUserData().correlationid;
  let url = process.env.SSO_BASE_URL+"/teacher/"+userId+"/classes";
  let reqHeaders = {
    'x-api-key': process.env.SSO_API_KEY,
  };
  if(correlationid) reqHeaders.correlationid = correlationid;
  return fetch(url,{
    method: "GET",
    headers: reqHeaders
  })
  .then((resp)=>resp.json())
  .then((resp)=>{
    let classes = resp.map((aClass)=>{
      return {id: aClass.id, label: aClass.name};
    });
    return Promise.resolve(classes);
  });
}

function getClassesForTeacher(schoolId){
  if(getUserData().skipMagic){
    return getClassesForTeacherHMH(schoolId);
  }else{
    let userId = getUserData().userId;
    return getUserNameByUserId(userId)
    .then(userName => {
      let url = "https://api.getmagicbox.com/services//school/v1.0/teacher/class/"+userName+"?token=11b2d93f06ac11e9a2d10a2dfa68e30a";
      if(getUserData().userType == userTypes.DISTRICT_ADMIN || getUserData().userType == userTypes.SCHOOL_ADMIN ) {
        // If this is an admin, use a different, schoolId dependent, API call, using schoolId as the school's "name"
        let schoolName = schoolId;
        url = "https://api.getmagicbox.com/services//school/v1.0/school/"+schoolName+"/classes?token=11b2d93f06ac11e9a2d10a2dfa68e30a";
      }
      return fetch(url,{method: "GET"})
      .then((resp) => resp.json())
      .then(function(resp){
        let outArray = [];
        if(getUserData().userType == userTypes.DISTRICT_ADMIN || getUserData().userType == userTypes.SCHOOL_ADMIN ) {
          let classData = resp.data.classList;
          for(let i = 0; i < classData.length; i++){
            outArray.push({id: classData[i].classId, label: classData[i].className});
          }
        } else {
          for(let i = 0; i < resp.data.length; i++) {
            outArray.push({id: resp.data[i].classid, label: resp.data[i].classname});
          }
        }
        return Promise.resolve(outArray);
      })
    })
    .catch(err => console.log("ERROR IN MAGIC GETTING CLASSES:",err));
  }
}

function getStudentsForClassHMH(classId){
  //If this is a sideloaded admin, just return a dummy value. TODO: remove this when we have admin types who can see classes, etc.
  if(getUserData().sideloadedUser && ((getUserData().userType == userTypes.DISTRICT_ADMIN) || (getUserData().userType == userTypes.SCHOOL_ADMIN))){
    return Promise.resolve([{first_name: "Placeholder",last_name: "Student",id: 1234,grade:0}])
  }
  const url = process.env.SSO_BASE_URL+"/classes/" + classId + "/students";
  let correlationid = getUserData().correlationid;
  let reqHeaders = {
    'x-api-key': process.env.SSO_API_KEY,
  };
  if(correlationid) reqHeaders.correlationid = correlationid;
  return fetch(url,{
    method: "GET",
    headers: reqHeaders
  })
  .then((resp) => resp.json())
  .then((resp)=>{
    let students = resp.map((student)=>{
      return({
        first_name: student.givenName,
        last_name: student.familyName,
        id: student.userId,
        grade: parseInt(student.grade),
      })
    })
    return Promise.resolve(students);
  });

}

function getStudentsForClass(classId){
  if(getUserData().skipMagic){
    return getStudentsForClassHMH(classId)
  }else{
    let userId = getUserData().userId;
    return getUserNameByUserId(userId)
    .then(username=>{
      const url = "https://api.getmagicbox.com/services//user/v1.0/teachers/" + username + "/students?limit=1000&token=11b2d93f06ac11e9a2d10a2dfa68e30a";
      return fetch(url,{method: "GET"})
      .then((resp) => resp.json())
      .then(function(resp){
        let classlist = filterStudentsByClass(resp.data,classId);
        return Promise.resolve(classlist);
      });
    })
    .catch(err => console.log("ERROR IN MAGIC GETTNG STUDENT:",err));
  }
}

function getUserNameByUserId(userId){
  const url = "https://api.getmagicbox.com/services//user/v1.0/user/" + userId + "?token=11b2d93f06ac11e9a2d10a2dfa68e30a";
  return fetch(url,{method: "GET"})
  .then((resp) => resp.json())
  .then(function(resp){
    return Promise.resolve(resp.data.UserName);
  })
  .catch(err => console.log("ERROR IN MAGIC GETTING USERNAME:",err));
}

function filterStudentsByClass(studentList,classId){
  const result = [];
  for (const item of studentList) {
      if(item.classes[0].classid === classId){
        let student = {};
        student.id = item.guid;
        student.first_name = item.firstname;
        student.last_name = item.lastname;
        student.school = item.schoolId;
        student.classroom = classId;
        student.grade = magicGradeToAmiraGrade(item.grades[0]);
        result.push(student);
      }
  }
  return result;
}