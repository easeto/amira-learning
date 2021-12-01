/* Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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

/*
** Amira Custom Theme
**
** Copied the Amplify-UI-Theme-Sample.jsx from https://github.com/aws-amplify/amplify-js/blob/master/packages/aws-amplify-react/src/Amplify-UI/Amplify-UI-Theme-Sample.jsx
** and modified the Components that we use.
**
** Note: We're not using all the components in this file.
*/

const amiraBlue = '#01acd3';
const amiraSuccess = '#009999';
const amiraLightGrey =  '#555561';
const backgroundGrey = '#f9f6f2';
const studentPrimaryCorrect = '#66cc99';
const shadowGrey = '#a9aeb7';
export const teacherHighlight = '#499f9e';

export const FormContainer = {
  fontFamily: 'Roboto',
  height: '456px',
}

export const FormSection = {
  backgroundColor: backgroundGrey,
  display: 'inline-block',
  minWidth: '380px',
  minHeight: '350px',//TODO: Make this 400px again when we enable "Reset Password" and "Sign Up"
  marginBottom: '0',
  padding: '35px 40px',
  textAlign: 'left',
  boxSizing: 'content-box',
  boxShadow: '10px 10px 15px rgba(169,174,183, 0.7)',
}

export const SectionHeader = {
  fontSize: '35px',
  color: amiraLightGrey,
  letterSpacing: '1.1px',
  lineHeight: 'normal',
  marginBottom: '0',
  textAlign: 'center',
}

export const SectionBody = {
  marginBottom: '30px',
  paddingTop: '10px',
}

export const FormField = {
  marginBottom: '22px',
}

export const Hint = {
  color: amiraLightGrey,
  fontSize: '15px',
  fontWeight: 'normal',
}

export const InputLabel = {
  color: '#9b9b9b',
  fontSize: '20px',
  letterSpacing: '-0.4px',
  marginBottom: '8px',
}

export const Input = {
  display: 'block',
  backgroundColor: '#fff',
  backgroundImage: 'none',
  color: '#4a4a4a',
  border: '1px solid #d8d8d8',
  borderRadius: '3px',
  boxSizing: 'border-box',
  height: '50px',
  fontSize: '16px',
  letterSpacing: '0.6px',
  marginBottom: '10px',
  padding: '16px',
  outline: 'none',
  //width: '370px',
}

export const Button = {
  backgroundImage: 'none',
  backgroundColor: studentPrimaryCorrect,
  border: '3pt solid ' + amiraSuccess,
  borderRadius: '49.49px',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '20px',
  fontWeight: 'bold',
  letterSpacing: '0.6px',
  marginBottom: '20px',
  textTransform: 'capitalize',
  textAlign: 'center',
  touchAction: 'manipulation',
  userSelect: 'none',
  width: '380px',
  whiteSpace: 'nowrap',
  outline: 'none',
}

export const A = {
  color: amiraSuccess,
  cursor: 'pointer',
  fontWeight: 'bold',
}

export const SectionFooter = {
  bottom: '75px',
  color: amiraLightGrey,
  display: 'block',
  fontSize: '16px',
  //position: 'absolute',
}

export const SectionFooterPrimaryContent = {
  display: 'block',
  fontFamily: 'Roboto',
  width: '100%',
}

export const SectionFooterSecondaryContent = {
  display: 'block',
  fontFamily: 'Roboto',
  width: '100%',
}

/******************** We're not using the remaining Components at the moment *****************************/
//Keeping them here in case we need to use one of them in the future.

export const Container = {
  fontWeight: '400',
}

export const SignInButton = {
  position: 'relative',
  width: '100%',
  borderRadius: '4px',
  marginBottom: '10px',
  cursor: 'pointer',
  padding: 0,
  color: '#fff',
  fontSize: '14px',
  '#google_signin_btn': {
      backgroundColor: '#4285F4',
      border: '1px solid #4285F4'
  },
  '#facebook_signin_btn': {
      backgroundColor: '#4267B2',
      borderColor: '#4267B2',
  },
  '#amazon_signin_btn': {
    backgroundColor: '#FF9900',
    border: 'none',
  }
}

export const SignInButtonIcon = {
  position: 'absolute',
  left: 0,
  '#google_signin_btn_icon': {
    backgroundColor: '#fff',
    borderRadius: '4px 0 0 4px',
    height: '30px',
    width: '30px',
    padding: '11px',
  },
  '#facebook_signin_btn_icon': {
    height: '33px',
    width: '18px',
    padding: '10px 14px'
  },
  '#amazon_signin_btn_icon': {
    padding: '10px',
    height: '32px',
    width: '32px',
  }
}

export const SignInButtonContent = {
  textAlign: 'center',
  display: 'block',
  padding: '18px 0',
  textAlign: 'left',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textAlign: 'center',
}

export const Strike = {
  width: '100%',
  textAlign: 'center',
  borderBottom: '1px solid #bbb',
  lineHeight: '0.1em',
  margin: '32px 0',
  color: '#828282',
}

export const StrikeContent = {
  background: '#fff',
  padding: '0 25px',
  fontSize: '14px',
  fontWeight: '500',
}

export const ActionRow = {
  marginBottom: '15px',
}

export const FormRow = {
  marginBottom: '12px'
}

export const Radio = {
  marginRight: '18px',
  verticalAlign: 'bottom',
}

//Create a single Object to Export as the Theme!
export const AmiraTheme = {
  container: Container,
  formContainer: FormContainer,
  formSection: FormSection,
  formField: FormField,

  sectionHeader: SectionHeader,
  sectionBody: SectionBody,
  sectionFooter: SectionFooter,
  sectionFooterPrimaryContent: SectionFooterPrimaryContent,
  sectionFooterSecondaryContent: SectionFooterSecondaryContent,

  input: Input,
  button: Button,
  signInButton: SignInButton,
  signInButtonIcon: SignInButtonIcon,
  signInButtonContent: SignInButtonContent,
  formRow: FormRow,
  strike: Strike,
  strikeContent: StrikeContent,
  actionRow: ActionRow,
  a: A,

  hint: Hint,
  radio: Radio,
  inputLabel: InputLabel,
}


//Custom Hint Style
export const customHintTheme = Object.assign({}, AmiraTheme,
  {
    hint: {
      fontWeight: '300',
      fontSize: '16px',
    },
  }
);