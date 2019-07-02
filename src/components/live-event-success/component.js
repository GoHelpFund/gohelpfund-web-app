import React, { Component } from 'react';
import LiveEventDonate from '../live-event-donate/component';
import { withCookies, Cookies } from 'react-cookie';
import { Button  } from 'antd';

import SuccessIcon from '../../assets/images/live-event/success-icon.png';

import './style.css';

class LiveEventSuccess extends Component {
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

  goBack() {
    window.location.pathname = '/live-event';
  }

  render() {

    return(
      <div id="app-live-event-success">
          <div>
              <img src={SuccessIcon}/>
              <h1>Îți mulțumim!</h1>
              <h2>Vei primi un email cu detaliile necesare pentru a transfera donația.</h2>
              <h2>Împreună construim un viitor mai bun pentru zeci de copii în dificultate.</h2>
              <Button className="donate-btn" variant="contained" type="primary" onClick={this.goBack.bind(this)}>Donează din nou</Button>
          </div>
      </div>
    );
  }
}

export default withCookies(LiveEventSuccess);