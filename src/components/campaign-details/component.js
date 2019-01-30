import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import ImageGallery from 'react-image-gallery';

import CampaignProgress from '../campaign-progress/component';

import './style.css';
import "react-image-gallery/styles/css/image-gallery.css";

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
    width: 100,
    height: 100,
  },
});

class CampaignDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      campaignDetails: this.props.location.state ? this.props.location.state.referrer : {}
    }
    
    this.progressData = {
      raisedGoal: this.state.campaignDetails.amount_goal,
      raisedTotal: this.state.campaignDetails.amount_raised
    };
  }

  render() {
    const { classes } = this.props;
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
        <Grid className={classes.grid + ' section'} container spacing={8}>
          <Grid item xs={12} md={6} className="image-container">
            {/* <MediaGallery resources={campaignDetails.media_resources}/> */}
            <ImageGallery items={sliderImages} />
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.paper + ' details-section'}>
              <CampaignProgress progressData={this.progressData}/>
              <Grid className={classes.grid} container spacing={8}>
                <Grid item xs={12} md ={6}>
                  <div className="location">
                    {campaignDetails.location}
                  </div>
                </Grid>
                <Grid item xs={12} md ={6}>
                  <div className="time-left">
                      Just <span>{daysLeft}</span> days left to sustain this cause.
                    </div>
                </Grid>
                <Grid item xs={12} md ={6}>
                  <div className="category">
                    <img src={campaignDetails.category.image_url}/>
                      <span>{campaignDetails.category.name}</span>
                  </div>
                </Grid>
                <Grid item xs={12} md ={6}>
                  <Button variant="contained" color="primary" className="help-btn">
                    HELP now
                    {/* <Icon>send</Icon> */}
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
        <Grid className={classes.grid + ' section'} container spacing={8}>
          <Grid item xs={12}>
            <div className="about-section">
              <span className="title">{campaignDetails.title}</span>  
              <p className="description">{campaignDetails.description}</p>
            </div>

            <div className="author-section">
              <div><span className="title">Who posted and how the money will be used</span></div>
              <div className="author">
                <Avatar
                    alt={campaignDetails.fundraiser.name}
                    src={campaignDetails.fundraiser.profile_image_url}
                    className={classNames(classes.avatar, classes.bigAvatar)}
                  />
                <div className="details">
                  <div className="name">{campaignDetails.fundraiser.name}</div>
                  <div className="job">{campaignDetails.fundraiser.professional.jobTitle}</div>
                  <div className="company">@ {campaignDetails.fundraiser.professional.companyName}</div>
                </div>
              </div>
              <p className="description">{campaignDetails.expenses_description}</p>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

CampaignDetails.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CampaignDetails);