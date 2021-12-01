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
import { ForgotPassword } from 'aws-amplify-react';
import AuthForm from './AuthForm';
import awsStates from './awsStates';

export default class AmiraForgotPassword extends ForgotPassword {
  constructor(props) {
    super(props);

    this.send = this.send.bind(this);
    this.submit = this.submit.bind(this);

    this._validAuthStates = [awsStates.FORGOT_PASSWORD];
    this.state = {
      delivery: null,
    };
  }

  //This is the first form, where we take the email address of the
  //user to send them the verification code.
  getRequestCodeForm() {
    return {
      header: {
        title: 'Reset Password',
      },
      fields: [
        {
          id: 'username',
          label: '',
          autoComplete: true,
          placeholder: 'Email Address',
          name: 'username',
        }
      ],
      hint: null,
      footer: {
        mainBtn: {
          label: 'SEND CODE',
        },
        secondary: {
          label: 'Back to ',
          linkText: 'Sign In',
          linkState: awsStates.SIGN_IN,
        },
      },
    };
  }

  //This is the 2nd Form, loaded after we send the User
  //the validation code to change the password.
  getConfirmCodeForm() {
    return {
      header: {
        title: 'Reset your password',
      },
      fields: [
        {
          id: 'code',
          name: 'code',
          placeholder: 'Confirmation Code',
          autoComplete: 'off',
        },
        {
          id: 'password',
          name: 'password',
          type: 'password',
          placeholder: 'New Password',
        },
      ],
      hint: {
        label: 'Lost your code? ',
        linkText: 'Resend Code',
        handleClick: this.send,
      },
      footer: {
        mainBtn: {
          label: 'SUBMIT',
        },
        secondary: null,
      },
    };
  }

  showComponent(theme) {
    const { hide } = this.props;
    if (hide && hide.includes(AmiraForgotPassword)) { return null; }

    //get the correct form based on "delivery"
    const forgotPasswordForm = this.state.delivery ? this.getConfirmCodeForm() : this.getRequestCodeForm();
    //call the right method based on "delivery"
    const onMainBtnClick = this.state.delivery ? this.submit : this.send;

    return (
      <AuthForm
        header={forgotPasswordForm.header}
        fields={forgotPasswordForm.fields}
        hint={forgotPasswordForm.hint}
        footer={forgotPasswordForm.footer}
        onMainBtnClick={onMainBtnClick}
        changeState={this.changeState}
        handleInputChange={this.handleInputChange}
      />
    )
  }
}