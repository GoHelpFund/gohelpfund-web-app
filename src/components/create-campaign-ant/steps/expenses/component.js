import React from "react";
import compose from "recompose/compose";
import {Col, Form, Row} from "antd";
import QueueAnim from "rc-queue-anim";
import Step3 from "../../../../assets/images/campaigns/campaign-creation/step3.svg";
import DynamicFieldSet from "./DynamicFieldSet";

class Expenses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expensesKeys: this.props.expenses.map((el, index) => index),
            expensesValues: this.props.expenses,
            WrappedDynamicFieldSet: (this.props.expensesForm !== undefined) ? this.props.expensesForm :
                Form.create({
                    name: 'dynamic_form_item',
                    onValuesChange: this.onValuesChange
                })(DynamicFieldSet)
        }
    }

    onValuesChange = (props, changedValues, allValues) => {
        const {keys, expenses} = allValues;
        if (expenses !== undefined) {
            let merged = keys.map(key => expenses[key]);
            let finalKeys = merged.map((el, index) => index);
            this.setState({
                expensesKeys: finalKeys,
                expensesValues: merged
            });
            this.props.handleChange(merged, this.state.WrappedDynamicFieldSet);
        }
    };

    handleExpensesChange = (dynamicExpenses, dynamicForm) => {
        this.props.handleChange(dynamicExpenses, dynamicForm);
    };


    render() {
        const {WrappedDynamicFieldSet} = this.state;
        return (
            <QueueAnim className="demo-content"
                       key="expenses"
                       type={['right', 'left']}
                       ease={['easeOutQuart', 'easeInOutQuart']}>
                <div key='expenses-step'>
                    <Row type="flex" justify="center" align="top">
                        <Col span={11} style={{paddingTop: '100px'}}>
                            <h3>How much money do you need and how will you use it?</h3>
                            <br/>
                            <WrappedDynamicFieldSet
                            expensesKeys={this.state.expensesKeys}
                            expensesValues={this.state.expensesValues}
                            />
                        </Col>
                        <Col span={11}>
                            <img alt='expenses-step' src={Step3}/>

                        </Col>
                    </Row>
                </div>
            </QueueAnim>
        )
    }
}

export default compose()(Expenses);