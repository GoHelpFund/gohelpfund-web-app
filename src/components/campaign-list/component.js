import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';

import Campaign from '../campaign/component';
import * as EndPoints from '../../utils/end-points';

import './style.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  campaign: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  grid: {
    width: '100%',
    margin: 'auto'
  }
});


class CampaignList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      campaignList: []
    };
  }

  componentDidMount() {
    this.getAuthorizationToken();
  }

  getAuthorizationToken() {
    let url = EndPoints.getAuthorizationToken;
    let data = {
      grant_type: 'client_credentials',
	    scope: 'web-client'
    };
    let auth =  {
      auth: {
        username: 'gohelpfund',
        password: 'ghfsecret'
      }
    }
    var that = this;
    axios.post(url, data, auth)
      .then(response => {
        localStorage.setItem('appToken', response.data.access_token);
        that.getCampaignList();
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  getCampaignList() {
    let url = EndPoints.getCampainsUrl;
    let appToken = localStorage.getItem('appToken');
    let config = {
      headers: {'Authorization': "bearer " + appToken}
    };
    var that = this;
    axios.get(url, config)
      .then(response => {
        that.setState({
          campaignList: response.data.content
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }


  render() {
    const { classes } = this.props;

    const campaignList = this.state.campaignList.map(campaign => 
      <Grid item xs={12} sm={6} md={4} key={campaign.id}>
        <Campaign className={classes.campaign} data={campaign}/>
      </Grid>
    );

    return (
      <div id="app-campaign-list" className={classes.root}>
        <Grid className={classes.grid} container spacing={16}>
          {campaignList}
        </Grid>
      </div>
      
    );
  }
}

CampaignList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CampaignList);