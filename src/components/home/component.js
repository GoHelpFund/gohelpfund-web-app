import React, { Component } from 'react';

import CampaignList from '../campaign-list/component';
import { Hero, ScrollDownIndicator } from 'react-landing-page';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import ScrollableAnchor from 'react-scrollable-anchor';

import Illustration from '../../assets/images/illustration.svg';

import './style.css';
import {Layout} from "antd";

const { Header, Content, Footer } = Layout;

class Home extends Component {

  componentDidMount() {
    // window.analytics.page('Home');
  }

  render() {
    let getHelpBtn = localStorage.getItem('fundraiserType') === 'organization' ? (<Link to="/create-campaign-ant">
                                                                                    <button className="secondary-cta-btn">Get Help</button>
                                                                                  </Link>) : '';
    return (
            <div id="app-home">
              <Hero
                color='white'
                bg='#F5F6FA'
                // backgroundImage={BackgroundImage}
                bgOpacity={0.1}
                pt={56}
              >
                <Grid container>
                  <Grid item xs={12} md={6}>
                    <div className="vertical-container">
                      <div className="vertical-content">
                        <h1>Transparent humanitarian fundraising</h1>
                        <h2>Help those in need and support causes that matter to you.</h2>

                        <div id="cta-section">
                        <a href="#app-campaign-list-container" >
                          <button className="main-cta-btn">Support causes</button>
                        </a>
                        {getHelpBtn}
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} className="illustration-container">
                    <img src={Illustration} />
                  </Grid>
                </Grid>
                <a href="#app-campaign-list-container" >
                  <ScrollDownIndicator />
                </a>
              </Hero>
              <ScrollableAnchor id={'app-campaign-list-container'}>
                <CampaignList />
                {/* <Footer style={{ textAlign: 'center' }}>GoHelpFund ©2019 Help causes that matter to you</Footer> */}
              </ScrollableAnchor>
            </div>
    );
  }
}

export default Home;