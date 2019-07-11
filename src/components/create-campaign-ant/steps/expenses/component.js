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
        let {keys, expenses} = allValues;
        let op = 'init';
        let merged = [];
        let finalKeys = [];

        if (expenses !== undefined) {
            op = (keys.length > expenses.length) ? 'add' : 'remove';
        }

        switch (op) {
            case "add":
                merged = keys.map((key, index, arr) => {
                    return expenses[index] !== undefined ? expenses[index] : {}
                });
                finalKeys = merged.map((el, index) => index);
                break;
            case "remove":
                merged = keys.map((key, index, arr) => {
                    return expenses[key] !== undefined ? expenses[key] : {}
                });
                merged.map((key, index, arr) => finalKeys.push(index));
                break;
            default:
                expenses = new Array(keys.length).fill({});
                break;
        }

        this.setState({
            expensesKeys: finalKeys,
            expensesValues: merged
        });
        this.props.handleChange(merged, this.getStatus(merged), this.state.WrappedDynamicFieldSet);
    };


    getStatus = (dynamicExpenses) => {

        const expenses = dynamicExpenses.slice();
        let expensesStatus = new Array(expenses.length)
            .fill({amount: "", description: ""});

        expenses.forEach((el, i, arr) => {
            if (el !== undefined) {
                let obj = {amount: "", description: ""};
                for (let [key, value] of Object.entries(el)) {
                    if (value !== undefined && value !== '') {
                        obj[key] = 'success';
                    } else {
                        obj[key] = '';
                    }
                }
                expensesStatus[i] = obj;
            }
        });
        return expensesStatus;
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
                        <Col xs={20} md={6} span={11} className="step-expenses-content">
                            <h3>How much money do you need and how will you use it?</h3>
                            <br/>
                            <WrappedDynamicFieldSet
                                expensesKeys={this.state.expensesKeys}
                                expensesValues={this.state.expensesValues}
                            />
                        </Col>
                        <Col xs={20} md={6} span={11}>
                            <img alt='expenses-step'
                                 src={Step3}/>

                        </Col>
                    </Row>
                </div>
            </QueueAnim>
        )
    }
}

export default compose()(Expenses);