import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { saveUserData, getUserData, clearUserData, endUserSession, message_broadcast, message_receive} from '../services/API';
import { userTypes} from '../constants/constants';
import { Authenticator, ConfirmSignIn, VerifyContact } from 'aws-amplify-react';
import App from '../components/App';
import AmiraSignUp from '../components/Login/AmiraSignUp';
import AmiraSignIn, {AmiraAuthenticator} from '../components/Login/AmiraSignIn';
import AmiraConfirmSignUp from '../components/Login/AmiraConfirmSignUp';
import AmiraForgotPassword from '../components/Login/AmiraForgotPassword';
import config from '../config';
import GlobalNav from '../components/Global/GlobalNav';
import cx from 'classnames';
import Amplify, { Auth } from 'aws-amplify';
import awsStates from '../components/Login/awsStates';

//polyfills
require('../polyfills.js');

// parse the search params from our current URL
// this is used to (a) deeplink to signup and (b) prepopulate verification
let urlParams = new URLSearchParams(window.location.search);

const AUTH_MODES = {signUp: 'signUp', signup: 'signUp', confirm: 'confirmSignUp', signin: 'signIn'};
const SIGNEDIN_MODE = {signedIn: 'signedIn'};
let token = null;
const sts = new AWS.STS();
let sso = false;

class AppContainer extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      userData: null,
    }
  }

  componentDidMount(){
    //TODO: Potentially resurrect this for development: this.props.authData && this.cacheData(this.props.authData);
    clearUserData();
    if(urlParams.get("token")){
      token = urlParams.get("token");
      sso = true;
      this.assumeRole();
    }
  }

  getUserDataFromURL(){
    let userType = urlParams.get("role") || "STUDENT";
    userType = userType && userType.toLowerCase();
    let grade = urlParams.get("grade");
    if(grade) grade = parseInt(grade);

    const user = {
      attributes: {
        'custom:firstName': urlParams.get("firstName") || "DefaultFirst",
        'custom:lastName': urlParams.get("lastName") || "DefaultLast",
        'custom:sisId': urlParams.get("userId") || "12345678-1234-1234-1234-123456789012",
        'custom:userType': userType,
        grade: grade || 0,
        districtId: urlParams.get("districtId") || 12591,
        schoolId: urlParams.get("schoolId") || 12595,
        correlationid: urlParams.get("correlationid"),
        skipMagic: true
      }
    };
    return user;
  }

  //Cache the User Data
  componentDidUpdate(prevProps){
    if(this.props.authData != prevProps.authData){
      if(this.props.authData && (prevProps.authData === undefined)){
        console.log("Trying to auth with cached creds. Signing out.");
        clearUserData();
      }else if(this.props.authData){
        this.cacheData(this.props.authData);
      }
    }
  }

  federatedLogIn(sessionToken){
    const expiresIn = 3600;
    const date = new Date();
    const expires_at = expiresIn * 1000 + date.getTime();

    const user = this.getUserDataFromURL();
    return Auth.federatedSignIn('developer', { token: sessionToken, expires_at }, user)
    .then(credentials => {
        return Auth.currentAuthenticatedUser()
        .then((resp)=>{
          this.cacheData(resp);
        })
    });
  }

  assumeRole(){
    var params = {
      DurationSeconds: 3600,
      RoleArn: 'arn:aws:iam::867416147753:role/lexaspeechapi_auth_MOBILEHUB_1085629480',
      WebIdentityToken: token,
      RoleSessionName: "test"
     };
     sts.assumeRoleWithWebIdentity(params, (function(err, data) {
       if (err) console.log(err, err.stack); // an error occurred
       else {
        AWS.config.update({
          accessKeyId: data.Credentials.AccessKeyId,
          secretAccessKey: data.Credentials.SecretAccessKey,
          sessionToken: data.Credentials.SessionToken
        });
        this.federatedLogIn(data.Credentials.sessionToken);
       }
     }).bind(this));
  }

  cacheData(data){
    data.locale = urlParams.get('locale');
    saveUserData(data)
    .then(resp =>{
      //Tell other Amira windows to log out.
      message_broadcast('logout');
      //Start listening for other instances of Amira (do it here before we grab the mic)
      window.addEventListener('storage', (evt) => {
        message_receive(evt);
      });
      //initAudio()
      //.then(()=>{
        this.setState({
          userData: resp,
        });
      //});
    })
    .catch((err) =>{
      console.log("ERROR IN SETTING LOGGED IN USER!")
      endUserSession();
    });
  }

  render() {
    // The user must be Authenticated to access the App
    if(!SIGNEDIN_MODE[this.props.authState] || !this.state.userData){
      return null;
    }

    const { userType } = this.state.userData;


    let appContainerClasses = cx({
      'appContainer': true,
      'teacherMode' : this.props.location.pathname.includes('teacher') || this.props.location.pathname.includes('admin'),
    });

    let appConfig = config[userType];

    //TODO: We shouldn't need to condition routes like this (a lot of routes currently depend on App.js state/methods/props)
    return (
      <div className={appContainerClasses}>
        <Route path="/(teacher|reports|admin)/" render={(props) => <GlobalNav {...props}/>} />
        <App
          {...this.props}
          config={appConfig}
          selectStories={urlParams.get('select')}
          forceStory={urlParams.get('storyId')}
          forceTutor={urlParams.get('forceTutor')}
          forceGooglePM={urlParams.get('googlePM')}
          noAvatar={urlParams.get('noAvatar')}
          forceIntervention={urlParams.get('interventionType')}
          skipIntros={urlParams.get('skipIntros')}
        />
      </div>
    );
  }
}

function Footer({ authState }) {
  if(SIGNEDIN_MODE[authState]){
    return null;
  }
  return (
    <div className="footer">
      <div className="footerWrapper">
        <span className="footerContent">The first Intelligent Reading Assistant that listens, assesses & coaches, Amira accelerates reading mastery.</span>
        <span className="footerContent">Copyright &copy; 2018-{new Date().getFullYear()} Amira Learning, Inc. All rights reserved. Terms of Use. Privacy Policy.</span>
      </div>
    </div>
  );
}

export default class AppWithAuth extends React.Component {
  render(){
    // pull initial authState from URL params. Defaults to signIn
    let authState = urlParams.get('token') ? 'signedIn' : AUTH_MODES[urlParams.get('authState')] || AUTH_MODES.signin;
    return (
      <Provider store={this.props.store}>
        <Router>
          <AmiraAuthenticator
            includeGreetings={false}
            hideDefault={true}
            authState={authState}
          >
            <AmiraSignIn/>
            <ConfirmSignIn/>
            <VerifyContact/>
            <AmiraSignUp/>
            <AmiraConfirmSignUp code={urlParams.get('code')}/>
            <AmiraForgotPassword/>
            <AppContainer location={location}/>
            <Footer />
          </AmiraAuthenticator>
        </Router>
      </Provider>
    );
  }
}
