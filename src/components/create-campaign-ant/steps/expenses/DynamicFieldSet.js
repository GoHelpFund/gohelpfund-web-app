import React from "react";
import compose from "recompose/compose";
import QueueAnim from 'rc-queue-anim';

import {Button, Col, Form, Icon, Input, Row} from 'antd';


const {TextArea} = Input;
const InputGroup = Input.Group;

const ExpenseInput = ({value: expenseData, name, onChange, handleRemove, handleChange}) => {
    const triggerChange = changedData => {
        let data = Object.assign({}, expenseData, changedData);
        onChange(data);
        handleChange(data);

    };

    const handleValueChange = (event) => {
        triggerChange({[event.target.name]: event.target.value});
    };

    const onRemove = (event) => {
        console.log(id);
        handleRemove(id);
    };

    const id = name;

    const validate = (expenseData) => {
        let status = 'validating';

        if (expenseData.amount !== undefined && expenseData.amount !== '' && expenseData.description !== undefined && expenseData.description !== '') {
            status = 'success';
        }
        return status;
    };

    return (
        <Form.Item
            hasFeedback validateStatus={validate(expenseData)}
            label={''}
            style={{fontWeight: "bold"}}

        >
            <InputGroup size="default">
                <Row gutter={4} type="flex" justify="space-around" align="middle">
                    <Col span={6}>
                        <Input placeholder="Amount"
                               name="amount"
                               defaultValue={expenseData.amount || undefined}
                               onChange={e => handleValueChange(e)}
                               prefix={<Icon type="pie-chart" style={{color: 'rgba(0,0,0,.25)'}}/>}
                        />
                    </Col>
                    <Col span={15}>
                        <TextArea
                            placeholder="Expense description"
                            name="description"
                            defaultValue={expenseData.description || undefined}
                            onChange={e => handleValueChange(e)}
                            autosize={{minRows: 1, maxRows: 3}}/>
                    </Col>
                    <Col span={3}>
                        {id > 0 ? (
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                onClick={e => onRemove(e)}
                            />
                        ) : null
                        }
                    </Col>
                </Row>
            </InputGroup>
        </Form.Item>
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

    handleChange = (data) => {
        console.log(data);
    };

    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        let wat = getFieldDecorator('keys', {initialValue: this.props.expensesKeys});
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <div key={index}>
                {getFieldDecorator(`expenses[${k}]`, {initialValue: this.props.expensesValues[k] !== undefined ? this.props.expensesValues[k] : {}})(
                    (<ExpenseInput
                        name={index}
                        handleRemove={this.remove}
                        handleChange={this.handleChange}

                    />)
                )}
            </div>
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
