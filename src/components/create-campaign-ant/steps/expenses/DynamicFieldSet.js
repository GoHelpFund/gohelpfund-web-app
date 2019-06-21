import React from "react";
import compose from "recompose/compose";
import QueueAnim from 'rc-queue-anim';

import {Button, Col, Form, Icon, Input, Row} from 'antd';


const {TextArea} = Input;
const InputGroup = Input.Group;

const ExpenseInput = ({value: expenseData, onChange}) => {
    const triggerChange = changedData => {
        let data = Object.assign({}, expenseData, changedData);
        onChange(data);
    };

    const handleValueChange = (event) => {
        triggerChange({[event.target.name]: event.target.value});
    };

    return (
        <InputGroup size="default" style={{width: '90%', marginRight: 8}}>
            <Row gutter={4} type="flex" justify="space-around" align="middle">
                <Col span={6}>
                    <Input placeholder="Amount"
                           name="amount"
                           defaultValue={expenseData.amount || undefined}
                           onChange={e => handleValueChange(e)}
                           prefix={<Icon type="pie-chart" style={{color: 'rgba(0,0,0,.25)'}}/>}
                    />
                </Col>
                <Col span={18}>
                    <TextArea
                        placeholder="Expense description"
                        name="description"
                        defaultValue={expenseData.description || undefined}
                        onChange={e => handleValueChange(e)}
                        autosize={{minRows: 1, maxRows: 3}}/>
                </Col>
            </Row>
        </InputGroup>
    );
};

class DynamicFieldSet extends React.Component {
    constructor(props) {
        super(props);
    }

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

        const nextKeys = keys.concat(this.props.expensesKeys.length);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    };

    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        let wat = getFieldDecorator('keys', {initialValue: this.props.expensesKeys});
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <Form.Item
                label={''}
                style={{fontWeight: "bold"}}
                key={k}

            >
                {getFieldDecorator(`expenses[${k}]`, {initialValue: this.props.expensesValues[k] !== undefined ? this.props.expensesValues[k] : {}})(
                    (<ExpenseInput/>)
                )}
                {keys.length > 1 ? (
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove(k)}
                    />
                ) : null
                }
            </Form.Item>
        ));
        return (
            <Form>
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

export default compose()(DynamicFieldSet);
