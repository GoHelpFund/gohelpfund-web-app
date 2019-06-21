import React from "react";
import compose from "recompose/compose";
import {Col, Icon, Input, Row, Tooltip} from "antd";
import QueueAnim from "rc-queue-anim";
import Step2 from "../../../../assets/images/campaigns/campaign-creation/step2.svg";

const {TextArea} = Input;

class Description extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: (this.props.title === undefined) ? undefined : this.props.title,
            description: (this.props.description === undefined) ? undefined : this.props.description
        };
    }

    handleValueChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
        this.props.handleChange(event);
    };

    render(){
        const {title, description} = this.state;
        return(
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
                                   name="title"
                                   value={title}
                                   onChange={(e) => this.handleValueChange(e)}
                                   prefix={<Icon type="flag" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                   suffix={
                                       <Tooltip title="Extra information">
                                           <Icon type="info-circle" style={{color: 'rgba(0,0,0,.45)'}}/>
                                       </Tooltip>
                                   }
                            />
                            <br/>
                            <TextArea placeholder={"Campaign Description"} rows={10}
                                      name="description"
                                      value={description}
                                      onChange={(e) => this.handleValueChange(e)}
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
    }
}

export default compose()(Description);