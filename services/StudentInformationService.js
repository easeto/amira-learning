import { userTypes } from "../constants/constants";
import {formatGuidForSIS} from './util';
const request = require('superagent');

const GET_STUDENT = `
  query getStudent($id: ID!) {
    student(user_id: $id){
      first_name
      last_name
      grade
      metadata{
        esl
        early_reader
        tutorEnabled
        assessmentEnabled
        screenerEnabled
      }
    }
  }`;

const UPDATE_STUDENT_METADATA = `
  mutation UpdateStudentMetadata($id: ID!, $esl: Boolean, $early_reader: Boolean) {
    updateStudentMetadata(user_id: $id, esl: $esl, early_reader: $early_reader) {
      esl
      early_reader
    }
  }`;

const UPDATE_STUDENT = `
mutation UpdateStudent($id: ID!, $metadata: StudentMetadata) {
  updateStudent(user_id: $id, metadata: $metadata) {
    user_id,
    metadata{
      esl
      early_reader
    }
  }
}`

export default {
  //TODO: move the rest of the SIS calls from Reports/services/roster.js into this file and refactor accordingly
  async getUserInfoByUserId(userId){
    let formattedUserId = formatGuidForSIS(userId);
    const url = "https://api.getmagicbox.com/services//user/v1.0/user/" + formattedUserId + "?token=11b2d93f06ac11e9a2d10a2dfa68e30a";
    return fetch(url,{method: "GET"})
    .then((resp) => resp.json())
    .then(function(resp){
      return Promise.resolve(resp.data);
    })
    .catch(err => Promise.reject(err));
  },
  async getDistrictAndSchoolsByUserName(userName){
    const url = "https://api.getmagicbox.com/services//user/v1.0/userdetails/" + userName + "?token=11b2d93f06ac11e9a2d10a2dfa68e30a";
    return fetch(url,{method: "GET"})
    .then((resp) => resp.json())
    .then(function(resp){
      if(resp.data.userType === userTypes.DISTRICT_ADMIN){
        const getSchoolsUrl = "https://api.getmagicbox.com/services//districts/v1.0/" + resp.data.schoolId + "/schools?token=11b2d93f06ac11e9a2d10a2dfa68e30a";
        return fetch(getSchoolsUrl,{method: "GET"})
        .then((school) => school.json())
        .then(function(schools){
          let returnSchools = schools.data.map((item)=>{
            return({label: item.schoolName, id: item.schoolId});
          });
          let returnDistrict = {label: schools.districtName, id: resp.data.schoolId};
          return Promise.resolve({schools: returnSchools, district: returnDistrict});
        })
        .catch((err)=>Promise.reject(err));
      }else{
        const userSchoolID = (resp.data.userType === userTypes.SCHOOL_ADMIN) ? resp.data.school.schoolId  : resp.data.schoolId;
        const getSchoolUrl =  "https://api.getmagicbox.com/services//school/v1.0/" + userSchoolID + "?token=11b2d93f06ac11e9a2d10a2dfa68e30a";
        return fetch(getSchoolUrl,{method: "GET"})
        .then((school) => school.json())
        .then(function(schools){
          const returnSchool = {
            label: schools.data.schoolName,
            id: schools.data.schoolId,
          };
          const returnDistrict = {
            label: schools.data.districtInfo[0].districtname,
            id: schools.data.districtInfo[0].districtId,
          }
          return Promise.resolve({schools: [returnSchool], district: returnDistrict});
        })
        .catch((err)=>Promise.reject(err));
      }
    })
    .catch(err => Promise.reject(err));
  },
  async getSchoolsAndDistricts(userData,authData,userName,userId,isSSO){
    if(isSSO && userData.attributes['custom:sisId']){
      //SSO users get the school and district IDs passed on the command line
      return Promise.resolve({schools: [{id: authData.attributes.schoolId}],district: {id: authData.attributes.districtId}});
    }else{
      if(userData.attributes['custom:sisId']){
        //Non-SSO (Magic) users will have a sisId attribute in the Cognito user
        return(this.getDistrictAndSchoolsByUserName(userName));
      }else{
        //If non-SSO and not Magic, get the information from our Cloud Directory API
        let url = process.env.SSO_BASE_URL+"/sis/admin/"+userId+"/district";
        let reqHeaders = {
          'x-api-key': process.env.SSO_API_KEY,
        };
        return fetch(url,{
          method: "GET",
          headers: reqHeaders
        })
        .then((resp)=>resp.json())
        .then((resp)=>{
          let schools = resp.schools.map((school)=>{
            return {id: parseInt(school.schoolId),label: school.schoolName};
          });
          console.log(JSON.stringify(schools));
          let returnObject = {
            schools: schools,
            district: {id: parseInt(resp.districtId), label: resp.districtName}
          };

          return Promise.resolve(returnObject);
        });
      }
    }
  },
  async getStudentInfo(studentId){
    const payload = {query: GET_STUDENT, variables: {id: formatGuidForSIS(studentId)}};
    const resp = await request.post(process.env.SIS_BASE_URL)
        .set('x-api-key', process.env.SIS_API_KEY)
        .set('Content-Type', 'application/json')
        .send(payload);
    const { body } = resp;

    if (body.errors) {
      console.log(body.errors)
      throw new Error(body.errors[0].message);
    }
    return body.data["student"];
  },
  async updateStudentMetadata(studentId, metadata) {
    const payload = {query: UPDATE_STUDENT_METADATA, variables: {id: formatGuidForSIS(studentId), ...metadata}};
    const resp = await request.post(process.env.SIS_BASE_URL)
        .set('x-api-key', process.env.SIS_API_KEY)
        .set('Content-Type', 'application/json')
        .send(payload);
    const { body } = resp;

    if (body.errors) {
      console.log(body.errors)
      throw new Error(body.errors[0].message);
    }
    return body.data["student"];
  },
};