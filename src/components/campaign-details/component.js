import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import classNames from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import ImageGallery from 'react-image-gallery';
import Zoom from '@material-ui/core/Zoom';
import TextField from '@material-ui/core/TextField';
import { Tabs } from 'antd';

import CampaignProgress from '../campaign-progress/component';
import EmptyProfileImage from '../../assets/images/empty-profile-picture.svg';
import SocialFacebook from '../../assets/images/social/facebook.svg';
import SocialLinkedin from '../../assets/images/social/linkedin.svg';
import SocialTwitter from '../../assets/images/social/twitter.svg';

import * as EndPoints from '../../utils/end-points';
import axios from 'axios';
import { withCookies, Cookies } from 'react-cookie';
import compose from 'recompose/compose';

import 'antd/dist/antd.css';
import "react-image-gallery/styles/css/image-gallery.css";
import './style.css';

const TabPane = Tabs.TabPane;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  grid: {
  },
  img: {
    height: '100%'
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  avatar: {
    margin: 10,
    float: 'left'
  },
  bigAvatar: {
    width: 75,
    height: 75,
  },
});

class CampaignDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      campaignDetails: this.props.location.state ? this.props.location.state.referrer : {},
      isDonateScreenOpen: false,
      amount: 0
    }
    
    this.progressData = {
      raisedGoal: this.state.campaignDetails.amount_goal,
      raisedTotal: this.state.campaignDetails.amount_raised
    };

    this.getCampaignData();
  }

  toggleDonationScreen = () => {
    this.setState(state => ({ isDonateScreenOpen: !this.state.isDonateScreenOpen }));
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  callback(key) {
    console.log(key);
  }

  getCampaignData() {
    if(!this.props.location.state) {
      let url = EndPoints.getCampainByIdUrl;
      let appToken = localStorage.getItem('appToken');
      let config = {
        headers: {'Authorization': "Bearer " + appToken}
      };
      var that = this;

      url = url.replace('{campaignId}', 'saf');

      axios.get(url, config)
        .then(response => {
          that.setState({
            campaignDetails: response.data.content
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }

  donate() {
    const { cookies } = this.props;
    let appToken = cookies.get('accessToken');
    let url = EndPoints.postDonationUrl;
    let config = {
      headers: {'Authorization': "Bearer " + appToken}
    };
    let params = {
      amount: this.state.amount
    };

    url = url.replace('{campaignId}', this.props.location.pathname.slice(18));

    axios.post(url, params, config)
      .then(response => {
        console.log(response);
        this.toggleDonationScreen();
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    const { classes } = this.props;
    const { isDonateScreenOpen } = this.state;
    const campaignDetails = this.props.location.state ? this.props.location.state.referrer : {};
    const daysLeft = Math.round(Math.abs((new Date(campaignDetails.start_date).getTime() - new Date(campaignDetails.end_date).getTime())/(24*60*60*1000)));

    // const sliderImages = campaignDetails.media_resources ? campaignDetails.media_resources.map(resource => 
    //   <img src={resource.url} key={resource.id}></img>
    // ) : '';

    const sliderImages = [];

    campaignDetails.media_resources.forEach(element => {
      sliderImages.push({
        original: element.url,
        thumbnail: element.url,
      })
    });
    
    return (
      <div id="app-campaign-details" className={campaignDetails.media_resources.length === 1 ? 'root hide-nav' : 'root'}>
        <Grid className={classes.grid} container spacing={16}>
          <Grid item xs={12}>
            <section className="campaign-details-title">
              <span>{campaignDetails.title}</span>
            </section>
          </Grid>
          <Grid item xs={12} md={6}>
            <section className="campaign-details-gallery">
              <ImageGallery items={sliderImages} />
            </section>
          </Grid>
          <Grid item xs={12} md={6}>
            <section className="campaign-details-status">
              <div className="status-location">
                <span></span>
                <span>{campaignDetails.location}</span>
              </div>
              <div className="status-amount-raised">
                <span>${campaignDetails.amount_raised}</span>
              </div>
              <div className="clearfix"></div>
              <div className="status-days-left">
                <span><strong>{daysLeft}</strong> days left</span>
              </div>
              <div className="status-amount-needed">
                <span>of <strong>${campaignDetails.amount_goal}</strong> needed</span>
              </div>
              <div className="clearfix"></div>
              <div className="status-category">
                <span>Emergency</span>
              </div>
              <div className="status-donors">
                <span>raised from <strong>{campaignDetails.backers}</strong> people</span>
              </div>
              <div className="clearfix"></div>
              <div className="status-button">
                <button className="main-cta-btn" onClick={this.toggleDonationScreen.bind(this)}>HELP NOW</button>
              </div>

              <div className="status-share">
                <span className="icon-facebook"></span>
                <span className="icon-twitter"></span>
                <span className="icon-linkedin"></span>
                <span className="icon-favorite"></span>
                <span className="icon-link"></span>
              </div>

              

              <Zoom in={isDonateScreenOpen} className="campaign-details-donate">
                <Paper elevation={4} className={classes.paper}>
                  <span className="close-btn" onClick={this.toggleDonationScreen.bind(this)}>x</span>
                  <h3>How much would you like to give?</h3>
                  <div>
                    <TextField
                      id="amount-field"
                      placeholder="0"
                      value={this.state.amount}
                      onChange={this.handleChange('amount')}
                      // error={this.state.amount === '' && this.state.isNextPressed}
                      margin="normal"
                      className="step-input amount-input"
                    />
                    <span className="donate-currency">HELP</span>
                  </div>
                  <div className="donate-button">
                    <button className="secondary-cta-btn" onClick={this.donate.bind(this)}>DONATE</button>
                  </div>
                </Paper>
              </Zoom>
            </section>
           
          </Grid>
          <Grid item xs={12} md={8}>
            <section className="campaign-details-info">
              <Tabs defaultActiveKey="1" onChange={this.callback}>
                <TabPane tab="Description" key="1">
                  <p className="description">{campaignDetails.description}</p>
                </TabPane>
                <TabPane tab="Expenses" key="2">
                  <p className="description">{campaignDetails.expenses_description}</p>
                </TabPane>
                <TabPane tab="Transactions" key="3">
                  transactions
                </TabPane>
              </Tabs>
            </section>
          </Grid>
          <Grid item xs={12} md={4}>
            <section className="campaign-details-fundraiser">
              <div className="section-title">Fundraiser</div>
              <div className="fundraiser-image">
                <Avatar
                    alt={campaignDetails.fundraiser.name}
                    // src={campaignDetails.fundraiser.profile_image_url}
                    src={EmptyProfileImage}
                    className={classNames(classes.avatar, classes.bigAvatar)}
                  />
              </div>
              <div className="fundraiser-details">
                <div className="fundraiser-type">Individual</div>
                <div className="fundraiser-name">{campaignDetails.fundraiser.name}</div>
                <div className="fundraiser-job">{campaignDetails.fundraiser.professional.job_title} @ {campaignDetails.fundraiser.professional.company_name}</div>
              </div>
              <div className="clearfix"></div>
              <div className="fundraiser-social">
                <span className="icon-facebook"></span>
                <span className="icon-linkedin"></span>
                <span className="icon-twitter"></span>
                <span className="icon-email"></span>
              </div>
            </section>
          </Grid>
        </Grid>
      </div>
    );
  }
}

CampaignDetails.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
  withCookies
)(CampaignDetails);