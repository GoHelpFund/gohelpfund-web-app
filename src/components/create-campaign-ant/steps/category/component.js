import React from "react";
import compose from "recompose/compose";
import {Col, Form, Icon, Row, Select} from "antd";
import Step1 from "../../../../assets/images/campaigns/campaign-creation/step1.png";
import QueueAnim from "rc-queue-anim";

const {Option} = Select;

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: (this.props.category === undefined) ? undefined : this.props.category,
      categoryStatus: (this.props.category !== undefined) ? 'success' : ''
    };
  }

  handleSelectChange = (value) => {
    const status = 'success';
    this.setState({
      category: value,
      categoryStatus: status
    });
    this.props.handleChange(value, status);
  };

  handleOnDropdownVisibleChange = (isOpened) => {
    const {category} = this.state;
    if (isOpened === true) {
      this.setState({
        categoryStatus: ''
      })
    } else if (isOpened === false && category !== undefined) {
      this.setState({
        categoryStatus: 'success'
      })
    }
  };


  render() {
    const {category, categoryStatus} = this.state;
    return (
      <QueueAnim className="demo-content"
                 key="category"
                 type={['right', 'left']}
                 ease={['easeOutQuart', 'easeInOutQuart']}>
        <div key='category-step'>
          <Row type="flex" justify="center" align="middle">
            <Col xs={20} md={10} span={10}>
              <h3>Choose the category that best fits your campaign</h3>
              <br/>
              <Form>
                <Form.Item hasFeedback validateStatus={categoryStatus}>
                  <Select
                    labelInValue
                    showSearch
                    style={{width: 200}}
                    value={category}
                    placeholder="Select a category"
                    optionFilterProp="children"
                    onSelect={this.handleSelectChange}
                    onDropdownVisibleChange={this.handleOnDropdownVisibleChange}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option key="0d60a85e-0b90-4482-a14c-108aea2557aa">Charity</Option>
                    <Option key="39240e9f-ae09-4e95-9fd0-a712035c8ad7">Education</Option>
                    <Option key="9e4de779-d6a0-44bc-a531-20cdb97178d2">Emergency</Option>
                    <Option key="66a45c1b-19af-4ab5-8747-1b0e2d79339d">Medical</Option>
                    <Option key="29a45c1b-13af-4ab5-8747-3b0e2d72339f">Animals</Option>
                    <Option key="a5a45c1b-19af-zcb5-8747-3e0e2d79330f">Volunteer</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Col>
            <Col xs={20} md={6} span={14} style={{paddingTop: '50px'}}>
              <img alt="category-step"
                   style={{maxWidth: "100%", height: "auto"}}
                   src={Step1}/>
            </Col>
          </Row>
        </div>
      </QueueAnim>
    )
  }
}

export default compose()(Category);