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

 //Overriding selected methods from https://github.com/aws-amplify/amplify-js/blob/master/packages/aws-amplify-react/src/Auth/ConfirmSignUp.jsx

import React from 'react';
import { Auth } from 'aws-amplify';
import { ConfirmSignUp } from 'aws-amplify-react';
import AuthForm from './AuthForm';
import awsStates from './awsStates';

//Object representation of the confirmSignUp Form
let confirmSignUpForm = {
  header: {
    title: "Confirm Sign Up",
  },
  fields: [
    {
      id: 'username',
      name: 'username',
      label: '',
      placeholder: 'Email Address',
    },
    {
      id: "code",
      name: "code",
      label: 'Confirmation Code',
      placeholder: 'Enter your code',
      autoFocus: true,
      autoComplete: false,
    }
  ],
  hint: {
    label: 'Lost your code? ',
    linkText: 'Resend Code',
  },
  footer: {
    mainBtn: {
      label: 'CONFIRM',
    },
    secondary: {
      label: '',
      linkText: 'Back to Sign In',
      linkState: awsStates.SIGN_IN,
    },
  },
};

// This is my custom Confirm Sign Up component
export default class AmiraConfirmSignUp extends ConfirmSignUp {
  constructor(props){
    super(props);

    this.confirm = this.confirm.bind(this);
  }

  confirm() {
    const username = this.usernameFromAuthData() || this.inputs.username;
    const code = this.inputs.code || this.props.code;
    if (!Auth || typeof Auth.confirmSignUp !== 'function') {
      throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported');
    }

    Auth.confirmSignUp(username, code)
      .then(() => this.changeState(awsStates.SIGNED_UP))
      .catch(err => this.error(err));
  }

  showComponent(theme) {
    const { hide } = this.props;
    const username = this.usernameFromAuthData();

    if (hide && hide.includes(AmiraConfirmSignUp)) { return null; }

    //If we receive the username we populate the username field
    //and disable it.
    if(username){
      confirmSignUpForm.fields[0]["disabled"] = true;
      confirmSignUpForm.fields[0]["defaultValue"] = username;
    }

    //Pass the code as the default value of the Cofirmation Code field
    if(this.props.code){
      confirmSignUpForm.fields[1]["defaultValue"] = this.props.code;
    }

    confirmSignUpForm.hint["handleClick"] = this.resend;

    return (
      <AuthForm
        header={confirmSignUpForm.header}
        fields={confirmSignUpForm.fields}
        hint={confirmSignUpForm.hint}
        footer={confirmSignUpForm.footer}
        onMainBtnClick={this.confirm}
        changeState={this.changeState}
        handleInputChange={this.handleInputChange}
      />
    )
  }
}