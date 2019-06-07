import React, {Component} from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { InputNumber, Checkbox, Button  } from 'antd';
import * as EndPoints from '../../utils/end-points';
import axios from 'axios';

import './style.css';

class LiveEventAdmin extends Component {
    constructor(props) {
        super(props);
        this.modifyAmount();
    }

    modifyAmount() {
        const { cookies } = this.props;
        let appToken = cookies.get('accessToken');
        let url = EndPoints.postEventDonateUrl;
        let config = {
        headers: {'Authorization': "Bearer " + appToken}
        };
        let params = {
            amount: -7
        };

        url = url.replace('{eventId}', 'bal81764-bea1-4249-b86d-f8fb8182eec1');

        axios.post(url, params, config)
        .then(response => {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    render() {
        return(
            <div>

            </div>
        );
    }
}


export default withCookies(LiveEventAdmin);