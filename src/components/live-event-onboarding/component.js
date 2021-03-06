import React, { Component } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { ScrollDownIndicator } from 'react-landing-page';
import { Checkbox  } from 'antd';

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
			displayWelcome: true,
			type: 'natural',
			isChecked: false,
			disableBtn: false
		}

		localStorage.removeItem('totalDonated');
		localStorage.removeItem('userName');
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

	signUp() {
		if(this.validateSignUpFields()) {
			this.setState({disableBtn: true});
			let url = EndPoints.postSignUpUrl + '?event=bal81764-bea1-4249-b86d-f8fb8182eec1&table=' + this.state.tableNumber;
			let params = {
				username: this.state.username,
				email: this.state.username,
				password: this.state.password,
				name: this.state.name,
				type: this.state.type
			};
			let appToken = localStorage.getItem('appToken');
			let auth =  {
				auth: {
					username: 'gohelpfund',
					password: 'ghfsecret'
				}
			}
			localStorage.setItem('userName', this.state.name);
			var that = this;
			axios.post(url, params, auth)
				.then(response => {
					this.setLoginData(response.data);
				})
				.catch(function(error) {
					that.setState({disableBtn: false});
					console.log(error);
				});
		}
	}

	validateSignUpFields() {
		let errorMessages = [];
		let isUsernameValid = true;

		isUsernameValid = this.state.username && !!this.state.username.match(/.+@.+/);

		if(!isUsernameValid) {
			errorMessages.push('Introduceți o adresă de email validă');
		}

		if(isUsernameValid) {
			this.setState({
				errorMessages: errorMessages,
				isUsernameValid: isUsernameValid,
			});
			return true;
		} else {
			this.setState({
				errorMessages: errorMessages,
				isUsernameValid: isUsernameValid,
			});
			return false;
		}
	}

	toggleCheckbox() {
    this.setState({isChecked: !this.state.isChecked});
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
						<div id="login-page"className="box-section" onClick={this.nextStep.bind(this)}>
							<div><img className="bal-logo" src={balLogo}/></div>
							<div><img className="aqua-logo" src={aquafeeriaLogo}/></div>
							<h2 className="welcome-text-1">Prin această platformă te poți angaja să faci o donație, indiferent de sumă, pentru cauzele susținute de <strong>Fundația Serviciilor Sociale Bethany</strong>.</h2>
							<h2 className="welcome-text-2"> Îți mulțumim pentru generozitate!</h2>
							<div className="arrow-container"><ScrollDownIndicator /></div>
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
								type="email"
								value={this.state.username}
								onChange={this.handleChange('username')}
								margin="normal"
								className="onboarding-input"
							/>
						</div>
						<div className="onboarding-input-container">
							<TextField
								id="table-number"
								label="Număr masă"
								type="number"
								value={this.state.tableNumber}
								onChange={this.handleChange('tableNumber')}
								margin="normal"
								className="onboarding-input"
							/>
							</div>
							<div className="onboarding-input-container select-container">
							 <FormControl>
								<InputLabel htmlFor="age-simple">Contribui prin</InputLabel>
								<Select
									value={this.state.type}
									onChange={this.handleChange('type')}>
									<MenuItem value={'natural'}>Donație (persoană fizică)</MenuItem>
									<MenuItem value={'legal'}>Sponsorizare (persoană juridică)</MenuItem>
								</Select>
							</FormControl>
						</div>
						<div className="checkbox-container">
            	<Checkbox onChange={this.toggleCheckbox.bind(this)}>DA, sunt de acord cu prelucrarea datelor personale în scop informativ. Datele vor fi
șterse după finalizarea donației.</Checkbox>
						</div>
						<div className="onboarding-input-container">
							<Button onClick={this.signUp.bind(this)} disabled={!this.state.isChecked || this.state.disableBtn} variant="contained" color="primary" className="onboarding-btn">
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