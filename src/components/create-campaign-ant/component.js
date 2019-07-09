import compose from 'recompose/compose';
import React, {Component, isValidElement} from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import {Link} from "react-router-dom";

import './style.css';
import {Button, Col, Form, Icon, Layout, message, Row, Steps, notification} from 'antd';

import AWS from 'aws-sdk';
import Category from './steps/category/component';
import Description from './steps/description/component';
import Expenses from './steps/expenses/component';
import DateLocation from './steps/datelocation/component';
import MediaGallery from './steps/mediagallery/component';
import * as EndPoints from "../../utils/end-points";
import axios from "axios";
import moment from 'moment';
import {withCookies} from "react-cookie";

const {Content, Footer} = Layout;

class CreateCampaignAnt extends Component {
  popperNode = null;

  constructor(props) {
    super(props);

    this.messageConfig(1);
    this.state = {
      currentStep: 0,
      uploadInfo: undefined,
      stepsStatus: [
        {
          category: ''
        },
        {
          title: '',
          description: ''
        },
        [
          {
            amount: '',
            description: ''
          }
        ],
        {
          dateInterval: '',
          location: ''
        },
        {
          profileImage: ''
        }
      ],
      publishLoading: false,

      category: undefined,
      categoryData: undefined,

      title: undefined,
      description: undefined,

      expenses: [{}],
      expensesForm: undefined,

      startDate: undefined,
      endDate: undefined,
      location: undefined,

      fileList: [],
      profileImage: undefined
    };
  }

