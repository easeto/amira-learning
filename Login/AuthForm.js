import React from 'react';
import { I18n } from '@aws-amplify/core';
import { AmiraTheme, customHintTheme } from './AmiraTheme';
import amiraLogo from '../../images/AmiraLogo.svg'
import {
  FormSection,
  FormField,
  SectionHeader,
  SectionHeaderContent,
  SectionBody,
  SectionFooter,
  Button,
  Link,
  Hint,
  Input,
  InputLabel,
  SectionFooterPrimaryContent,
  SectionFooterSecondaryContent,
} from 'aws-amplify-react/lib/Amplify-UI/Amplify-UI-Components-React.js';
import * as AmplifyUI from '@aws-amplify/ui';

//Creates our Footer with the PrimaryContent being the Main Button
//and the SecondaryContent [optional] as the Link to another Auth Page.
class AmiraFooter extends React.Component {
  render() {
    const { onMainBtnClick, footer } = this.props;

    const primarySection = (
      <SectionFooterPrimaryContent theme={AmiraTheme}>
        <Button theme={AmiraTheme} onClick={onMainBtnClick}>
          {I18n.get(footer.mainBtn.label)}
        </Button>
      </SectionFooterPrimaryContent>
    );

    let secondarySection = null;
    if(footer.secondary){
      //The handleClick from the secondary object takes presedence over the changeState
      const handleClick = footer.secondary.handleClick ? footer.secondary.handleClick : this.props.changeState;

      secondarySection = (
        <SectionFooterSecondaryContent theme={AmiraTheme}>
          {I18n.get(footer.secondary.label)}
          <Link theme={AmiraTheme} onClick={() => handleClick(footer.secondary.linkState)}>
            {I18n.get(footer.secondary.linkText)}
          </Link>
        </SectionFooterSecondaryContent>
      )
    }

    return (
      <SectionFooter theme={AmiraTheme}>
        {primarySection}
        {secondarySection}
      </SectionFooter>
    );
  }
}

//Creates the Hint UI
class AmiraHint extends React.Component {
  render() {
    //Do not display if there's no hint or label
    if(!this.props.hint || !this.props.hint.label){
      return null;
    }
    const { theme, hint } = this.props;

    //The handleClick from the hint object takes presedence over the changeState
    const handleClick = hint.handleClick ? hint.handleClick : this.props.changeState;

    return (
      <Hint theme={AmiraTheme}>
        {I18n.get(hint.label)}
        <Link theme={AmiraTheme} onClick={() => handleClick(hint.linkState)}>
          {I18n.get(hint.linkText)}
        </Link>
      </Hint>
    )
  }
}

//Create all the Form Fields
class AmiraFormFields extends React.Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.usernameInput = React.createRef();
    this.passwordInput = React.createRef();
  }

  componentDidUpdate(prevProps) {
    // After a set timeout, clear any autofilled form data
    if(prevProps.initialized != this.props.initialized) {
      this.usernameInput.value = '';
      this.passwordInput.value = '';
    }
  }

  render() {
    return (
      <div>
        {this.props.fields.map((field, index) => (
          <FormField key={field.id} theme={AmiraTheme}>
            <InputLabel theme={AmiraTheme}>
              {I18n.get(field.label)}
            </InputLabel>
            {index == 0 && <input
              className={AmplifyUI.input}
              style={{fontSize: 16}}
              name={field.name}
              type={field.type || 'text'}
              disabled={field.disabled}
              ref={el => this.usernameInput = el}
              autoFocus={field.autoFocus}
              autoComplete={field.autoComplete}
              defaultValue={field.defaultValue}
              placeholder={I18n.get(field.placeholder)}
              onChange={this.props.handleInputChange}
            />}
            {index == 1 && <input
              className={AmplifyUI.input}
              style={{fontSize: 16}}
              name={field.name}
              type={field.type || 'text'}
              disabled={field.disabled}
              ref={el => this.passwordInput = el}
              autoFocus={field.autoFocus}
              autoComplete={field.autoComplete}
              defaultValue={field.defaultValue}
              placeholder={I18n.get(field.placeholder)}
              onChange={this.props.handleInputChange}
            />}
          </FormField>
        ))}
      </div>
    );
  }
}

const amiraLogoStyle = {
  height: '70px',
  width: '210px',
  marginBottom: '20px',
}

//Creates Our Form by using the helper components in this file.
export default class AuthForm extends React.Component {
  render() {
    return (
      <FormSection theme={AmiraTheme}>

        <SectionHeader theme={AmiraTheme}>
          <img src={amiraLogo} alt="amira logo" style={amiraLogoStyle} />
        </SectionHeader>
        <SectionHeader theme={AmiraTheme}>
          <SectionHeaderContent theme={AmiraTheme}>
            {I18n.get(this.props.header.title)}
            <Hint theme={customHintTheme} style={{marginTop: '15px', color: '#555561'}}>
              {I18n.get(this.props.header.subTitle)}
            </Hint>
          </SectionHeaderContent>
        </SectionHeader>

        <SectionBody theme={AmiraTheme}>
          <AmiraFormFields
            fields={this.props.fields}
            clearRefs={[this.usernameInput, this.passwordInput]}
            handleInputChange={this.props.handleInputChange}
            initialized={this.props.initialized}
          />
          <AmiraHint
            hint={this.props.hint}
            changeState={this.props.changeState}
          />
        </SectionBody>

        <AmiraFooter
          footer={this.props.footer}
          changeState={this.props.changeState}
          onMainBtnClick={this.props.onMainBtnClick}
        />

      </FormSection>
    );
  }
}