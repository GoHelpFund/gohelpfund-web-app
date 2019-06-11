import React, {Component} from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { InputNumber, Checkbox, Button  } from 'antd';
import * as EndPoints from '../../utils/end-points';
import axios from 'axios';

import './style.css';

class LiveEventAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: 0,
            isChecked: false
        }
    }

    modifyAmount() {
        const { cookies } = this.props;
        let appToken = cookies.get('accessToken');
        let url = EndPoints.postAddDonationUrl;
        let config = {
        headers: {'Authorization': "Bearer " + appToken}
        };
        let params = {
            amount: this.state.amount
        };

        let that = this;

        that.setState({serverMessage: null});

        url = url.replace('{eventId}', 'bal81764-bea1-4249-b86d-f8fb8182eec1');

        axios.post(url, params, config)
        .then(response => {
            that.setState({serverMessage: 'Succes! Ai modificat suma cu ' + that.state.amount});
            console.log(response);
        })
        .catch(function(error) {
            that.setState({serverMessage: error.response.data.error_description});
            console.log(error);
        });
    }

    onChange(value) {
        this.setState({amount: value})
    }

    toggleCheckbox() {
        this.setState({isChecked: !this.state.isChecked});
    }

    render() {
        return(
            <div id="app-live-event-admin">
                <div>
                    <InputNumber
                    defaultValue={this.state.amount}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\€\s?|(,*)/g, '')}
                    onChange={this.onChange.bind(this)}
                    className="amount-field"
                    />
                    <div className="checkbox-container">
                        <Checkbox onChange={this.toggleCheckbox.bind(this)}>Modifică suma cu {this.state.amount} RON</Checkbox>
                    </div>
                    <div>
                        <Button className="donate-btn" variant="contained" type="primary" disabled={!this.state.isChecked} onClick={this.modifyAmount.bind(this)}>Modifică</Button>
                    </div>
                    <div className="server-message">{this.state.serverMessage}</div>
                </div>
            </div>
        );
    }
}


export default withCookies(LiveEventAdmin);