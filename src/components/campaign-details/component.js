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

import CampaignProgress from '../campaign-progress/component';
import EmptyProfileImage from '../../assets/images/empty-profile-picture.svg';
import SocialFacebook from '../../assets/images/social/facebook.svg';
import SocialLinkedin from '../../assets/images/social/linkedin.svg';
import SocialTwitter from '../../assets/images/social/twitter.svg';

import { FacebookShareButton, LinkedinShareButton, TwitterShareButton  } from 'react-share';

import * as EndPoints from '../../utils/end-points';
import axios from 'axios';
import { withCookies, Cookies } from 'react-cookie';
import compose from 'recompose/compose';

import 'antd/dist/antd.css';
import "react-image-gallery/styles/css/image-gallery.css";
import './style.css';
import moment from 'moment';

import {Popover, Upload, Modal, Select, Form, DatePicker, Tooltip, Steps, message, Carousel, Table, Typography , Row, Tabs, Col, Input ,Divider, Switch, Layout, Timeline, Button,  Descriptions, Badge, Skeleton, Card, Icon, Progress, Tag } from 'antd';

const { TabPane } = Tabs;
const { Content, Footer } = Layout;
const { Meta } = Card;
const Search = Input.Search;
const { Paragraph } = Typography;
const { Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const InputGroup = Input.Group;

const { Option } = Select;

const confirm = Modal.success;

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

let id = 0;

const success = () => {
    message.success('Thank you for your donation', 5);
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showConfirm() {
    confirm({
        title: 'How much would you like to give?',
        centered: true,
        maskClosable: true,
        content: <div>
            <p>You have 150 HELP available</p>
            <Input
                size="large"
                placeholder="Enter the donation amount"
                prefix={<Icon type="pie-chart" style={{ color: 'rgba(0,0,0,.25)' }} />}
                suffix={
                    <Tooltip title="Extra information">
                        <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                    </Tooltip>
                }
            />
        </div>,
        okText: 'Donate',
        icon: <Icon type="smile" theme="twoTone"/>,
        onOk() {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, 3000);
            })
                .then(function(value){
                    success();
                })
                .catch(() => console.log('Oops errors!'));
        },
        onCancel() {},
    });
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class DynamicFieldSet extends React.Component {
    remove = k => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };

    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;
                console.log('Received values of form: ', values);
                console.log('Merged values:', keys.map(key => names[key]));
            }
        });
    };

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <Form.Item
                label={''}
                required={false}
                key={k}
            >
                {getFieldDecorator(`names[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: "Please add amount and description or delete this row.",
                        },
                    ],
                })(
                    <InputGroup size="default" style={{ width: '90%', marginRight: 8 }}>
                        <Row gutter={4} type="flex" justify="space-around" align="middle">
                            <Col span={6}>
                                <Input placeholder="Amount"
                                       prefix={<Icon type="pie-chart" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                />
                            </Col>
                            <Col span={18}>
                                <TextArea
                                    placeholder="Expense description"
                                    autosize={{ minRows: 1, maxRows: 3 }}/>
                            </Col>
                        </Row>
                    </InputGroup>

                )}
                {keys.length > 1 ? (
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove(k)}
                    />
                ) : null}
            </Form.Item>
        ));
        return (
            <Form onSubmit={this.handleSubmit}>
                {formItems}
                <Form.Item>
                    <Button type="dashed" onClick={this.add} style={{ width: '30%' }}>
                        <Icon type="plus" /> Add expense
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}


class CampaignDetails extends Component {
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
      isDonateScreenOpen: this.props.location.state ? (this.props.location.state.fromDonateScreen ? true : false) : false,
      amount: 0,
      thanksMessage: false,
      current: 0,
      visible: false
    };

      const showHeader = true;
      const pagination = { position: 'bottom' };

    this.tableState = {
            bordered: false,
            loading: false,
            pagination,
            size: 'small',
            expandedRowRender : undefined,
            showHeader,
            footer : undefined,
            scroll: undefined,
            hasData: true,
    };

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
      .catch(function(error) {
        console.log(error);
      });
  }



  toggleDonationScreen = () => {
    if(!this.isLoggedIn()) {
      this.props.history.push({
        pathname: '/onboarding/',
        state: { fromDonateScreen: true, campaignDetails: this.state.campaignDetails }
      })
    } else {
      this.setState(state => ({ isDonateScreenOpen: !this.state.isDonateScreenOpen }));
    }
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

      url = url.replace('{campaignId}', this.props.location.pathname.slice(18));

      axios.get(url, config)
        .then(response => {
          that.setState({
            campaignDetails: response.data
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
        this.setState({campaignDetails: response.data, thanksMessage: true});
        this.toggleDonationScreen();
        this.getFundraiserData();
      })
      .catch(function(error) {
        console.log(error);
      });
  }

    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }


  render(){
      const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(DynamicFieldSet);
      const { classes } = this.props;
      const { isDonateScreenOpen } = this.state;
      const campaignDetails = this.state.campaignDetails;
      const percentage = Math.trunc((campaignDetails.wallet.help.balance / campaignDetails.amount_goal) * 100);
      const progressStatus = percentage >= 100 ? "success" : "active"
      const daysLeft = Math.round(Math.abs((new Date(campaignDetails.start_date).getTime() - new Date(campaignDetails.end_date).getTime())/(24*60*60*1000)));
      const campaignUrl = 'www.beta.gohelpfund.com' + this.props.location.pathname;
      const sliderImages = [];

      const tableState = this.tableState;
      const { current } = this.state;

      const transactions = campaignDetails.wallet ? campaignDetails.wallet.help.transactions.map(transaction =>
          <div className="transactions-table-row">
              <div>{transaction.sender_name || 'Anonymus'}</div>
              <div className="transaction-address">{transaction.sender_address}</div>
              <div>{transaction.amount}</div>
              <div><a href={'http://insight.gohelpfund.com/insight/tx/' + transaction.blockchain_transaction_id} target="_blank">View transaction</a></div>
          </div>
      ) : [];

      const thanksMessage = this.state.thanksMessage ? <div className="thanks-message">Thank you for your donation!</div> : '';
      const emptyTransactions = campaignDetails.wallet && !campaignDetails.wallet.help.transactions.length ? <div className="empty-transactions">No transactions yet.</div> : '';

      const donationFundraiserHoverContent = (
          <div>
              <p align="center">Wallet address</p>
              <Text code copyable="true">Xtnagy4Fm8nQck9Qbx5RtDTHap4Y3okTGr</Text>
              &nbsp;
              <Button href={'http://insight.gohelpfund.com/insight/address/' + 'Xtnagy4Fm8nQck9Qbx5RtDTHap4Y3okTGr'} target="_blank"  size="small" type="dashed" shape="circle" icon="search" />
          </div>
      );

      const donationAmountHoverContent = (
          <div>
              <p align="center">Currency type</p>
              <Text code copyable="true">HELP Coin</Text>
              &nbsp;
              <Button href={'https://coinmarketcap.com/currencies/' + 'gohelpfund/'} target="_blank"   size="small" type="dashed" shape="circle" icon="search"   />

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

      const hasData = true;

      return (
          <Layout className="layout">
            <Content style={{ padding: '0 300px' }}>
            <div id="app-campaign-details">
                <Row gutter={16}>
                    <Col span={12}>
                        <Card
                                title={ <span style={{ fontSize: '20px', fontFamily: 'Microsoft YaHei', backgroundColor: '#d9f7be', color: "black", padding: 4 }}>{campaignDetails.title} </span>}
                              cover={
                                  <Carousel autoplay effect="fade" autoplaySpeed="50">
                                  <div>
                                      <img alt="example" src={ campaignDetails.media_resources[0].url } style={{ width: '630px'}}/>
                                  </div>
                                  <div>
                                      <img alt="example" src={ campaignDetails.media_resources[0].url } style={{ width: '630px'}}/>
                                  </div>
                                  <div>
                                      <img alt="example" src={ campaignDetails.media_resources[0].url } style={{ width: '630px'}}/>
                                  </div>
                                  <div>
                                      <img alt="example" src={ campaignDetails.media_resources[0].url } style={{ width: '630px'}}/>
                                  </div>
                              </Carousel>}
                              bordered={true}>
                            <Row type="flex" justify="center" align="middle" >
                                <Col span={6}>
                                    <Tag><Icon type="tags" /> {campaignDetails.category.name}</Tag>
                                </Col>
                                <Col span={6}>
                                    <Tag><Icon type="global" /> {campaignDetails.location} </Tag>
                                </Col>
                                <Col span={6}>
                                    <Tag ><Icon type="clock-circle" /> {daysLeft} days left</Tag>
                                </Col>
                                <Col span={6} >
                                    <Tag><Icon type="team" /> {campaignDetails.wallet.help.backers.length + 3} backers</Tag>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card bordered={true}>
                            <h3 align="center">Campaign details</h3>
                            <div style={{ margin: '32px 0' }}>
                                <Progress percent={ percentage }  status={progressStatus}/>
                            </div>
                            <Row type="flex" justify="space-around" align="middle">
                                <Col span={8}>
                                    <Button type="dashed" size="default">
                                        Raised: {numberWithCommas(campaignDetails.wallet.help.balance)} HELP
                                    </Button>
                                </Col>
                                <Col span={8}>
                                    <Button type="dashed" size="default">
                                        Goal: {numberWithCommas(campaignDetails.amount_goal)} HELP
                                    </Button>
                                </Col>
                            </Row>
                            <br/>
                            <Divider dashed  orientation="left">Share</Divider>

                            <Row type="flex" justify="space-around" align="middle">
                                <Col span={16}>
                                    <p>1 share = 1 USD</p>
                                    <p>in additional donations and engagement </p>
                                </Col>
                                <Col span={8}>
                                    <span className="icon-facebook" style={{fontSize: '32px', color: '#d9d9d9' }}/>
                                    <span className="icon-linkedin" style={{fontSize: '32px', color: '#d9d9d9',  margin: '0 8px'}}/>
                                    <span className="icon-twitter" style={{fontSize: '32px', color: '#d9d9d9'}}/>
                                </Col>
                            </Row>
                            <Divider dashed  orientation="left">Help</Divider>
                            <Row type="flex" justify="space-around" align="middle">
                                <Col span={16}>
                                    <p>If you only give once a month,</p>
                                    <p> please think of me next time.</p>
                                </Col>
                                <Col span={8}>
                                    <Button type="default" onClick={showConfirm}  size="large">
                                        <Icon  type="smile" theme="twoTone" twoToneColor="#52c41a"/>  Give
                                    </Button>

                                </Col>
                            </Row>

                        </Card>
                    </Col>
                </Row>
                <br/>
                <Row gutter={16}>
                    <Col span={16}>
                        <Card  bordered={true}>
                            <Tabs defaultActiveKey="1" size="large"  >
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
                                <TabPane  key="2" tab={<span><Icon type="pie-chart" theme="twoTone" />Expenses</span>}>
                                    <br/>
                                    <div>
                                        <Timeline mode="alternate">
                                            <Timeline.Item
                                                dot={<Icon type="check-circle" theme="twoTone" style={{ fontSize: '16px'}} twoToneColor="#52c41a"/>}
                                            >
                                                    <Button type="dashed">$500 - Books</Button>
                                            </Timeline.Item>
                                            <Timeline.Item
                                                dot={<Icon type="check-circle" theme="twoTone" style={{ fontSize: '16px'}} twoToneColor="#52c41a"/>}
                                            >
                                                <Button type="dashed">Furniture - $350</Button>
                                            </Timeline.Item>
                                            <Timeline.Item
                                                dot={<Icon type="check-circle" theme="twoTone" style={{ fontSize: '16px'}} twoToneColor="#52c41a"/>}
                                            >
                                                <Button type="dashed">$950 - Food</Button>
                                                </Timeline.Item>

                                            <Timeline.Item dot={<Icon type="loading"  />}>
                                                <Button type="dashed">Shoes - $320</Button>
                                                </Timeline.Item>

                                            <Timeline.Item
                                            >
                                                <Button type="dashed">$40 - Hat</Button>
                                                </Timeline.Item>
                                            <Timeline.Item

                                            >
                                                <Button type="dashed">Dress - $50</Button>
                                                </Timeline.Item>
                                        </Timeline>
                                    </div>
                            </TabPane>
                                <TabPane key="3" tab={<span><Icon type="smile" theme="twoTone" />Donations</span>}>
                                    <Table {...this.tableState}  columns={columns} dataSource={hasData ? data : null} />
                                </TabPane>
                            </Tabs>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card bordered={true}>
                            <div align="center">
                            <h3>Fundraiser </h3>

                                <Avatar style={{ width: '100px', height: '100px', border: '1px solid #e8e8e8' }} src={campaignDetails.fundraiser.profile_image_url}  />
                                <Text>INDIVIDUAL</Text>
                                <h2><Text code>{campaignDetails.fundraiser.name}</Text></h2>
                            </div>
                                <Divider dashed  orientation="left">Professional</Divider>
                                    <p>
                                    {campaignDetails.fundraiser.professional.job_title} @ {campaignDetails.fundraiser.professional.company_name}
                                    </p>
                                <Divider dashed  orientation="left">Social</Divider>
                                <div>
                                    <span className="icon-facebook" style={{fontSize: '32px', color: '#d9d9d9'}}/>
                                    <span className="icon-linkedin" style={{fontSize: '32px', color: '#d9d9d9',  margin: '0 8px'}}/>
                                    <span className="icon-twitter" style={{fontSize: '32px', color: '#d9d9d9'}}/>
                                </div>

                        </Card>
                    </Col>
                </Row>
            </div>
    </Content>
            <Footer style={{ textAlign: 'center' }}>GoHelpFund ©2019 Help causes that matter to you
            </Footer>
          </Layout>
    )
  }
}


CampaignDetails.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
  withCookies
)(CampaignDetails);