import React, { Component } from 'react';
import './style.css';

import CampaignList from '../campaign-list/component';

class Home extends Component {
  render() {
    return (
      <div className="app-home">
        <CampaignList />
      </div>
    );
  }
}

export default Home;