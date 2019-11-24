import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';

import { Redirect, Route } from 'react-router';
import axios from 'axios';
import { CookiesProvider } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import * as EndPoints from './utils/end-points';
import Header from './components/header/component';
import Home from './components/home/component';
import CampaignDetails from './components/campaign-details/component';
import CampaignDetailsAnt from './components/campaign-details-ant/component';
import CreateCampaign from './components/create-campaign/component';
import CreateCampaignAnt from './components/create-campaign-ant/component';
import Onboarding from './components/onboarding/component';
import {Layout} from 'antd';
import { Endpoint } from 'aws-sdk';

const { Footer } = Layout;

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  
  constructor(props) {
    super(props);
    const { cookies } = this.props;
    global.accessToken = cookies.get('accessToken');
    this.state = {
      isLoggedIn: global.accessToken ? true : false
    }
    this.updateLoginState = this.updateLoginState.bind(this);
  }

  componentWillMount() {
    let url = EndPoints.getBtcRateUrl;

    axios.get(url)
    .then(response => {
      localStorage.setItem('btcRate', response.data.EUR.last);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  updateLoginState(isLoggedIn) {
    this.setState({isLoggedIn: isLoggedIn});
  }

  render() {
    return (
      <React.Fragment>
        <CookiesProvider>
          <CssBaseline />
          <Header isLoggedIn={this.state.isLoggedIn} updateLoginState={this.updateLoginState} />
          <div id="app-content">
            <Redirect to="/home" component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/campaign-details" component={CampaignDetails} />
            <Route path="/campaign-details-ant" component={CampaignDetailsAnt} />
            <Route path="/create-campaign" component={CreateCampaign} />
            <Route path="/create-campaign-ant" component={CreateCampaignAnt} />
            <Route path="/onboarding" render={(props) => <Onboarding {...props} updateLoginState={this.updateLoginState} />} />
          </div>
          <Footer>GoHelpFund ©2019</Footer>
        </CookiesProvider>
      </React.Fragment>
    );
  }
}

export default withCookies(App);
