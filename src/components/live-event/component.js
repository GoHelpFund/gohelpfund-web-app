import React, { Component } from 'react';
import LiveEventOnboarding from '../live-event-onboarding/component';
import LiveEventDonate from '../live-event-donate/component';
import { withCookies, Cookies } from 'react-cookie';

import './style.css';

class LiveEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentScreen: null
    }
  }

  isLoggedIn() {
    const { cookies } = this.props;
    return cookies.get('accessToken') ? true : false;
  }

  nextStep() {

  }

  render() {
    const isLoggedIn = this.isLoggedIn();
    // const LiveEventWelcome = <div onClick={this.state.nextStep.bind(this)}>welcome screen</div>;
    let currentScreen = isLoggedIn ? <LiveEventDonate /> : <LiveEventOnboarding />;

    return(
      <div id="app-live-event">
        {currentScreen}
      </div>
    );
  }
}

export default withCookies(LiveEvent);