import React, { Component } from 'react';
import './style.css';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Link } from 'react-router-dom';

const styles = {
  card: {
    boxShadow: 'none'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
};

class Campaign extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { classes } = this.props;
    const campaignData = this.props.data;
    const daysLeft = Math.round(Math.abs((new Date(campaignData.start_date).getTime() - new Date(campaignData.end_date).getTime())/(24*60*60*1000)));

    return (
      
      <div id="app-campaign">
        <Card className={classes.card + " campaign-card"}>
        <Link to={{
          pathname: "/campaign-details/" + campaignData.id,
          state: { referrer: this.props.data }
        }}>
          <CardMedia
            className={classes.media}
            image={campaignData.media_resources[0] ? campaignData.media_resources[0].url : ''}
            title={campaignData.title}
          />
        </Link>
        <CardContent className="campaign-content">
          <span className="title">
            <Link to={{
              pathname: "/campaign-details/" + campaignData.id,
              state: { referrer: this.props.data }
              }}>
              {campaignData.title}
            </Link>
          </span>  
          <span className="author">{campaignData.fundraiser.name}</span>
          <p className="description">{campaignData.description}</p>
        </CardContent>
        <div className="campaign-details">
          <span className="category"><img src={campaignData.category.image_url} alt=""/></span>
          <span className="time"><span className="value">{daysLeft}</span> days left</span>
          <span className="backers"><span className="value">{campaignData.backers}</span> backers</span>
          <span className="progress"><span className="value">{campaignData.amount_raised} %</span> raised</span>
        </div>
      </Card>
      </div>
    );
  }
}

Campaign.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Campaign);