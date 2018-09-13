import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import './style.css';

class CampaignProgress extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const progressData = this.props.progressData;
    progressData.percentage = 0;

    return (
      <div id="app-campaign-progress">
        <div className="amount">
          <span className="raised">{progressData.raisedTotal}$ </span>
          of
          <span className="goal"> {progressData.raisedGoal}$ </span>
          needed
        </div>
        <LinearProgress className="progress-bar" color="secondary" variant="determinate" value={progressData.percentage} />
        <div className="details">
          <span className="backers">donated by <span>0</span> people</span>
          <span className="percentage">{progressData.percentage}%</span>
        </div>
      </div>
    );
  }
}

export default CampaignProgress;
