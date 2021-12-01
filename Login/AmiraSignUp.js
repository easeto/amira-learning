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

 //Overriding selected methods from https://github.com/aws-amplify/amplify-js/blob/master/packages/aws-amplify-react/src/Auth/SignUp.jsx

import React from 'react';
import { SignUp } from 'aws-amplify-react';
import { Auth } from 'aws-amplify';
import AuthForm from './AuthForm';
import awsStates from './awsStates';

//Object representation of the SignUp Form
const signUpForm = {
  header: {
    title: "Let's Get Started!",
    subTitle: 'Sign Up by entering the information below',
  },
  fields: [
    {
      id: 'username',
      name: 'username',
      label: '',
      placeholder: 'Email Address',
      autoFocus: true,
    },
    {
      id: "password",
      name: "password",
      label: '',
      placeholder: 'Password',
      type: "password",
    }
  ],
  hint: null,
  footer: {
    mainBtn: {
      label: 'CREATE ACCOUNT',
    },
    secondary: {
      label: 'Have an account? ',
      linkText: 'Sign In',
      linkState: awsStates.SIGN_IN,
    },
  },
};

// This is my custom Sign Up component
export default class AmiraSignUp extends SignUp {
  constructor(props){
    super(props);
  }

  signUp() {
    let { username, password, email } = this.inputs;
    username = username.toLowerCase(); //Do this because cognito names are case-sensitive
    email = username;

    if (!Auth || typeof Auth.signUp !== 'function') {
      throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported');
    }
    Auth.signUp({
      username,
      password,
      attributes: {
        email,
      }
    }).then(() => this.changeState(awsStates.CONFIRM_SIGN_UP, username))
    .catch(err => this.error(err));
  }

  showComponent(theme) {
    const { hide } = this.props;
    if (hide && hide.includes(AmiraSignUp)) { return null; }

    return (
      <AuthForm
        header={signUpForm.header}
        fields={signUpForm.fields}
        hint={signUpForm.hint}
        footer={signUpForm.footer}
        onMainBtnClick={this.signUp}
        changeState={this.changeState}
        handleInputChange={this.handleInputChange}
      />
    )
  }
}