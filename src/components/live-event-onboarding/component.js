import React, { Component } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { ScrollDownIndicator } from 'react-landing-page';

import balLogo from '../../assets/images/live-event/logo-bal.png';
import aquafeeriaLogo from '../../assets/images/live-event/logo-aquafeeria.png';

import * as EndPoints from '../../utils/end-points';

import './style.css';

class LiveEventOnboarding extends Component {
	static propTypes = {
    cookies: instanceOf(Cookies).isRequired
	};
	
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			name: '',
			tableNumber: null,
			retypedPassword: '',
			loginPage: false,
			isUsernameValid: true,
			isPasswordValid: true,
			errorMessages: [],
			displayWelcome: true
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
		this.props.updateLoginState(true);
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
					console.log(error);
				});
		}
	}

	signUp() {
		if(this.validateSignUpFields()) {
			let url = EndPoints.postSignUpUrl + '?event=bal81764-bea1-4249-b86d-f8fb8182eec1&table=' + this.state.tableNumber;
			let params = {
				username: this.state.username,
				email: this.state.username,
				password: this.state.password,
				name: this.state.name
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
			errorMessages.push('Introduceți o adresă de email validă');
		}

		if(!isPasswordValid) {
			errorMessages.push('Parola trebuie să aibă minim 6 caractere');
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

		isPasswordValid = this.state.password && this.state.password.length >= 6;
		isUsernameValid = this.state.username && !!this.state.username.match(/.+@.+/);

		if(!isUsernameValid) {
			errorMessages.push('Introduceți o adresă de email validă');
		}

		if(!isPasswordValid) {
			errorMessages.push('Parola trebuie să aibă minim 6 caractere');
		}

		if(isUsernameValid && isPasswordValid) {
			this.setState({
				errorMessages: errorMessages,
				isUsernameValid: isUsernameValid,
				isPasswordValid: isPasswordValid,
			});
			return true;
		} else {
			this.setState({
				errorMessages: errorMessages,
				isUsernameValid: isUsernameValid,
				isPasswordValid: isPasswordValid,
			});
			return false;
		}
	}

	nextStep() {
		this.setState({displayWelcome: false});
	}

	render() {
		const errorMessages = this.state.errorMessages.map(errorMessage =>
			<div>{errorMessage}</div>
		);

		return (
				<div id="app-live-event-onboarding">
					{this.state.displayWelcome ? (
						<div id="login-page"className="box-section">
							<div><img className="bal-logo" src={balLogo}/></div>
							<div><img className="aqua-logo" src={aquafeeriaLogo}/></div>
							<h2 className="welcome-text-1">Prin această platformă te poți angaja să faci o donație, indiferent de sumă, pentru cauzele susținute de Fundația Serviciilor Sociale Bethany.</h2>
							<h2 className="welcome-text-2"> Îți mulțumim pentru generozitate!</h2>
							<div className="arrow-container"><ScrollDownIndicator onClick={this.nextStep.bind(this)} /></div>
						</div>
					) : (
						<div id="login-page"className="box-section">
						<h1 className="box-title">Date de contact donator</h1>
						<div className="onboarding-input-container">
							<TextField
								id="name"
								label="Nume și prenume"
								value={this.state.name}
								onChange={this.handleChange('name')}
								margin="normal"
								className="onboarding-input"
							/>
						</div>
						<div className="onboarding-input-container">
							<TextField
								id="username"
								label="Email"
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
								label="Parolă"
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
								id="table-number"
								label="Număr masă"
								type="number"
								value={this.state.tableNumber}
								onChange={this.handleChange('tableNumber')}
								margin="normal"
								className="onboarding-input"
							/>
						</div>
						<div className="onboarding-input-container">
							<Button onClick={this.signUp.bind(this)} variant="contained" color="primary" className="onboarding-btn">
								Doresc să donez
							</Button>
						</div>
						<div className="error-messages">
							{errorMessages}
						</div>
					</div>
					)}
				
				</div>
			);
	}
}

export default withCookies(LiveEventOnboarding);