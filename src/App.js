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
import LiveEvent from './components/live-event/component';
import LiveEventDisplay from './components/live-event-display/component';
import LiveEventAdmin from './components/live-event-admin/component';
import LiveEventSuccess from './components/live-event-success/component';

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

  updateLoginState(isLoggedIn) {
    this.setState({isLoggedIn: isLoggedIn});
  }

  render() {
    const liveEventsPage = window.location ? (window.location.pathname == '/live-event' || window.location.pathname == '/live-event-success' || window.location.pathname == '/live-event-display') : false;
    const header = !liveEventsPage ? <Header isLoggedIn={this.state.isLoggedIn} updateLoginState={this.updateLoginState} /> : '';
    return (
      <React.Fragment>
        <CookiesProvider>
          <CssBaseline />
          {header}
          <div id="app-content">
            {/* <Redirect to="/home" component={Home} /> */}
            <Route path="/home" component={Home} />
            <Route path="/campaign-details" component={CampaignDetails} />
            <Route path="/create-campaign" component={CreateCampaign} />
            <Route path="/onboarding" render={(props) => <Onboarding {...props} updateLoginState={this.updateLoginState} />} />
          </div>
          <Route path="/live-event" component={LiveEvent} />
          <Route path="/live-event-display" component={LiveEventDisplay} />
          <Route path="/live-event-admin" component={LiveEventAdmin} />
          <Route path="/live-event-success" component={LiveEventSuccess} />
        </CookiesProvider>
      </React.Fragment>
    );
  }
}

export default withCookies(App);
