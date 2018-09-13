import React, { Component } from 'react';
import logo from './logo.svg';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';

import { Redirect, Route } from 'react-router';

import Header from './components/header/component';
import Home from './components/home/component';
import CampaignDetails from './components/campaign-details/component';
import CreateCampaign from './components/create-campaign/component';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Header />
        <div id="app-content">
          <Route path="/home" component={Home}/>
          <Route path="/campaign-details" component={CampaignDetails}/>
          <Route path="/create-campaign" component={CreateCampaign}/>
          <Redirect from="/" to="home" />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
