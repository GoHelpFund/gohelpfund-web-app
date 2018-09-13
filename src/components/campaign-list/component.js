import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';

import Campaign from '../campaign/component';

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
    this.getCampaignList();
  }

  getCampaignList() {
    let url = 'http://dev-api.gohelpfund.com:5555/v1/campaigns';
    var that = this;
    axios.get(url)
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
        <Grid className={classes.grid} container spacing={24}>
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