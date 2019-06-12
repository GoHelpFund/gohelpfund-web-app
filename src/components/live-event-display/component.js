import React, {Component} from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { InputNumber, Checkbox, Button  } from 'antd';
import * as EndPoints from '../../utils/end-points';
import axios from 'axios';

import './style.css';
import { setInterval } from 'timers';

class LiveEventDisplay extends Component {
    constructor(props) {
        super(props);
        this.state={
          amount: 0
        }
        this.getEventData();
        setInterval(this.getEventData, 30000);
    }

    getEventData() {
        let url = EndPoints.getEventDataUrl;
        let appToken = localStorage.getItem('appToken');
        let config = {
          headers: {'Authorization': "Bearer " + appToken}
        };
        var that = this;
    
        url = url.replace('{eventId}', 'bal81764-bea1-4249-b86d-f8fb8182eec1');
    
        axios.get(url, config)
          .then(response => {
            this.setState({amount: response.data.wallet.promise.balance});
            console.log(response.data);
          })
          .catch(function(error) {
            console.log(error);
          });
      }

    render() {
        let amount = this.state.amount;
        let euroAmount = amount / 4.75;
        euroAmount = euroAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        let ronAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        return(
            <div id="app-live-event-display">
              <div>
                <div className="display-heading">Total donații până în prezent:</div>
                <div className="euro-amount">€{euroAmount}</div>
                <div className="ron-amount">{ronAmount} RON</div>
                <div className="thanks-heading">Vă mulțumim pentru generozitate!</div>
              </div>
            </div>
        );
    }
}


export default withCookies(LiveEventDisplay);