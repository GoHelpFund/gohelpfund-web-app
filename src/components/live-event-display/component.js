import React, {Component} from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { InputNumber, Checkbox, Button  } from 'antd';
import * as EndPoints from '../../utils/end-points';
import axios from 'axios';

import './style.css';

class LiveEventDisplay extends Component {
    constructor(props) {
        super(props);
        this.getEventData()
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
            console.log(response.data);
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


export default withCookies(LiveEventDisplay);