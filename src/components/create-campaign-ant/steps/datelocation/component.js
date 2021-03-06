import React from "react";
import compose from "recompose/compose";
import {Col, DatePicker, Form, Icon, Input, Row, Tooltip} from "antd";
import QueueAnim from "rc-queue-anim";
import Step4 from "../images/location.svg";
import moment from 'moment';

const {RangePicker} = DatePicker;

class DateLocation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: this.props.endDate,
      endDate: this.props.endDate,
      location: this.props.location,
      dateStatus: (this.props.startDate !== undefined && this.props.startDate !== '') ? 'success' : '',
      locationStatus: (this.props.location !== undefined && this.props.location !== '') ? 'success' : ''
    }
  }

  disabledDate = current => {
    // Can not select days before today
    return current && current < moment().endOf('day').subtract(1, 'days');
  };

  onLocationChange = (event) => {
    const status = (event.target.value === '') ? '' : 'success';
    const statusType = event.target.name + 'Status';
    this.setState({
      [event.target.name]: event.target.value,
      [statusType]: status
    });
    this.props.handleLocationChange(event, status);
  };

  onDateChange = (dates, dateStrings) => {
    if (dates !== undefined) {
      const status = (dates.length === 0) ? '' : 'success';

      this.setState({
        startDate: dates[0],
        endDate: dates[1],
        dateStatus: status
      });
      this.props.handleDateChange(dates[0], dates[1], status);
      // dates[0].utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
      // dates[1].utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]'))

    }
  };

  render() {
    const {startDate, endDate, location, dateStatus, locationStatus} = this.state;
    return (
      <QueueAnim className="demo-content"
                 key="date-and-location"
                 type={['right', 'left']}
                 ease={['easeOutQuart', 'easeInOutQuart']}>
        <div key='date-and-location-step'>
          <Row type="flex" justify="center" align="middle">
            <Col xs={20} md={10} span={11}>
              <h3>Please select the campaign duration and add your location:</h3>
              <br/>
              <Form>
                <Form.Item hasFeedback validateStatus={dateStatus}>
                  <RangePicker
                               disabledDate={this.disabledDate}
                               value={[startDate, endDate]}
                               onChange={this.onDateChange}
                               format={"dddd DD MMMM"}
                               ranges={{
                                 'This Week': [moment(), moment().endOf('week')],
                                 'This Month': [moment(), moment().endOf('month')],
                                 'Next Month': [moment(), moment().add(1, 'months').endOf('month')]
                               }}
                  />
                </Form.Item>
                <Form.Item hasFeedback validateStatus={locationStatus}>
                  <Input placeholder="Location" style={{width: 230}}
                         name='location'
                         value={location}
                         onChange={(e) => this.onLocationChange(e)}
                         prefix={<Icon type="global" style={{color: 'rgba(0,0,0,.25)'}}/>}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col xs={20} md={6} span={10}>
              <img alt='date-and-ocation-step'
                   className="step-date-location-image"
                   src={Step4}/>
            </Col>
          </Row>
        </div>
      </QueueAnim>
    )
  }
}

export default compose()(DateLocation);