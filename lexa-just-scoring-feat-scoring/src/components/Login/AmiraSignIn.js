/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

import React from 'react';
import { SignIn } from 'aws-amplify-react';
import AuthForm from './AuthForm';
import awsStates from './awsStates';
import { Authenticator } from 'aws-amplify-react/lib/Auth';
import Auth from '@aws-amplify/auth';
import { I18n, JS, ConsoleLogger as Logger } from '@aws-amplify/core';
import ReactGA from 'react-ga';
const logger = new Logger('SignIn');

//Object representation of the SignIn Form
const signInForm = {
  header: {
    title: '',
  },
  fields: [
    {
      id: 'username',
      name: 'username',
      label: '',
      placeholder: 'User Name',
      autoFocus: true,
      autoComplete: "off",
    },
    {
      id: "password",
      name: "password",
      label: '',
      placeholder: 'Password',
      type: "password",
      autoComplete: "new-password",
    }
  ],
  hint: {
    //label: 'Forgot your password? ',
    //linkText: 'Reset password',
    //linkState: awsStates.FORGOT_PASSWORD,
  },
  footer: {
    mainBtn: {
      label: 'sign in',
    },
    secondary: {
      //label: 'No account? ',
      //linkText: 'Create account',
      //linkState: awsStates.SIGN_UP,
    },
  },
};

export class AmiraAuthenticator extends Authenticator {
  handleAuthEvent(state, event, showToast = true) {
    if (event.type === 'error') {
        const map = this.props.errorMessage;
        let message = (typeof map === 'string')? map : event.data;
        if(message.startsWith("Exception migrating user in app client")){
          message = "Incorrect user name or password";
        } else if (message.includes("User does not exist")) {
          message = "We cannot find an account with that username";
        }
        this.setState({ error: message, showToast });
    }
  }
}

export default class AmiraSignIn extends SignIn {
  constructor(props){
    super(props);
    this.state = {
      initialized: false,
    };

    this.checkContact = this.checkContact.bind(this);
    this.signIn = this.signIn.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.changeState = this.changeState.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  validateInputs(){
    const { username, password } = this.inputs;
    //TODO: Add Real validation Here
    if(typeof username != 'undefined' && typeof password != 'undefined'){
      return true;
    }
    //Otherwise return false
    return false;
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    setTimeout(() => {
      this.setState({
        initialized: true,
      });
    }, 50);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown(e) {
    if(this.props.authState === awsStates.SIGN_IN && this.validateInputs()){
      if(e.keyCode === 13){// when press enter
        this.signIn(e);
      }
    }
  }

  // Override the sign in method, so that we can prevent auto-login by browser
  async signIn(event) {
        // avoid submitting the form
        event.preventDefault();

        // prevent autologin by browser
        if(!this.state.initialized) {
          ReactGA.event({
            category: 'bug tracking',
            action: 'sign in attempted prior to AmiraSignIn.js initialization',
          });
          return;
        }

        const { username='', password='' } = this.inputs;
        //Strip any spaces from the beginning and the end of username and password
        const cleanUsername = username.trim();
        const cleanPassword = password.trim();

        if (!Auth || typeof Auth.signIn !== 'function') {
            throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported');
        }
        this.setState({loading: true});
        try {
            const user = await Auth.signIn(cleanUsername, cleanPassword);
            logger.debug(user);
            if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
                logger.debug('confirm user with ' + user.challengeName);
                this.changeState('confirmSignIn', user);
            } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                logger.debug('require new password', user.challengeParam);
                this.changeState('requireNewPassword', user);
            } else if (user.challengeName === 'MFA_SETUP') {
                logger.debug('TOTP setup', user.challengeParam);
                this.changeState('TOTPSetup', user);
            } else {
                this.checkContact(user);
            }
        } catch (err) {
            if (err.code === 'UserNotConfirmedException') {
                logger.debug('the user is not confirmed');
                this.changeState('confirmSignUp', {cleanUsername});
            } else if (err.code === 'PasswordResetRequiredException') {
                logger.debug('the user requires a new password');
                this.changeState('forgotPassword', {username});
            } else {
                this.error(err);
            }
        } finally {
            this.setState({loading: false})
        }
    }

  showComponent(theme) {
    const { hide = [] } = this.props;
    if (hide && hide.includes(AmiraSignIn)) { return null; }
    const { username='', password='' } = this.inputs;
    console.log('auth form component called with username: ', [username.trim()]);

    if(username.trim() == ""){
      Auth.signOut();
    }

    return (
      <AuthForm
        header={signInForm.header}
        fields={signInForm.fields}
        hint={signInForm.hint}
        footer={signInForm.footer}
        onMainBtnClick={this.signIn}
        changeState={this.changeState}
        handleInputChange={this.handleInputChange}
        initialized={this.state.initialized}
      />
    );
  }
}