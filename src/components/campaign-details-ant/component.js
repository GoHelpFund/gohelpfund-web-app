import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import classNames from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import ImageGallery from 'react-image-gallery';
import Zoom from '@material-ui/core/Zoom';
import TextField from '@material-ui/core/TextField';

import CampaignProgress from '../campaign-progress/component';
import EmptyProfileImage from '../../assets/images/empty-profile-picture.svg';
import SocialFacebook from '../../assets/images/social/facebook.svg';
import SocialLinkedin from '../../assets/images/social/linkedin.svg';
import SocialTwitter from '../../assets/images/social/twitter.svg';

import {FacebookShareButton, LinkedinShareButton, TwitterShareButton} from 'react-share';

import * as EndPoints from '../../utils/end-points';
import axios from 'axios';
import {withCookies, Cookies} from 'react-cookie';
import compose from 'recompose/compose';

import 'antd/dist/antd.css';
import "react-image-gallery/styles/css/image-gallery.css";
import './style.css';
import moment from 'moment';

import {
  Popover,
  Upload,
  Modal,
  Select,
  Form,
  DatePicker,
  Tooltip,
  Steps,
  message,
  Carousel,
  Table,
  Typography,
  Row,
  Tabs,
  Col,
  Input,
  Divider,
  Switch,
  Layout,
  Timeline,
  Button,
  Descriptions,
  Badge,
  Skeleton,
  Card,
  Icon,
  Progress,
  Tag
} from 'antd';
import QueueAnim from "rc-queue-anim";

const {TabPane} = Tabs;
const {Content, Footer} = Layout;
const {Meta} = Card;
const Search = Input.Search;
const {Paragraph} = Typography;
const {Text} = Typography;
const {RangePicker} = DatePicker;
const {TextArea} = Input;

const InputGroup = Input.Group;

const {Option} = Select;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  grid: {},
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

let id = 0;

class CampaignDetailsAnt extends Component {
  constructor(props) {
    super(props);

    let emptyCampaignDetails = {
      media_resources: [],
      fundraiser: {
        professional: {}
      }
    };

    this.state = {
      campaignDetails: this.props.location.state ? this.props.location.state.referrer : emptyCampaignDetails,
      amount: 0,
      current: 0,
      donateModalVisible: false,
      donateModalLoading: false,
      donationAmount: undefined,
      userBalance: undefined
    };

    const showHeader = true;
    const pagination = {position: 'bottom'};

    this.tableState = {
      bordered: false,
      loading: false,
      pagination,
      size: 'small',
      expandedRowRender: undefined,
      showHeader,
      footer: undefined,
      scroll: undefined,
      hasData: true,
    };

    this.progressData = {
      raisedGoal: this.state.campaignDetails.amount_goal,
      raisedTotal: this.state.campaignDetails.amount_raised
    };

    this.getCampaignData();
  }

  componentDidMount() {
    window.analytics.page('Campaign Details');
  }

  componentWillMount() {
    this.getFundraiserData();
  }

  numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  handleDonationChange = e => {
    const number = parseInt(e.target.value || 0, 10);
    if (Number.isNaN(number)) {
      return;
    }
    this.setState({
      [e.target.name]: number,
    });
  };

  isLoggedIn = () => {
    const {cookies} = this.props;
    let appToken = cookies.get('accessToken');

    return appToken ? true : false;
  };

  // return true if in range, otherwise false
  inRange = (x, min, max) => {
    return ((x - min) * (x - max) <= 0);
  };

