import React, { Component } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import * as EndPoints from '../../utils/end-points';

import './style.css';

class Onboarding extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: null,
			password: null,
			retypedPassword: null,
			loginPage: true,
			myAge: 5
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

	signIn() {
		let url = EndPoints.postSignInUrl;
		let params = {
			username: this.state.username,
			password: this.state.password,
			grant_type: 'password',
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
				console.log(response);
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	signUp() {
		let url = EndPoints.postSignUpUrl;
		let params = {
			username: this.state.username,
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
				console.log(response);
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	render() {
		return (
				<div id="app-onboarding">
					{this.state.loginPage ? (
						<div id="login-page"className="box-section">
						<h1 className="box-title">Log in</h1>
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
								id="password"
								label="Password"
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
								id="password"
								label="Password"
								value={this.state.password}
								onChange={this.handleChange('password')}
								margin="normal"
								className="onboarding-input"
							/>
						</div>
						<div className="onboarding-input-container">
							<TextField
								id="password"
								label="Retype password"
								value={this.state.retypePassword}
								onChange={this.handleChange('password')}
								margin="normal"
								className="onboarding-input"
							/>
						</div>
						<div className="onboarding-input-container">
							<Button onClick={this.signUp.bind(this)} variant="contained" color="primary" className="onboarding-btn">
								Sign Up
							</Button>
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

export default Onboarding;