  messageConfig = maxCount => {
    message.config({
      maxCount: maxCount,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
      }
    });
  };

  handleFileListChange = (fileList) => {
    this.setState({
      fileList: fileList
    })
  };

  handleProfileImageChange = (selectedItem, status) => {
    this.setState({
      profileImage: selectedItem
    })
    this.updateStepStatus(4, 'profileImage', status);
  };

  handleExpensesChange = (dynamicExpenses, status, dynamicForm) => {
    this.setState({
      expenses: dynamicExpenses,
      expensesForm: dynamicForm
    });
    this.updateStepStatus(2, null, status);
  };

  handleDateChange = (startDate, endDate, status) => {
    this.setState({
      startDate: startDate,
      endDate: endDate
    })
    this.updateStepStatus(3, 'dateInterval', status);
  };

  handleLocationChange = (event, status) => {
    if (event.target !== undefined) {
      this.setState({
        [event.target.name]: event.target.value
      });
      this.updateStepStatus(3, event.target.name, status);
    }
  };

  handleCategoryChange = (category, status) => {
    this.setState({
      category: category
    });
    this.setCategoryData(category.key);
    this.updateStepStatus(0, 'category', status);
  };

  handleDescriptionChange = (event, status) => {
    if (event.target !== undefined) {
      this.setState({
        [event.target.name]: event.target.value
      });
      this.updateStepStatus(1, event.target.name, status);
    }
  };

  updateStepStatus = (step, property, status) => {
    let items = this.state.stepsStatus;
    // 2. Make a shallow copy of the item you want to mutate
    let item = {...items[step]};
    // 3. Replace the property you're intested in
    if (step === 2) {
      item = status;
    } else {
      item[property] = status;
    }
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    items[step] = item;
    // 5. Set the state to our new copy
    this.setState({
      stepsStatus: items
    })
  };

  nextStep = event => {
    const {currentStep, stepsStatus} = this.state;
    const obj = stepsStatus[currentStep];

    this.isValidStep(currentStep) ? this.proceed(currentStep) : this.invalidate(currentStep);
  };

  prevStep = event => {
    const currentStep = this.state.currentStep - 1;
    this.setState({currentStep});
  };

  isValidStep = currentStep => {
    const {stepsStatus} = this.state;
    const obj = stepsStatus[currentStep];

    let valid = false;
    if (currentStep === 2) {
      valid = obj.every((el, index, array) => {
        let v = Object.keys(el).map(k => el[k]).every((val, i, arr) => val === 'success');
        return v === true;
      });
    } else {
      if (Object.keys(obj).map(k => obj[k]).every((val, i, arr) => val === 'success')) {
        valid = true;
      }
    }
    return valid;
  };

  proceed = currentStep => {
    switch (currentStep) {
      case 3:
        this.messageConfig(2);
        this.proceedShow(currentStep);
        break;
      case 4:
        this.getUploadInfo();
        break;
      default:
        this.proceedShow(currentStep);
        break;
    }
  };

  proceedShow = currentStep => {
    this.setState({
      show: !this.state.show,
      currentStep: currentStep + 1
    });
  };

  invalidate = currentStep => {
    switch (currentStep) {
      case 0:
        message.error('Please select category', 2);
        break;
      case 1:
        message.error('Please add title and description', 2);
        break;
      case 2:
        message.error('Please add amount and description to all expenses', 2);
        break;
      case 3:
        message.error('Please select date interval and location', 2);
        break;
      case 4:
        message.error('Please select the campaign profile image', 2);
        break;
      default:
        break;
    }

  };

  getUploadInfo = () => {
    this.setState({
      publishLoading: true
    });
    this.messageConfig(1);
    message.loading('Publishing in progress..', 10);

    let url = EndPoints.getUploadInfoUrl;
    const {cookies} = this.props;
    let appToken = cookies.get('accessToken');

    let config = {
      headers: {'Authorization': "Bearer " + appToken}
    };

    axios.get(url, config)
      .then(response => {
        this.setState({
          uploadInfo: response.data
        });
        this.completeSteps();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  setCategoryData = (id) => {
    let url = EndPoints.getCategoryByIdUrl;
    let appToken = localStorage.getItem('appToken');

    let config = {
      headers: {'Authorization': "Bearer " + appToken}
    };
    var that = this;

    url = url.replace('{categoryId}', id);

    axios.get(url, config)
      .then(response => {
        this.setState({
          categoryData: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  completeSteps = () => {
    const {uploadInfo, fileList, profileImage} = this.state;

    AWS.config.update({region: uploadInfo.bucket_region});
    AWS.config.credentials = new AWS.Credentials({
      accessKeyId: uploadInfo.access_key_id,
      secretAccessKey: uploadInfo.access_key_secret,
      region: uploadInfo.bucket_region
    });

    const S3 = new AWS.S3({params: {Bucket: uploadInfo.bucket_name}});

    var imageCount = fileList.length;
    var uploadedImages = [];
    let that = this;

    for (var counter = 0; counter < imageCount; counter++) {

      const file = fileList[counter];
      const params = {
        Key: file.name,
        ContentType: file.type,
        Body: file.originFileObj,
        ACL: 'public-read'
      };
      S3.upload(params, (err, data) => {
        if (err) {
          console.log('error S3', err);
          return alert(err);
        }

        const imageData = {
          "format": 'image/' + data.Key.split('.')[1],
          "name": data.Key,
          "url": data.Location,
          "type": "image",
          "avatar": file.uid === profileImage
        };

        message.loading('Uploading images in progress..', 10);

        uploadedImages.push(imageData);
        if (uploadedImages.length === imageCount) {
          that.postCampaign(uploadedImages);
        }
      });
    }

  };

  postCampaign = (uploadedImages) => {
    const {category, categoryData, title, description, expenses, startDate, endDate, location, fileList, profileImage} = this.state;
    const {cookies} = this.props;
    let appToken = cookies.get('accessToken');

    let url = EndPoints.postCampainsUrl;
    let config = {
      headers: {'Authorization': "Bearer " + appToken}
    };
    let defaultImage = {
      "format": "jpeg",
      "name": "CF8E3EB7-37F1-40A9-8BBD-DD6CEB4E98A4.jpeg",
      "url": "https://s3.eu-central-1.amazonaws.com/gohelpfund-resources/categories/charity.png",
      "type": "image"
    };
    let amount_goal = 0;
    expenses.forEach((item) => {
      amount_goal += parseInt(item.amount);
    });

    const campaignData = {
      "category": categoryData,

      "title": title,
      "description": description,

      "amount_goal": parseInt(amount_goal),
      "expenses": expenses,

      "start_date": startDate.utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
      "end_date": endDate.utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
      "location": location,

      "media_resources": uploadedImages ? uploadedImages : [defaultImage]
    };
    let that = this;

    this.setState({
      publishLoading: false
    });
    message.success('Campaign created successfully', 2);
    notification.success({
      message: 'Campaign created successfully',
      description:
        '',
      icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
      placement : 'bottomLeft',
      duration: 6
    });

    axios.post(url, campaignData, config)
      .then(response => {
        that.props.history.push({
          pathname: '/home',
          state: {referrer: response.data}
        })
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  render() {
    const {Step} = Steps;
    const steps = [
      {
        title: 'Category',
        id: 'category',
        icon_type: "tags",
        description: "choose the category that best fits your campaign",
        render: () => (
          <Category
            handleChange={this.handleCategoryChange}
            category={this.state.category}
          />
        )
      },
      {
        title: 'Description',
        id: 'description',
        icon_type: "question-circle",
        description: "what problem do you have?",
        render: () => (
          <Description
            handleChange={this.handleDescriptionChange}
            title={this.state.title}
            description={this.state.description}
          />
        )
      },
      {
        title: 'Expenses',
        id: 'expenses',
        icon_type: "pie-chart",
        description: "How much money do you need and how will you use it?",
        render: () => (
          <Expenses
            handleChange={this.handleExpensesChange}
            expenses={this.state.expenses}
            expensesForm={this.state.expensesForm}
          />
        )
      },
      {
        title: 'Date & Location',
        id: 'datelocation',
        icon_type: "clock-circle",
        description: "When and where?",
        render: () => (
          <DateLocation
            handleDateChange={this.handleDateChange}
            handleLocationChange={this.handleLocationChange}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            location={this.state.location}
          />
        )
      },
      {
        title: 'Media gallery',
        id: 'mediagallery',
        icon_type: "file-image",
        description: "Upload images that could give a better understanding of the cause",
        render: () => (
          <MediaGallery
            handleFileListChange={this.handleFileListChange}
            handleProfileImageChange={this.handleProfileImageChange}
            fileList={this.state.fileList}
            selectedItem={this.state.profileImage}
          />
        )
      }
    ];
    const {currentStep, stepsStatus, publishLoading} = this.state;

    return (
      <Layout className="layout">
        <Content style={{height: "calc(100vh - 70px)"}}>
          <QueueAnim className="demo-content"
                     type={['right', 'left']}
                     ease={['easeOutQuart', 'easeInOutQuart']}>
            <div key='wat' id="app-create-campaign-ant">
              <Steps current={currentStep}>
                {steps.map(item => (
                  <Step key={item.title} title={item.title} icon={<Icon type={item.icon_type}/>}/>
                ))}
              </Steps>
              <div key='steps-content' id="steps-content">
                {steps[currentStep].render()}
              </div>
              <div id="steps-action">
                <Row type="flex" justify="center" gutter={6}>
                  {currentStep === 0 && (
                    <Col xs={12} md={6} span={3}>
                      <Link to={{
                        pathname: "/home",
                        state: {}
                      }}>
                        <Button block size="default" icon="home">
                          Home
                        </Button>
                      </Link>
                    </Col>
                  )}
                  {currentStep > 0 && (
                    <Col xs={12} md={6} span={3}>
                      <Button block size="default" icon="left" onClick={this.prevStep}>
                        Previous
                      </Button>
                    </Col>
                  )}

                  {currentStep < steps.length - 1 && (
                    <Col xs={12} md={6} span={3}>
                      <Button block size="default" type="primary" onClick={this.nextStep}>
                        Next <Icon type="right"/>
                      </Button>
                    </Col>
                  )}

                  {currentStep === steps.length - 1 && (
                    <Col xs={12} md={6} span={3}>
                      <Button block loading={publishLoading} size="default" type="primary" onClick={this.nextStep}>
                        Publish
                      </Button>
                    </Col>
                  )}
                </Row>
              </div>
            </div>
          </QueueAnim>
        </Content>
        <Footer style={{textAlign: 'center'}}>GoHelpFund ©2019</Footer>
      </Layout>
    )
  }
}

CreateCampaignAnt.propTypes = {
  classes: PropTypes.object,
};

export default compose(
  withCookies
)(CreateCampaignAnt);