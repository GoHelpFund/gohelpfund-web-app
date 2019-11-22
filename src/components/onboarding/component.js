import React, { Component } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import * as EndPoints from '../../utils/end-points';

import './style.css';

class Onboarding extends Component {
	static propTypes = {
    cookies: instanceOf(Cookies).isRequired
	};
	
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			retypedPassword: '',
			loginPage: true,
			isUsernameValid: true,
			isPasswordValid: true,
			arePasswordsMatching: true,
			errorMessages: [] 
		}
	}

	handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
	};
	
	switchPage() {
		this.setState({loginPage: !this.state.loginPage});
	}

	setLoginData(data) {
		const { cookies } = this.props;
		cookies.set('accessToken', data.access_token, { path: '/', maxAge: data.expires_in});
		localStorage.setItem('fundraiserId', data.fundraiser_id);
		localStorage.setItem('fundraiserType', data.fundraiser_type);
		this.props.updateLoginState(true);

		if(this.props.location && this.props.location.state && this.props.location.state.fromDonateScreen) {
			this.props.history.push({
				pathname: '/campaign-details/' + this.props.location.state.campaignDetails.id,
				state: { fromDonateScreen: true, referrer: this.props.location.state.campaignDetails }
			})

			return;
		}

		if(this.props.location && this.props.location.state && this.props.location.state.referrer) {
			this.props.history.push({
				pathname: '/create-campaign/',
				state: { referrer: this.props.location.state.referrer }
			})

			return;
		}
		
		this.props.history.push({
			pathname: '/home/',
		})
	}

	signIn() {
		if (this.validateLoginFields()) {
			let url = EndPoints.postSignInUrl;
			let params = {
				username: this.state.username,
				password: this.state.password,
				grant_type: 'password',
			};
			let auth =  {
				auth: {
					username: 'gohelpfund',
					password: 'ghfsecret'
				}
			}
			var that = this;
			axios.post(url, params, auth)
				.then(response => {
					this.setLoginData(response.data);
				})
				.catch(function(error) {
					if(error.response.data.error_description == 'Bad credentials') {
						that.setState({errorMessages: ['Invalid credentials. Please try again.']});
					}
					console.log(error);
				});
		}
	}

	signUp() {
		if(this.validateSignUpFields()) {
			let url = EndPoints.postSignUpUrl;
			let params = {
				username: this.state.username,
				email: this.state.username,
				password: this.state.password
			};
			let appToken = localStorage.getItem('appToken');
			let auth =  {
				auth: {
					username: 'gohelpfund',
					password: 'ghfsecret'
				}
			}
			var that = this;
			axios.post(url, params, auth)
				.then(response => {
					this.setLoginData(response.data);
				})
				.catch(function(error) {
					that.setState({errorMessages: ['This username already exists. Please try again.']});
					console.log(error);
				});
		}
	}

	validateLoginFields() {
		let errorMessages = [];
		let isPasswordValid = true;
		let isUsernameValid = true;


		isPasswordValid = this.state.password && this.state.password.length >= 6;
		isUsernameValid = this.state.username && !!this.state.username.match(/.+@.+\..+/);

		if(!isUsernameValid) {
			errorMessages.push('Please provide a valid email address.');
		}

		if(!isPasswordValid) {
			errorMessages.push('The password must have at least 6 characters');
		}

		

		if(isUsernameValid && isPasswordValid) {
			this.setState({
				errorMessages: errorMessages,
				isUsernameValid: isUsernameValid,
				isPasswordValid: isPasswordValid
			});
			return true;
		} else {
			this.setState({
				errorMessages: errorMessages,
				isUsernameValid: isUsernameValid,
				isPasswordValid: isPasswordValid
			});
			return false;
		}
	}

	validateSignUpFields() {
		let errorMessages = [];
		let isPasswordValid = true;
		let isUsernameValid = true;
		let arePasswordsMatching = true;


		isPasswordValid = this.state.password && this.state.password.length >= 6;
		arePasswordsMatching = this.state.password && this.state.password === this.state.retypedPassword;
		isUsernameValid = this.state.username && !!this.state.username.match(/.+@.+/);

		if(!isUsernameValid) {
			errorMessages.push('Please provide a valid email address.');
		}

		if(!isPasswordValid) {
			errorMessages.push('The password must have at least 6 characters.');
		}
		
		if(!arePasswordsMatching) {
			errorMessages.push('The passwords must match.');
		}


		if(isUsernameValid && isPasswordValid && arePasswordsMatching) {
			this.setState({
				errorMessages: errorMessages,
				isUsernameValid: isUsernameValid,
				isPasswordValid: isPasswordValid,
				arePasswordsMatching: arePasswordsMatching
			});
			return true;
		} else {
			this.setState({
				errorMessages: errorMessages,
				isUsernameValid: isUsernameValid,
				isPasswordValid: isPasswordValid,
				arePasswordsMatching: arePasswordsMatching
			});
			return false;
		}
	}

	saveSessionData() {

	}

	render() {
		const errorMessages = this.state.errorMessages.map(errorMessage =>
			<div>{errorMessage}</div>
		);

		return (
				<div id="app-onboarding">
					{this.state.loginPage ? (
						<div id="login-page"className="box-section">
						<h1 className="box-title">Log in</h1>
						<div className="onboarding-input-container">
							<TextField
								error={!this.state.isUsernameValid}
								id="username"
								label="Email address"
								value={this.state.username}
								onChange={this.handleChange('username')}
								type="email"
								margin="normal"
								className="onboarding-input"
							/>
						</div>
						<div className="onboarding-input-container">
							<TextField
								error={!this.state.isPasswordValid}
								id="password"
								label="Password"
								type="password"
								value={this.state.password}
								onChange={this.handleChange('password')}
								margin="normal"
								className="onboarding-input"
							/>
						</div>
						<div className="onboarding-input-container">
							<Button onClick={this.signIn.bind(this)} variant="contained" color="primary" className="onboarding-btn">
								Log in
							</Button>
						</div>
						<div className="error-messages">
							{errorMessages}
						</div>
						<div className="onboarding-input-container">
							<div className="onboarding-switch">New to GoHelpFund? <a onClick={this.switchPage.bind(this)}>Sign up</a></div>
						</div>
					</div>
					) : (
						<div id="login-page"className="box-section">
						<h1 className="box-title">Sign Up</h1>
						<div className="onboarding-input-container">
							<TextField
								id="username"
								label="Email address"
								value={this.state.username}
								onChange={this.handleChange('username')}
								margin="normal"
								className="onboarding-input"
							/>
						</div>
						<div className="onboarding-input-container">
							<TextField
								error={!this.state.isPasswordValid}
								id="password"
								label="Password"
								type="password"
								value={this.state.password}
								onChange={this.handleChange('password')}
								margin="normal"
								className="onboarding-input"
							/>
						</div>
						<div className="onboarding-input-container">
							<TextField
								error={!this.state.isPasswordValid}
								id="retype-password"
								label="Retype password"
								type="password"
								value={this.state.retypedPassword}
								onChange={this.handleChange('retypedPassword')}
								margin="normal"
								className="onboarding-input"
							/>
						</div>
						<div className="onboarding-input-container">
							<Button onClick={this.signUp.bind(this)} variant="contained" color="primary" className="onboarding-btn">
								Sign Up
							</Button>
						</div>
						<div className="error-messages">
							{errorMessages}
						</div>
						<div className="onboarding-input-container">
							<div className="onboarding-switch">Already have an account? <a  onClick={this.switchPage.bind(this)}>Sign in</a></div>
						</div>
					</div>
					)}
				
				</div>
			);
	}
}

export default withCookies(Onboarding);