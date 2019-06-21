import compose from 'recompose/compose';
import React from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import {Link} from "react-router-dom";

import './style.css';
import {Button, Col, Icon, Layout, message, Row, Steps} from 'antd';

import Category from './steps/category/component';
import Description from './steps/description/component';
import Expenses from './steps/expenses/component';
import DateLocation from './steps/datelocation/component';
import MediaGallery from './steps/mediagallery/component';

const {Content, Footer} = Layout;

class CreateCampaignAnt extends React.Component {
    popperNode = null;

    constructor(props) {
        super(props);

        message.config({
            maxCount: 2,
        });

        this.state = {
            currentStep: 0,
            category: undefined,
            title: undefined,
            description: undefined,
            expenses: [],
            expensesForm: undefined,
            startDate: undefined,
            endDate: undefined,
            location: undefined,
            fileList: [],
            profileImage: undefined
        };
    }

    handleFileListChange = (fileList) => {
        console.log('filelist', fileList);
        this.setState({
            fileList: fileList
        })
    };

    handleProfileImageChange = (selectedItem) => {
        console.log('selectedItem', selectedItem);
        this.setState({
            profileImage: selectedItem
        })
    };

    handleExpensesChange = (dynamicExpenses, dynamicForm) => {
        console.log('expenses', dynamicExpenses);
        console.log('form', dynamicForm);
        this.setState({
            expenses: dynamicExpenses,
            expensesForm: dynamicForm
        })
    };

    handleDateChange = (startDate, endDate) => {
        this.setState({
            startDate: startDate,
            endDate: endDate
        })
    };

    handleChange = event => {
        if (event.target !== undefined) {
            this.setState({
                [event.target.name]: event.target.value
            })
        } else {
            this.setState({
                category: event.props.value
            })
        }
    };

    nextStep() {
        const currentStep = this.state.currentStep + 1;
        this.setState({currentStep});
        this.setState({
            show: !this.state.show
        });
    }

    prevStep() {
        const currentStep = this.state.currentStep - 1;
        this.setState({currentStep});
    }

    render() {
        const {Step} = Steps;
        const steps = [
            {
                title: 'Category',
                icon_type: "tags",
                description: "choose the category that best fits your campaign",
                render: () => (
                    <Category
                        handleChange={this.handleChange}
                        category={this.state.category}
                    />
                )
            },
            {
                title: 'Description',
                icon_type: "question-circle",
                description: "what problem do you have?",
                render: () => (
                    <Description
                        handleChange={this.handleChange}
                        title={this.state.title}
                        description={this.state.description}
                    />
                )
            },
            {
                title: 'Expenses',
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
                icon_type: "clock-circle",
                description: "When and where?",
                render: () => (
                    <DateLocation
                        handleDateChange={this.handleDateChange}
                        handleLocationChange={this.handleChange}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        location={this.state.location}
                    />
                )
            },
            {
                title: 'Media gallery',
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
        const {currentStep} = this.state;

        return (
            <Layout className="layout">
                <Content style={{padding: '0 300px', height: "calc(100vh - 70px)"}}>
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
                                        <Col span={3}>
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
                                        <Col span={3}>
                                            <Button block size="default" icon="left" onClick={() => this.prevStep()}>
                                                Previous
                                            </Button>
                                        </Col>
                                    )}

                                    {currentStep < steps.length - 1 && (
                                        <Col span={3}>
                                            <Button block size="default" type="primary" onClick={() => this.nextStep()}>
                                                Next <Icon type="right"/>
                                            </Button>
                                        </Col>
                                    )}

                                    {currentStep === steps.length - 1 && (
                                        <Col span={3}>
                                            <Button block size="default" type="primary"
                                                    onClick={() => message.success('Campaign created successfully')}>
                                                Publish <Icon type="check"/>
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

export default compose()(CreateCampaignAnt);