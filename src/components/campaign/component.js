import React, { Component } from 'react';
import './style.css';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import { Switch, Timeline, Button,  Descriptions, Badge, Skeleton, Card, Icon, Progress, Avatar, Tag } from 'antd';
const { Meta } = Card;

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
    this.state = {
      loading: false
    }
  }

  onChange = checked => {
    this.setState({ loading: !checked });
  };


  render() {
    const { loading } = this.state;
    const { classes } = this.props;
    const campaignData = this.props.data;
    const percentage = campaignData.wallet.help.balance + 85;
    const progressStatus = percentage >= 100 ? "success" : "active"

    const daysLeft = Math.round(Math.abs((new Date(campaignData.start_date).getTime() - new Date(campaignData.end_date).getTime())/(24*60*60*1000)));

    return (

      <div id="app-campaign">
        <Switch checked={!loading} onChange={this.onChange} />
        <Skeleton loading={loading} active paragraph={{ rows: 7 }}>
          <div hidden={!loading}>
          </div>
        </Skeleton>

        <Skeleton loading={loading} avatar active paragraph={{ rows: 6 }}>
        <Link to={{
             pathname: "/campaign-details/" + campaignData.id,
             state: { referrer: this.props.data }
        }}>
        <Card key={campaignData.id}
              cover={
                !loading && <img
                    alt="Campaign Media Resources"
                    src={campaignData.media_resources[0].url}
                    className="wat"
                    width="350px"
                    height="250px"
                />
              }
              actions={[
                  <Tag color="geekblue">{campaignData.category.name}</Tag>,
                  <Tag color="geekblue">{daysLeft} days left</Tag>]
              }
        >
          <Meta
              avatar={<Avatar size={64} shape="circle" src={campaignData.fundraiser.profile_image_url} />}
              title={campaignData.title}
              description={campaignData.description.substring(0,75) + "..."}
          />
          <div style={{ margin: '16px 0' }}>
            <Progress percent={ percentage }  status={progressStatus}/>
          </div>
            <p align="center"><Button type="dashed" size="default">
                Raised: {campaignData.wallet.help.balance} HELP
            </Button>
            </p>
        </Card>
        </Link>
        </Skeleton>
      </div>
    );
  }
}

Campaign.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Campaign);