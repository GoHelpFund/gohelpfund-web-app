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
			password: null
		}
	}

	handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

	signIn() {
	
	}

	signUp() {
		let url = EndPoints.postSignUpUrl;
		let params = {
			username: this.state.username,
			password: this.state.password
		};
		var that = this;
		axios.post(url)
			.then(response => {
				// that.setState({});
				console.log(response);
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	render() {
		return (
				<div id="app-onboarding">
					<div className="box-section">
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
							<Button onClick={this.signIn()} variant="contained" color="primary" className="onboarding-btn">
								Log in
							</Button>
						</div>
					</div>
				</div>
			);
	}
}

export default Onboarding;