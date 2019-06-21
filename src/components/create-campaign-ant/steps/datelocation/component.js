import React from "react";
import compose from "recompose/compose";
import {Col, DatePicker, Icon, Input, Row, Tooltip} from "antd";
import QueueAnim from "rc-queue-anim";
import Step4 from "../../../../assets/images/campaigns/campaign-creation/step4.svg";
import moment from 'moment';

const {RangePicker} = DatePicker;

class DateLocation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: this.props.endDate,
            endDate: this.props.endDate,
            location: this.props.location
        }
    }

    disabledDate = current => {
        // Can not select days before today
        return current && current < moment().endOf('day').subtract(1, 'days');
    };

    onLocationChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
        this.props.handleLocationChange(event);
    };

    onDateChange = (dates, dateStrings) => {
        if (dates !== undefined) {
            this.setState({
                startDate: dates[0],
                endDate: dates[1]
            });
            this.props.handleDateChange(dates[0], dates[1]);
                // dates[0].utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
                // dates[1].utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]'))

        }
    };

    render() {
        const {startDate, endDate, location} = this.state;
        return (
            <QueueAnim className="demo-content"
                       key="date-and-location"
                       type={['right', 'left']}
                       ease={['easeOutQuart', 'easeInOutQuart']}>
                <div key='date-and-location-step'>
                    <Row type="flex" justify="center" align="middle">
                        <Col span={11}>
                            <h3>When and where?</h3>
                            <br/>
                            <RangePicker style={{width: 330}}
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
                            <br/>
                            <Input placeholder="Location" style={{width: 330, margin: '16px 0'}}
                                   name='location'
                                   value={location}
                                   onChange={(e) => this.onLocationChange(e)}
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
    }
}

export default compose()(DateLocation);