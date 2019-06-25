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
        handleChange(id, data);

    };

    const handleValueChange = (event) => {
        triggerChange({[event.target.name]: event.target.value});
    };

    const onRemove = (event) => {
        console.log(id);
        handleRemove(id);
    };

    const id = name;

    return (
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
    );
};

let counter = 1;

class DynamicFieldSet extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expensesValues: this.props.expensesValues,
            expensesKeys: this.props.expensesKeys
        }
    }

    remove = k => {
        const {form} = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        const newKeys = keys.filter(key => key !== k);

        // can use data-binding to set
        form.setFieldsValue({
            keys: newKeys
        });
    };

    add = () => {
        const {form} = this.props;

        // can use data-binding to get
        const keys = form.getFieldValue('keys');

        const nextKeys = keys.concat(counter++);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });

        this.setState({
            expensesKeys: nextKeys
        });
    };

    handleChange = (key, data) => {
        console.log(key);
        console.log(data);

        let items = this.state.expensesValues;
        // 3. Replace the property you're intested in
        let item = Object.assign({}, item, data);
        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        items[key] = item;
        // 5. Set the state to our new copy
        this.setState({
            expensesValues: items
        })
    };

    validate = (expenseData) => {
        let status = 'validating';

        if (expenseData !== undefined && expenseData.amount !== undefined && expenseData.amount !== '' && expenseData.description !== undefined && expenseData.description !== '') {
            status = 'success';
        }
        return status;
    };

    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const {expensesKeys, expensesValues} = this.state;

        getFieldDecorator('keys', {initialValue: expensesKeys});
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <Form.Item
                hasFeedback validateStatus={this.validate(expensesValues[k])}
                label={''}
                style={{fontWeight: "bold"}}
                key={k}

            >
                {getFieldDecorator(`expenses[${k}]`, {initialValue: expensesValues[k] !== undefined ? expensesValues[k] : {}})(
                    (<ExpenseInput
                        name={k}
                        handleRemove={this.remove}
                        handleChange={this.handleChange}

                    />)
                )}
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
