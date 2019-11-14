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
import copy from 'copy-to-clipboard';
import QRCode from 'qrcode.react';

import CampaignProgress from '../campaign-progress/component';
import EmptyProfileImage from '../../assets/images/empty-profile-picture.svg';
import SocialFacebook from '../../assets/images/social/facebook.svg';
import SocialLinkedin from '../../assets/images/social/linkedin.svg';
import SocialTwitter from '../../assets/images/social/twitter.svg';

import { Card, Divider, Typography, Row, Col, Icon, Table, Timeline, Popover, Button, Tag } from 'antd';

import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';
import moment from 'moment';

import * as EndPoints from '../../utils/end-points';
import axios from 'axios';
import { withCookies, Cookies } from 'react-cookie';
import compose from 'recompose/compose';

import 'antd/dist/antd.css';
import "react-image-gallery/styles/css/image-gallery.css";
import './style.css';

const { Text } = Typography;

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

    let emptyCampaignDetails = {
      media_resources: [],
      fundraiser: {
        professional: {}
      }
    }

    this.state = {
      campaignDetails: this.props.location.state ? this.props.location.state.referrer : emptyCampaignDetails,
      isDonateScreenOpen: this.props.location.state ? (this.props.location.state.fromDonateScreen ? true : false) : false,
      amount: 0,
      thanksMessage: false,
      amountValidation: false
    }

    this.progressData = {
      raisedGoal: this.state.campaignDetails.amount_goal,
      raisedTotal: this.state.campaignDetails.amount_raised
    };

    this.getCampaignData();
  }

  componentWillMount() {
    this.getFundraiserData();
  }

  isLoggedIn = () => {
    const { cookies } = this.props;
    let appToken = cookies.get('accessToken');

    return appToken ? true : false;
  }

  getFundraiserData() {
    let url = EndPoints.getFundraiserUrl;
    let appToken = localStorage.getItem('appToken');
    let config = {
      headers: { 'Authorization': "Bearer " + appToken }
    };
    var that = this;

    url = url.replace('{fundraiserId}', localStorage.getItem('fundraiserId'));

    axios.get(url, config)
      .then(response => {
        that.setState({
          userBalance: response.data.wallet.bitcoin.balance
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  inRange = (x, min, max) => {
    return ((x - min) * (x - max) <= 0);
  };

  renderExpense = (e, index, arr, amountRaised) => {
    let prevPartialAmount = 0;

    for (let i = 0; i < index; i++) {
      prevPartialAmount += arr[i].amount;
    }
    let nextPartialAmount = prevPartialAmount + arr[index].amount;
    const isInRange = this.inRange(amountRaised, prevPartialAmount, nextPartialAmount);

    if (isInRange === true && amountRaised !== nextPartialAmount) {
      return (<Icon type="loading" />)
    } else if (prevPartialAmount <= amountRaised) {
      return (<Icon type="check-circle" theme="twoTone" style={{ fontSize: '16px' }}
        twoToneColor="#52c41a" />)
    } else {
      return null;
    }
  };

  toggleDonationScreen = () => {
    // if(!this.isLoggedIn()) {
    //   this.props.history.push({
    //     pathname: '/onboarding/',
    //     state: { fromDonateScreen: true, campaignDetails: this.state.campaignDetails }
    //   })
    // } else {
    //   this.setState(state => ({ isDonateScreenOpen: !this.state.isDonateScreenOpen }));
    // }

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
    if (!this.props.location.state) {
      let url = EndPoints.getCampainByIdUrl;
      let appToken = localStorage.getItem('appToken');
      let config = {
        headers: { 'Authorization': "Bearer " + appToken }
      };
      var that = this;

      url = url.replace('{campaignId}', this.props.location.pathname.slice(18));

      axios.get(url, config)
        .then(response => {
          that.setState({
            campaignDetails: response.data
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  donate() {
    if (this.state.amount > this.state.userBalance) {
      this.setState({ amountValidation: true });
      return;
    }

    const { cookies } = this.props;
    let appToken = cookies.get('accessToken');
    let url = EndPoints.postDonationUrl;
    let config = {
      headers: { 'Authorization': "Bearer " + appToken }
    };
    let params = {
      amount: this.state.amount
    };

    url = url.replace('{campaignId}', this.props.location.pathname.slice(18));

    axios.post(url, params, config)
      .then(response => {
        this.setState({ campaignDetails: response.data, thanksMessage: true });
        this.toggleDonationScreen();
        this.getFundraiserData();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  copyToClipboard() {
    copy(this.state.campaignDetails.wallet.bitcoin.address);
  }

    // return true if in range, otherwise false
    inRange = (x, min, max) => {
      return ((x - min) * (x - max) <= 0);
    };

  renderExpense = (e, index, arr, amountRaised) => {
    let prevPartialAmount = 0;

    for (let i = 0; i < index; i++) {
      prevPartialAmount += arr[i].amount;
    }
    let nextPartialAmount = prevPartialAmount + arr[index].amount;
    const isInRange = this.inRange(amountRaised, prevPartialAmount, nextPartialAmount);

    if (isInRange === true && amountRaised !== nextPartialAmount) {
      return (<Icon type="loading"/>)
    } else if (prevPartialAmount <= amountRaised) {
      return (<Icon type="check-circle" theme="twoTone" style={{fontSize: '16px'}}
                    twoToneColor="#52c41a"/>)
    } else {
      return null;
    }
  };

  render() {
    const { classes } = this.props;
    const { isDonateScreenOpen } = this.state;
    const campaignDetails = this.state.campaignDetails;
    const daysLeft = Math.round(Math.abs((new Date(campaignDetails.start_date).getTime() - new Date(campaignDetails.end_date).getTime()) / (24 * 60 * 60 * 1000)));
    const campaignUrl = 'www.beta.gohelpfund.com' + this.props.location.pathname;
    const sliderImages = [];
    const amountRaised = campaignDetails.wallet.bitcoin.balance;
    const bitcoinAddress = campaignDetails.wallet.bitcoin.address;

    // const transactions = campaignDetails.wallet ? campaignDetails.wallet.bitcoin.transactions.map(transaction =>
    //   <div className="transactions-table-row">
    //     <div>{transaction.sender_name || 'Anonymus'}</div>
    //     <div className="transaction-address">{transaction.sender_address}</div>
    //     <div>{transaction.amount}</div>
    //     <div><a href={'http://insight.gohelpfund.com/insight/tx/' + transaction.blockchain_transaction_id} target="_blank">View transaction</a></div>
    //   </div>
    // ) : [];

    const thanksMessage = this.state.thanksMessage ? <div className="thanks-message">Thank you for your donation!</div> : '';
    // const emptyTransactions = campaignDetails.wallet && !campaignDetails.wallet.bitcoin.transactions.length ? <div className="empty-transactions">No transactions yet.</div> : '';

    const amountValidation = this.state.amountValidation ? <div className="amount-validation">You don't have enough HELP.</div> : '';

    campaignDetails.media_resources.forEach(element => {
      sliderImages.push({
        original: element.url,
        thumbnail: element.url,
      })
    });

    const donationFundraiserHoverContent = (
      <div>
        <p align="center">Wallet address</p>
        <Text code copyable="true">Xtnagy4Fm8nQck9Qbx5RtDTHap4Y3okTGr</Text>
        &nbsp;
        <Button href={'http://insight.gohelpfund.com/insight/address/' + 'Xtnagy4Fm8nQck9Qbx5RtDTHap4Y3okTGr'}
          target="_blank" size="small" type="dashed" shape="circle" icon="search" />
      </div>
    );

    const donationAmountHoverContent = (
      <div>
        <p align="center">Currency type</p>
        <Text code copyable="true">HELP Coin</Text>
        &nbsp;
        <Button href={'https://coinmarketcap.com/currencies/' + 'gohelpfund/'} target="_blank" size="small"
          type="dashed" shape="circle" icon="search" />

      </div>
    );

    const columns = [
      {
        title: 'Giver',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <span>
            <Popover content={donationFundraiserHoverContent} trigger="hover">
              <Button size="small" type="dashed">{record.name}</Button>
            </Popover>
          </span>
        )
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (text, record) => (
          <Popover content={donationAmountHoverContent} trigger="hover">
            <Tag color="geekblue">{record.amount}</Tag>
          </Popover>
        )
      },
      {
        title: 'Proof',
        key: 'action',
        render: (text, record) => (
          <span>
            <a href={'http://insight.gohelpfund.com/insight/tx/' + record.transaction_id} target="_blank">View Donation</a>
          </span>
        ),
      },
    ];

    // const realData = campaignDetails.wallet.bitcoin.transactions.map(t => {
    //   return {
    //     key: t.id,
    //     name: t.sender_name,
    //     amount: t.amount,
    //     date: moment(moment(t.date).utc(), "YYYY-MM-DD[T]HH:mm:ss[Z]").fromNow(),
    //     transaction_id: t.blockchain_transaction_id
    //   }
    // });

    // const hasData = campaignDetails.wallet.bitcoin.transactions.length !== 0;

    const expenseItems = campaignDetails.expenses.map((e, index, arr) => (
      <Timeline.Item
        key={index}
        dot={this.renderExpense(e, index, arr, amountRaised)}
      >
        <Button type="dashed">{e.amount} - {e.description} BTC</Button>
      </Timeline.Item>
    ));

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
                <span>{campaignDetails.wallet ? campaignDetails.wallet.bitcoin.balance : 0} BTC</span>
              </div>
              <div className="clearfix"></div>
              <div className="status-days-left">
                <span><strong>{daysLeft}</strong> days left</span>
              </div>
              <div className="status-amount-needed">
                <span>of <strong>{campaignDetails.amount_goal} BTC</strong> needed</span>
              </div>
              <div className="clearfix"></div>
              <div className="status-category">
                <img src={campaignDetails.category.image_url}></img>
                <span>Emergency</span>
              </div>
              <div className="status-donors">
                <span>raised from <strong>{campaignDetails.backers}</strong> people</span>
              </div>
              <div className="clearfix"></div>
              {thanksMessage}
              <div className="status-button">
                <button className="main-cta-btn" onClick={this.toggleDonationScreen.bind(this)}>HELP NOW</button>
              </div>

              <div className="status-share">
                <FacebookShareButton
                  url={campaignUrl}
                  quote={'Share campaign'}>
                  <span className="icon-facebook"></span>
                </FacebookShareButton>
                <LinkedinShareButton
                  url={campaignUrl}
                  quote={'Share campaign'}>
                  <span className="icon-linkedin"></span>
                </LinkedinShareButton>
                <TwitterShareButton
                  url={campaignUrl}
                  quote={'Share campaign'}>
                  <span className="icon-twitter"></span>
                </TwitterShareButton>
              </div>



              <Zoom in={isDonateScreenOpen} className="campaign-details-donate">
                <Paper elevation={4} className={classes.paper}>
                  {/* <span className="close-btn" onClick={this.toggleDonationScreen.bind(this)}>x</span> */}
                  <Icon className="close-btn" onClick={this.toggleDonationScreen.bind(this)} type="close" />
                  <h2>Send your BTC to the following address:</h2>
                  <QRCode value={bitcoinAddress} className="qrcode"/>
                  <div className="btc-address">
                    <h1><Text code>{bitcoinAddress}</Text></h1>
                    <Icon type="copy" className="clipboard" onClick={this.copyToClipboard.bind(this)}/>
                  </div>
                  {amountValidation}
                  <div className="donate-button">
                    <button className="secondary-cta-btn" onClick={this.toggleDonationScreen.bind(this)}>DONE</button>
                  </div>
                </Paper>
              </Zoom>
              {/* <Zoom in={isDonateScreenOpen} className="campaign-details-donate">
                <Paper elevation={4} className={classes.paper}>
                  <span className="close-btn" onClick={this.toggleDonationScreen.bind(this)}>x</span>
                  <h2>How much would you like to give?</h2>
                  <h3>You have {this.state.userBalance} HELP available.</h3>
                  <div>
                    <TextField
                      id="amount-field"
                      placeholder="0"
                      type="number"
                      value={this.state.amount}
                      onChange={this.handleChange('amount')}
                      // error={this.state.amount === '' && this.state.isNextPressed}
                      margin="normal"
                      className="step-input amount-input"
                    />
                    <span className="donate-currency">HELP</span>
                  </div>
                  {amountValidation}
                  <div className="donate-button">
                    <button className="secondary-cta-btn" onClick={this.donate.bind(this)}>DONATE</button>
                  </div>
                </Paper>
              </Zoom> */}
            </section>

          </Grid>
          <Grid item xs={12} md={8}>
            <section className="campaign-details-info">
              <Tabs animated={false} defaultActiveKey="1" size="large">
                <TabPane
                  tab={
                    <span>
                      <Icon type="question-circle" theme="twoTone" />
                      Description
                        </span>
                  }
                  key="1"
                >
                  {campaignDetails.description}
                </TabPane>
                <TabPane key="2" tab={<span><Icon type="pie-chart" theme="twoTone" />Expenses</span>}>
                  <br />
                  <div>
                    <Timeline mode="alternate">
                      {expenseItems}
                    </Timeline>
                  </div>
                </TabPane>
                {/* <TabPane key="3" tab={<span><Icon type="smile" theme="twoTone" />Donations</span>}>
                  <Table {...this.tableState} columns={columns} dataSource={hasData ? realData : null} />
                </TabPane> */}
              </Tabs>
            </section>
          </Grid>
          <Grid item xs={12} md={4}>
            <section className="campaign-details-fundraiser">
              <div align="center">
                <Text>ORGANIZATION</Text>
                <Avatar className="fundraiser-image" src={campaignDetails.fundraiser.profile_image_url} />
                <h2><Text>{campaignDetails.fundraiser.name}</Text></h2>
              </div>
              <div className="fundraiser-social">
                <a href={campaignDetails.fundraiser.social.facebook} target="_blank" className="icon-facebook"/>
                <a href={campaignDetails.fundraiser.social.linkedin} target="_blank" className="icon-linkedin"/>
                <a href={campaignDetails.fundraiser.social.twitter} target="_blank" className="icon-twitter"/>
              </div>
              <div className="fundraiser-web"><a href={campaignDetails.fundraiser.social.website} target="_blank">{campaignDetails.fundraiser.social.website}</a></div>
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
