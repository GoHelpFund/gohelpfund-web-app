import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import QueueAnim from 'rc-queue-anim';

import './style.css';

import Step1 from '../../assets/images/campaigns/campaign-creation/step1.png';
import Step2 from '../../assets/images/campaigns/campaign-creation/step2.svg';
import Step3 from '../../assets/images/campaigns/campaign-creation/step3b.svg';
import Step4 from '../../assets/images/campaigns/campaign-creation/step4.svg';
import Step5 from '../../assets/images/campaigns/campaign-creation/step5b.svg';

import moment from 'moment';
import {withCookies} from 'react-cookie';
import compose from 'recompose/compose';


import {
    Button,
    Col,
    DatePicker,
    Form,
    Icon,
    Input,
    Layout,
    message,
    Modal,
    Row,
    Select,
    Steps,
    Tooltip,
    Upload,
    Empty,
    Typography
} from 'antd';
import {Link} from "react-router-dom";
import UploadList from "antd/es/upload/UploadList";

const { Text } = Typography;
const {Content, Footer} = Layout;

const {RangePicker} = DatePicker;
const {TextArea} = Input;

const InputGroup = Input.Group;

const {Option} = Select;

const Dragger = Upload.Dragger;

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

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class PicturesWall extends React.Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
        selectedItem: undefined
    };

    handleCancel = () => {
        console.log('handleCancel');
        this.setState({previewVisible: false});
    }

    handleRemove = file => {
        console.log('handleRemove');
        this.setState(state => {
            const index = state.fileList.indexOf(file);
            const newFileList = state.fileList.slice();
            newFileList.splice(index, 1);


            if (state.selectedItem === file.uid) {
                return {
                    fileList: newFileList,
                    selectedItem: newFileList.length === 0 ? undefined : newFileList[0].uid
                };
            } else {
                return {
                    fileList: newFileList,
                };
            }
        });
    };

    handlePreview = async file => {
        console.log('handlePreview');
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = info => {
        console.log('handleChange');
        let fileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show six recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-5);

        this.setState({fileList});
    };

    beforeUpload = (file, FileList) => {

        console.log('beforeUpload');
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        if (!isJPG && !isPNG) {
            message.error('File format allowed: .jpeg .png');
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must smaller than 5 MB');
        }

        const isFull = this.state.fileList.length === 5;
        if (isFull) {
            message.error('Limit of 5 images reached');
            message.info('Remove existing images in order to upload new ones')
        }

        const isOverflow = this.state.fileList.length + FileList.length > 5;
        if (isOverflow && !isFull) {
            message.error('Total number of images exceeds 5');
            message.info('Please select fewer images')
        }

        return new Promise((resolve, reject) => {
            if ((isJPG || isPNG) && isLt5M && !isFull && !isOverflow) {
                resolve(file);
            } else {
                reject(file);
            }
        })
    };

    handleSelectChange = selectedItem => {
        console.log('select: ' + selectedItem);
        this.setState({selectedItem});
    };


    render() {
        const {previewVisible, previewImage, fileList, selectedItem} = this.state;
        const props = {
            action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
            name: 'file',
            multiple: true,
            type: 'drag',
            listType: "picture-card",
            fileList,
            onChange: this.handleChange,
            onPreview: this.handlePreview,
            onRemove: this.handleRemove,
            beforeUpload: this.beforeUpload,
            showUploadList: {
                showPreviewIcon: true,
                showRemoveIcon: true
            },
        };

        return (
            <div className="clearfix">
                <Select
                    placeholder="Select the campaign profile image."
                    mode="default"
                    onChange={this.handleSelectChange}
                    value={selectedItem}
                    style={{width: '100%', marginBottom: '20px'}}
                >
                    {fileList.map((item, index) => (
                        <Option value={item.uid} key={item.uid}><Text code>{index+1}</Text> {item.name}</Option>
                    ))}
                </Select>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="cloud-upload"/>
                    </p>
                    <p className="ant-upload-text">Click or drag images to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload and up to 5 images.
                    </p>
                </Dragger>
                <Modal centered visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}

class DynamicFieldSet extends React.Component {
    remove = k => {
        const {form} = this.props;
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
        const {form} = this.props;
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
                const {keys, names} = values;
                console.log('Received values of form: ', values);
                console.log('Merged values:', keys.map(key => names[key]));
            }
        });
    };

    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        getFieldDecorator('keys', {initialValue: []});
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
                    <InputGroup size="default" style={{width: '90%', marginRight: 8}}>
                        <Row gutter={4} type="flex" justify="space-around" align="middle">
                            <Col span={6}>
                                <Input placeholder="Amount"
                                       prefix={<Icon type="pie-chart" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                />
                            </Col>
                            <Col span={18}>
                                <TextArea
                                    placeholder="Expense description"
                                    autosize={{minRows: 1, maxRows: 3}}/>
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
                <Form.Item>
                    <Button type="dashed" onClick={this.add} style={{width: '30%'}}>
                        <Icon type="plus"/> Add expense
                    </Button>
                </Form.Item>
                <QueueAnim component="ul" type={['right', 'left']} leaveReverse>
                    {formItems}
                </QueueAnim>
            </Form>
        );
    }
}

