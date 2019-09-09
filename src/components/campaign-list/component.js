import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import QueueAnim from 'rc-queue-anim';
import axios from 'axios';

import {Col, Row} from 'antd';

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
    const groupSize = 3;

    const campaignList = this.state.campaignList.map((campaign, index) =>
      <Col key={index} xs={24} sm={12} md={8} span={24 / groupSize}>
        <Campaign className={classes.campaign} data={campaign}/>
      </Col>
    ).reduce(function(r, element, index) {
        // create element groups with size 3, result looks like:
        // [[elem1, elem2, elem3], [elem4, elem5, elem6], ...]
        index % groupSize === 0 && r.push([]);
        r[r.length - 1].push(element);
        return r;
    }, []).map(function(rowContent, index) {
        // surround every group with 'row'
        return <Row key={index} gutter={48}
                    style={{ padding: '30px' }}>
            {rowContent}
        </Row>;
    });

    return (
      <div style={{ padding: '30px' }}>
        <QueueAnim component="ul" type={['right', 'left']} leaveReverse>
          {campaignList}
        </QueueAnim>
      </div>

    );
  }
}

CampaignList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CampaignList);