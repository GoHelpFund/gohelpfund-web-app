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
			oldPassword: '',
			retypedPassword: '',
			loginPage: true,
			changePasswordPage: false,
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

	setLoginData(data, passwordChanged) {
		const { cookies } = this.props;
		cookies.set('accessToken', data.access_token, { path: '/', maxAge: data.expires_in});
		localStorage.setItem('fundraiserId', data.fundraiser_id);
		localStorage.setItem('fundraiserType', data.fundraiser_type);
		this.props.updateLoginState(true);

		if(data.fundraiser_type === "organization" && passwordChanged === "false") {
			this.setState({
				changePasswordPage: true,
				loginPage: false,
				password: '',
			});
		} else {
			this.props.history.push({
				pathname: '/home/',
			})
		}

		// if(this.props.location && this.props.location.state && this.props.location.state.fromDonateScreen) {
		// 	this.props.history.push({
		// 		pathname: '/campaign-details/' + this.props.location.state.campaignDetails.id,
		// 		state: { fromDonateScreen: true, referrer: this.props.location.state.campaignDetails }
		// 	})

		// 	return;
		// }

		// if(this.props.location && this.props.location.state && this.props.location.state.referrer) {
		// 	this.props.history.push({
		// 		pathname: '/create-campaign/',
		// 		state: { referrer: this.props.location.state.referrer }
		// 	})

		// 	return;
		// }
		
	
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
					this.setLoginData(response.data, response['headers']['x-password-changed']);
				})
				.catch(function(error) {
					that.setState({errorMessages: ['Invalid credentials. Please try again.']});
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

	changePassword() {
		if(this.validateSignUpFields()) {
			const { cookies } = this.props;
			let url = EndPoints.postChangePasswordUrl;
			let params = {
				'old_password': this.state.oldPassword,
				'new_password': this.state.password
			};
			let appToken = cookies.get('accessToken');
			let config = {
				headers: {'Authorization': "Bearer " + appToken}
			  };
			var that = this;
			axios.post(url, params, config)
				.then(response => {
					window.location.pathname = '/home';
				})
				.catch(function(error) {
					that.setState({errorMessages: ['The old password is wrong. Please try again.']});
					console.log(error);
				});
		}
	}

	render() {
		const errorMessages = this.state.errorMessages.map(errorMessage =>
			<div>{errorMessage}</div>
		);

		let loginPage = (<div id="login-page"className="box-section">
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
		</div>);

		let registerPage = (<div id="login-page"className="box-section">
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
		</div>);

		let changePasswordPage = (<div id="login-page"className="box-section">
		<h1 className="box-title">Change Password</h1>
		<div className="onboarding-input-container">
			<TextField
				error={!this.state.isPasswordValid}
				id="old-password"
				label="Old Password"
				type="password"
				value={this.state.oldPassword}
				onChange={this.handleChange('oldPassword')}
				margin="normal"
				className="onboarding-input"
			/>
		</div>
		<div className="onboarding-input-container">
			<TextField
				error={!this.state.isPasswordValid}
				id="password"
				label="New Password"
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
				label="Retype new password"
				type="password"
				value={this.state.retypedPassword}
				onChange={this.handleChange('retypedPassword')}
				margin="normal"
				className="onboarding-input"
			/>
		</div>
		<div className="onboarding-input-container">
			<Button onClick={this.changePassword.bind(this)} variant="contained" color="primary" className="onboarding-btn">
				Sign Up
			</Button>
		</div>
		<div className="error-messages">
			{errorMessages}
		</div>
	</div>);

		let currentPage = this.state.loginPage ? loginPage : this.state.changePasswordPage ? changePasswordPage : registerPage;

		return (
				<div id="app-onboarding">
					{currentPage}
				</div>
			);
	}
}

export default withCookies(Onboarding);