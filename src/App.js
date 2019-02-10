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
import CreateCampaign from './components/create-campaign/component';
import Onboarding from './components/onboarding/component';

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  
  constructor(props) {
    super(props);
    const { cookies } = this.props;
    global.accessToken = cookies.get('accessToken');
    console.log(global.accessToken);
  }

  render() {
    return (
      <React.Fragment>
        <CookiesProvider>
          <CssBaseline />
          <Header />
          <div id="app-content">
            <Route path="/home" component={Home}/>
            <Route path="/campaign-details" component={CampaignDetails}/>
            <Route path="/create-campaign" component={CreateCampaign}/>
            <Route path="/onboarding" component={Onboarding}/>
            {/* <Redirect from="/" to="home" /> */}
          </div>
        </CookiesProvider>
      </React.Fragment>
    );
  }
}

export default withCookies(App);