  getFundraiserData() {
    let url = EndPoints.getFundraiserUrl;
    let appToken = localStorage.getItem('appToken');
    let config = {
      headers: {'Authorization': "Bearer " + appToken}
    };
    var that = this;

    url = url.replace('{fundraiserId}', localStorage.getItem('fundraiserId'));

    axios.get(url, config)
      .then(response => {
        that.setState({
          userBalance: response.data.wallet.help.balance
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  getCampaignData() {
    if (!this.props.location.state) {
      let url = EndPoints.getCampainByIdUrl;
      let appToken = localStorage.getItem('appToken');
      let config = {
        headers: {'Authorization': "Bearer " + appToken}
      };
      var that = this;

      url = url.replace('{campaignId}', this.props.location.pathname.slice(this.props.location.pathname.length - 36));

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

  showDonateModal = () => {
    this.setState({
      donateModalVisible: true
    });
  };

  handleDonateModalOk = e => {
    console.log(e);
    this.setState({
      donateModalLoading: true,
    });
    this.doDonate();
  };

  handleDonateModalCancel = e => {
    console.log(e);
    this.setState({
      donateModalVisible: false,
    });
  };

  doDonate() {
    const {cookies} = this.props;
    let appToken = cookies.get('accessToken');
    let url = EndPoints.postDonationUrl;
    let config = {
      headers: {'Authorization': "Bearer " + appToken}
    };
    let params = {
      amount: this.state.donationAmount
    };

    url = url.replace('{campaignId}', this.props.location.pathname.slice(this.props.location.pathname.length - 36));

    axios.post(url, params, config)
      .then(response => {
        console.log(response);
        message.success("Thank you for the donation.");
        this.setState({
          campaignDetails: response.data,
          donateModalVisible: false,
          donateModalLoading: false
        });
        this.getFundraiserData();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  next() {
    const current = this.state.current + 1;
    this.setState({current});
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({current});
  }

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
    const campaignDetails = this.state.campaignDetails;
    const amountRaised = campaignDetails.wallet.help.balance;
    const amountGoal = campaignDetails.amount_goal;

    const percentage = Math.trunc((amountRaised / amountGoal) * 100);
    const progressStatus = percentage >= 100 ? "success" : "active"
    const daysLeft = Math.round(Math.abs((new Date(campaignDetails.start_date).getTime() - new Date(campaignDetails.end_date).getTime()) / (24 * 60 * 60 * 1000)));

    const donationFundraiserHoverContent = (
      <div>
        <p align="center">Wallet address</p>
        <Text code copyable="true">Xtnagy4Fm8nQck9Qbx5RtDTHap4Y3okTGr</Text>
        &nbsp;
        <Button href={'http://insight.gohelpfund.com/insight/address/' + 'Xtnagy4Fm8nQck9Qbx5RtDTHap4Y3okTGr'}
                target="_blank" size="small" type="dashed" shape="circle" icon="search"/>
      </div>
    );

    const donationAmountHoverContent = (
      <div>
        <p align="center">Currency type</p>
        <Text code copyable="true">HELP Coin</Text>
        &nbsp;
        <Button href={'https://coinmarketcap.com/currencies/' + 'gohelpfund/'} target="_blank" size="small"
                type="dashed" shape="circle" icon="search"/>

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

    const realData = campaignDetails.wallet.help.transactions.map(t => {
      return {
        key: t.id,
        name: t.sender_name,
        amount: t.amount,
        date: moment(moment(t.date).utc(), "YYYY-MM-DD[T]HH:mm:ss[Z]").fromNow(),
        transaction_id: t.blockchain_transaction_id
      }
    });

    const data = [
      {
        key: '1',
        name: 'Daniel Tirzuman',
        amount: 15,
        date: '32 mins ago',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      },
      {
        key: '2',
        name: 'Daniel Nicolae',
        amount: 3,
        date: '39 mins ago',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      },
      {
        key: '3',
        name: 'Daniel Nicolae',
        amount: 3,
        date: '47 mins ago',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      },
      {
        key: '4',
        name: 'Daniel Nicolae',
        amount: 3,
        date: '1 hour ago',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      },
      {
        key: '5',
        name: 'Daniel Nicolae',
        amount: 3,
        date: '1h hour ago',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      },
      {
        key: '6',
        name: 'Daniel Nicolae',
        amount: 3,
        date: '2 hours ago',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      },
      {
        key: '7',
        name: 'Daniel Nicolae',
        amount: 3,
        date: '1 day ago',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      },
      {
        key: '8',
        name: 'Daniel Nicolae',
        amount: 3,
        date: '2 days ago',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      },
      {
        key: '9',
        name: 'Daniel Nicolae',
        amount: 3,
        date: '3 days ago',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      },
      {
        key: '10',
        name: 'Daniel Nicolae',
        amount: 3,
        date: '4 days ago',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      },
      {
        key: '11',
        name: 'Daniel Nicolae',
        amount: 3,
        date: '5 days ago',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      },
      {
        key: '12',
        name: 'Daniel Nicolae',
        amount: 3,
        date: '5 days ago',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      },
      {
        key: '13',
        name: 'Daniel Nicolae',
        amount: 3,
        date: '5 days ago',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      },
      {
        key: '14',
        name: 'Daniel Nicolae',
        amount: 3,
        date: '2019-05-22T18:58:57Z',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      },
      {
        key: '15',
        name: 'Daniel Nicolae',
        amount: 3,
        date: '2019-05-22T18:58:57Z',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      },
      {
        key: '16',
        name: 'Daniel NicolaeZ',
        amount: 3,
        date: '2019-05-22T18:58:57Z',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      },
      {
        key: '17',
        name: 'Daniel NicolaeZ',
        amount: 3,
        date: '2019-05-22T18:58:57Z',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      },
      {
        key: '18',
        name: 'Daniel NicolaeZ',
        amount: 3,
        date: '2019-05-22T18:58:57Z',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      },
      {
        key: '19',
        name: 'Daniel NicolaeZ',
        amount: 3,
        date: '2019-05-22T18:58:57Z',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      },
      {
        key: '20',
        name: 'Daniel NicolaeZ',
        amount: 3,
        date: '2019-05-22T18:58:57Z',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      },
      {
        key: '21',
        name: 'Daniel NicolaeZ',
        amount: 3,
        date: '2019-05-22T18:58:57Z',
        transaction_id: "ee70a38fb436cece5916b9e45ae7553fa4edeee0a0eabc77d208b0f002911e6f"
      }
    ];

    const hasData = campaignDetails.wallet.help.transactions.length !== 0;

    const expenseItems = campaignDetails.expenses.map((e, index, arr) => (
      <Timeline.Item
        key={index}
        dot={this.renderExpense(e, index, arr, amountRaised)}
      >
        <Button type="dashed">${e.amount} - {e.description}</Button>
      </Timeline.Item>
    ));

    const mediaResources = campaignDetails.media_resources.map((e, index, arr) => (
      <div key={index}>
        <img alt="example" src={e.url} style={{width: '630px'}}/>
      </div>
    ));

    const {donateModalVisible, donateModalLoading, donationAmount, userBalance} = this.state;
    const campaignUrl = 'www.beta.gohelpfund.com' + this.props.location.pathname;

    return (
      <Layout className="layout">
        <Content style={{padding: '0;'}}>
          <div id="app-campaign-details">
            <QueueAnim
              key="campaign-details"
              type={['right', 'left']}
              ease={['easeOutQuart', 'easeInOutQuart']}>
              <Row key="campaign-details-title" style={{marginBottom: '16px'}}>
                <Col span={24}>
                  <Card bordered={true} style={{textAlign: 'center'}}>
                    <span style={{
                      fontSize: '20px',
                      fontFamily: 'Microsoft YaHei',
                      padding: 4,
                    }}>{campaignDetails.title} </span>
                  </Card>
                </Col>
              </Row>
              <Row key="campaign-media-resources" gutter={16}>
                <Col xs={24} md={12} span={12}>
                  <Card
                    cover={
                      <Carousel autoplay effect="fade" autoplaySpeed="50">
                        {mediaResources}
                      </Carousel>}
                    bordered={true}>
                    <Row type="flex" justify="center" align="middle">
                      <Col span={6}>
                        <Tag><Icon type="tags"/> {campaignDetails.category.name}</Tag>
                      </Col>
                      <Col span={6}>
                        <Tag><Icon type="global"/> {campaignDetails.location} </Tag>
                      </Col>
                      <Col span={6}>
                        <Tag><Icon type="clock-circle"/> {daysLeft} days left</Tag>
                      </Col>
                      <Col span={6}>
                        <Tag><Icon type="team"/> {campaignDetails.wallet.help.backers.length} backers</Tag>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col xs={24} md={12} span={12}>
                  <Card bordered={true}>
                    <div style={{margin: '32px 0'}}>
                      <Progress percent={percentage} status={progressStatus}/>
                    </div>
                    <Row type="flex" justify="space-around" align="middle">
                      <Col span={8}>
                        <Button type="dashed" size="default">
                          Raised: {this.numberWithCommas(campaignDetails.wallet.help.balance)} HELP
                        </Button>
                      </Col>
                      <Col span={8}>
                        <Button type="dashed" size="default">
                          Goal: {this.numberWithCommas(campaignDetails.amount_goal)} HELP
                        </Button>
                      </Col>
                    </Row>
                    <br/>
                    <Divider dashed orientation="left">Share</Divider>
                    <Row>
                      <Col span={2} offset={9}>
                        <FacebookShareButton
                          url={campaignUrl}
                          quote={'Share campaign'}>
                          <Button type="link">
                            <span className="icon-facebook" style={{fontSize: '32px', color: '#d9d9d9'}}/>
                          </Button>
                        </FacebookShareButton>
                      </Col>
                      <Col span={2}>
                        <LinkedinShareButton
                          url={campaignUrl}
                          quote={'Share campaign'}>
                          <Button type="link">
                            <span className="icon-linkedin" style={{fontSize: '32px', color: '#d9d9d9'}}/>
                          </Button>
                        </LinkedinShareButton>
                      </Col>
                      <Col span={2}>
                        <TwitterShareButton
                          url={campaignUrl}
                          quote={'Share campaign'}>
                          <Button type="link">
                            <span className="icon-twitter" style={{fontSize: '32px', color: '#d9d9d9'}}/>
                          </Button>
                        </TwitterShareButton>
                      </Col>
                    </Row>
                    <Divider dashed orientation="left">Help</Divider>
                    <Row type="flex" justify="space-around" align="middle">
                      <Col span={8}>
                        <div>
                          <Button block type="primary" onClick={this.showDonateModal} size="large">
                            <Icon type="smile" theme="twoTone"/> Give
                          </Button>
                          <Modal
                            visible={donateModalVisible}
                            onOk={this.handleDonateModalOk}
                            onCancel={this.handleDonateModalCancel}
                            title='If you only give once a month, please think of me next time'
                            centered={true}
                            maskClosable="true"
                            footer={[
                              <Button key="submit" type="primary" loading={donateModalLoading}
                                      onClick={this.handleDonateModalOk}>
                                Donate
                              </Button>
                            ]}
                          >
                            <div>
                              <p>You have {userBalance} HELP available</p>
                              <Input
                                value={donationAmount}
                                style={{width: 300}}
                                size="large"
                                placeholder="Enter the donation amount"
                                name="donationAmount"
                                onChange={this.handleDonationChange}
                                prefix={<Icon type="pie-chart" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                suffix={
                                  <Tooltip title="Extra information">
                                    <Icon type="info-circle" style={{color: 'rgba(0,0,0,.45)'}}/>
                                  </Tooltip>
                                }
                              />
                            </div>
                          </Modal>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <br/>
              <Row key="campaign-details-info" gutter={16}>
                <Col xs={24} md={16} span={16}>
                  <Card bordered={true}>
                    <Tabs animated={false} defaultActiveKey="1" size="large">
                      <TabPane
                        tab={
                          <span>
          <Icon type="question-circle" theme="twoTone"/>
          Description
        </span>
                        }
                        key="1"
                      >
                        {campaignDetails.description}
                      </TabPane>
                      <TabPane key="2" tab={<span><Icon type="pie-chart" theme="twoTone"/>Expenses</span>}>
                        <br/>
                        <div>
                          <Timeline mode="alternate">
                            {expenseItems}
                          </Timeline>
                        </div>
                      </TabPane>
                      <TabPane key="3" tab={<span><Icon type="smile" theme="twoTone"/>Donations</span>}>
                        <Table {...this.tableState} columns={columns} dataSource={hasData ? realData : null}/>
                      </TabPane>
                    </Tabs>
                  </Card>
                </Col>
                <Col xs={24} md={8} span={8}>
                  <Card bordered={true}>
                    <div align="center">
                      <h3>Fundraiser </h3>

                      <Avatar style={{width: '100px', height: '100px', border: '1px solid #e8e8e8'}}
                              src={campaignDetails.fundraiser.profile_image_url}/>
                      <Text>INDIVIDUAL</Text>
                      <h2><Text code>{campaignDetails.fundraiser.name}</Text></h2>
                    </div>
                    <Divider dashed orientation="left">Professional</Divider>
                    <p>
                      {campaignDetails.fundraiser.professional.job_title} @ {campaignDetails.fundraiser.professional.company_name}
                    </p>
                    <Divider dashed orientation="left">Social</Divider>
                    <div>
                      <span className="icon-facebook" style={{fontSize: '32px', color: '#d9d9d9'}}/>
                      <span className="icon-linkedin" style={{fontSize: '32px', color: '#d9d9d9', margin: '0 8px'}}/>
                      <span className="icon-twitter" style={{fontSize: '32px', color: '#d9d9d9'}}/>
                    </div>

                  </Card>
                </Col>
              </Row>
            </QueueAnim>
          </div>
        </Content>
        <Footer style={{textAlign: 'center'}}>GoHelpFund ©2019 Help causes that matter to you
        </Footer>
      </Layout>
    )
  }
}


CampaignDetailsAnt.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
  withCookies
)(CampaignDetailsAnt);