class CreateCampaignAnt extends Component {
    popperNode = null;

    constructor(props) {
        super(props);

        message.config({
            maxCount: 2,
        });

        if (this.props.location && this.props.location.state && this.props.location.state.referrer) {
            this.state = this.props.location.state.referrer;
            this.getUploadInfo();
        } else {
            this.state = {
                activeStep: 0,
                skipped: new Set(),
                single: '',
                popper: '',
                suggestions: [],
                isNextPressed: false,
                categories: [],
                category: '',
                title: '',
                description: '',
                amount: '',
                expensesDescription: '',
                startDate: '',
                endDate: '',
                location: '',
                image: '',
                images: [],
                current: 0,
                visible: false,
                show: true
            };
        }
    }

    nextStep() {
        const current = this.state.current + 1;
        this.setState({current});
        this.setState({
            show: !this.state.show
        });
    }

    prevStep() {
        const current = this.state.current - 1;
        this.setState({current});
    }

    render() {
        const {Step} = Steps;
        const WrappedDynamicFieldSet = Form.create({name: 'dynamic_form_item'})(DynamicFieldSet);
        const steps = [
            {
                title: 'Category',
                icon_type: "tags",
                description: "choose the category that best fits your campaign",
                render: () => (
                    <QueueAnim className="demo-content"
                               key="category"
                               type={['right', 'left']}
                               ease={['easeOutQuart', 'easeInOutQuart']}>
                        <div key='category-step'>
                            <Row type="flex" justify="center" align="middle">
                                <Col span={10}>
                                    <h3>Choose the category that best fits your campaign</h3>
                                    <br/>
                                    <Select
                                        showSearch
                                        style={{width: 200}}
                                        placeholder="Select a category"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        <Option value="charity">Charity</Option>
                                        <Option value="education">Education</Option>
                                        <Option value="emergency">Emergency</Option>
                                        <Option value="medical">Medical</Option>
                                        <Option value="animals">Animals</Option>
                                        <Option value="volunteer">Volunteer</Option>
                                    </Select>
                                </Col>
                                <Col span={14} style={{paddingTop: '50px'}}>
                                    <img alt="category-step"
                                         src={Step1}/>
                                </Col>
                            </Row>
                        </div>
                    </QueueAnim>
                )
            },
            {
                title: 'Description',
                icon_type: "question-circle",
                description: "what problem do you have?",
                render: () => (
                    <QueueAnim className="demo-content"
                               key="description"
                               type={['right', 'left']}
                               ease={['easeOutQuart', 'easeInOutQuart']}>
                        <div key="'description-step">
                            <Row type="flex" justify="center" align="middle">
                                <Col span={11}>
                                    <h3>What problem do you have?</h3>
                                    <br/>
                                    <Input placeholder="Campaign Title" style={{}}
                                           prefix={<Icon type="flag" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                           suffix={
                                               <Tooltip title="Extra information">
                                                   <Icon type="info-circle" style={{color: 'rgba(0,0,0,.45)'}}/>
                                               </Tooltip>
                                           }
                                    />
                                    <br/>
                                    <TextArea placeholder={"Campaign Description"} rows={10}
                                              style={{margin: '16px 0'}}
                                    />
                                </Col>
                                <Col span={10} offset={2}>
                                    <img alt="description-step"
                                         src={Step2}/>
                                </Col>
                            </Row>
                        </div>
                    </QueueAnim>
                )
            },
            {
                title: 'Expenses',
                icon_type: "pie-chart",
                description: "How much money do you need and how will you use it?",
                render: () => (
                    <QueueAnim className="demo-content"
                               key="expenses"
                               type={['right', 'left']}
                               ease={['easeOutQuart', 'easeInOutQuart']}>
                        <div key='expenses-step'>
                            <Row type="flex" justify="center" align="top">
                                <Col span={11} style={{paddingTop: '100px'}}>
                                    <h3>How much money do you need and how will you use it?</h3>
                                    <br/>
                                    <WrappedDynamicFieldSet/>
                                </Col>
                                <Col span={11}>
                                    <img alt='expenses-step' src={Step3}/>

                                </Col>
                            </Row>
                        </div>
                    </QueueAnim>
                )
            },
            {
                title: 'Date & Location',
                icon_type: "clock-circle",
                description: "When and where?",
                render: () => (
                    <QueueAnim className="demo-content"
                               key="date-and-location"
                               type={['right', 'left']}
                               ease={['easeOutQuart', 'easeInOutQuart']}>
                        <div key='date-and-location-step'>
                            <Row type="flex" justify="center" align="middle">
                                <Col span={11}>
                                    <h3>When and where?</h3>
                                    <br/>
                                    <RangePicker style={{width: 230}}
                                                 ranges={{
                                                     'This Week': [moment(), moment().endOf('week')],
                                                     'This Month': [moment(), moment().endOf('month')],
                                                     'Next Month': [moment(), moment().add(1, 'months').endOf('month')]
                                                 }}
                                    />
                                    <br/>
                                    <Input placeholder="Location" style={{width: 230, margin: '16px 0'}}
                                           prefix={<Icon type="global" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                           suffix={
                                               <Tooltip title="The location of the campaign">
                                                   <Icon type="info-circle" style={{color: 'rgba(0,0,0,.45)'}}/>
                                               </Tooltip>
                                           }
                                    />
                                </Col>
                                <Col span={10} style={{paddingTop: '50px'}}>
                                    <img alt='date-and-ocation-step' src={Step4}/>
                                </Col>
                            </Row>
                        </div>
                    </QueueAnim>
                )
            },
            {
                title: 'Media gallery',
                icon_type: "file-image",
                description: "Upload images that could give a better understanding of the cause",
                render: () => (
                    <QueueAnim className="demo-content"
                               key="media-gallery"
                               type={['right', 'left']}
                               ease={['easeOutQuart', 'easeInOutQuart']}>
                        <div key='media-gallery-step'>
                            <Row type="flex" justify="center">
                                <Col span={13} style={{marginTop: '35px'}}>
                                    <h3>Upload images that could give a better understanding of the cause</h3>
                                    <br/>
                                    <PicturesWall/>
                                </Col>
                                <Col span={9} offset={1} style={{marginTop: '100px'}}>
                                    <img alt='media-gallery-step' src={Step5}/>
                                </Col>
                            </Row>
                        </div>
                    </QueueAnim>
                )
            }
        ];
        const {current} = this.state;

        return (
            <Layout className="layout">
                <Content style={{padding: '0 300px', height: "calc(100vh - 70px)"}}>
                    <QueueAnim className="demo-content"
                               type={['right', 'left']}
                               ease={['easeOutQuart', 'easeInOutQuart']}>
                        <div key='wat' id="app-create-campaign-ant">
                            <Steps current={current}>
                                {steps.map(item => (
                                    <Step key={item.title} title={item.title} icon={<Icon type={item.icon_type}/>}/>
                                ))}
                            </Steps>
                            <div key='steps-content' id="steps-content">
                                {steps[current].render()}
                            </div>
                            <div id="steps-action">
                                <Row type="flex" justify="center" gutter={6}>
                                    {current === 0 && (
                                        <Col span={3}>
                                            <Link to={{
                                                pathname: "/home",
                                                state: {}
                                            }}>
                                                <Button block size="default" icon="home"
                                                        onClick={() => this.prevStep()}>
                                                    Home
                                                </Button>
                                            </Link>
                                        </Col>
                                    )}
                                    {current > 0 && (
                                        <Col span={3}>
                                            <Button block size="default" icon="left" onClick={() => this.prevStep()}>
                                                Previous
                                            </Button>
                                        </Col>
                                    )}

                                    {current < steps.length - 1 && (
                                        <Col span={3}>
                                            <Button block size="default" type="primary" onClick={() => this.nextStep()}>
                                                Next <Icon type="right"/>
                                            </Button>
                                        </Col>
                                    )}

                                    {current === steps.length - 1 && (
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

export default compose(
    withStyles(styles),
)(CreateCampaignAnt);