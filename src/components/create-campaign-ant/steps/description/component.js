import React from "react";
import compose from "recompose/compose";
import {Col, Form, Icon, Input, Row, Tooltip} from "antd";
import QueueAnim from "rc-queue-anim";
import Step2 from "../../../../assets/images/campaigns/campaign-creation/step2.svg";

const {TextArea} = Input;

class Description extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: (this.props.title === undefined) ? undefined : this.props.title,
            description: (this.props.description === undefined) ? undefined : this.props.description,
            titleStatus: (this.props.title !== undefined && this.props.title !== '') ? 'success' : '',
            descriptionStatus: (this.props.description !== undefined && this.props.description !== '') ? 'success' : ''
        };
    }

    handleValueChange = (event) => {
        const status = (event.target.value === '') ? '' : 'success';
        const statusType = event.target.name + 'Status';
        this.setState({
            [event.target.name]: event.target.value,
            [statusType]: status
        });
        this.props.handleChange(event, status);
    };

    render() {
        const {title, description, titleStatus, descriptionStatus} = this.state;
        return (
            <QueueAnim className="demo-content"
                       key="description"
                       type={['right', 'left']}
                       ease={['easeOutQuart', 'easeInOutQuart']}>
                <div key="'description-step">
                    <Row type="flex" justify="center" align="middle">
                        <Col xs={20} md={6}  span={11}>
                            <h3>What problem do you have?</h3>
                            <br/>
                            <Form>
                                <Form.Item hasFeedback validateStatus={titleStatus}>
                                    <Input placeholder="Campaign Title"
                                           name="title"
                                           value={title}
                                           onChange={(e) => this.handleValueChange(e)}
                                           prefix={<Icon type="flag" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    />
                                </Form.Item>
                                <Form.Item hasFeedback validateStatus={descriptionStatus}>
                                    <TextArea placeholder={"Campaign Description"} rows={10}
                                              name="description"
                                              value={description}
                                              onChange={(e) => this.handleValueChange(e)}
                                    />
                                </Form.Item>
                            </Form>
                        </Col>
                        <Col xs={20} md={6} span={10} offset={2}>
                            <img alt="description-step"
                                 style={{maxWidth: "100%", height: "auto"}}
                                 src={Step2}/>
                        </Col>
                    </Row>
                </div>
            </QueueAnim>
        )
    }
}

export default compose()(Description);