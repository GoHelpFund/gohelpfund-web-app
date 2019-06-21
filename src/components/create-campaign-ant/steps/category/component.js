import React from "react";
import compose from "recompose/compose";
import {Col, Row, Select} from "antd";
import Step1 from "../../../../assets/images/campaigns/campaign-creation/step1.png";
import QueueAnim from "rc-queue-anim";

const {Option} = Select;

class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: (this.props.category === undefined) ? undefined : this.props.category
        };
    }

    handleSelectChange = (value, event) => {
        this.setState({category: value});
        this.props.handleChange(event);
    };

    render() {
        const {category} = this.state;
        return (
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
                                value={category}
                                placeholder="Select a category"
                                optionFilterProp="children"
                                onChange={(value, event) => this.handleSelectChange(value, event)}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Option key="category" value="charity">Charity</Option>
                                <Option key="category" value="education">Education</Option>
                                <Option key="category" value="emergency">Emergency</Option>
                                <Option key="category" value="medical">Medical</Option>
                                <Option key="category" value="animals">Animals</Option>
                                <Option key="category" value="volunteer">Volunteer</Option>
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
    }
}

export default compose()(Category);