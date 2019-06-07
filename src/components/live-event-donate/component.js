import React, { Component } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { InputNumber, Checkbox, Button  } from 'antd';
import * as EndPoints from '../../utils/end-points';
import axios from 'axios';

import './style.css';

class LiveEventDonate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 10,
      isChecked: false
    }
  }

  onChange(value) {
    this.setState({amount: value})
  }

  toggleCheckbox() {
    this.setState({isChecked: !this.state.isChecked});
  }

  donate() {
    const { cookies } = this.props;
    let appToken = cookies.get('accessToken');
    let url = EndPoints.postEventDonateUrl;
    let config = {
      headers: {'Authorization': "Bearer " + appToken}
    };
    let params = {
      amount: this.state.amount
    };

    url = url.replace('{eventId}', 'bal81764-bea1-4249-b86d-f8fb8182eec1');

    axios.post(url, params, config)
      .then(response => {
        this.props.history.push({
          pathname: '/live-event-success/'
        })
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    return(
      <div id="app-live-event-donate">
        <div>
          <h2>Orice sumă donată ne aduce mai aproape de o lume așa cum ne dorim.</h2>
          <h3>Donez suma de:</h3>
          <InputNumber
            defaultValue={this.state.amount}
            formatter={value => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\€\s?|(,*)/g, '')}
            onChange={this.onChange.bind(this)}
            className="amount-field"
          />
          <div className="checkbox-container">
            <Checkbox onChange={this.toggleCheckbox.bind(this)}>Mă angajez să virez suma de €{this.state.amount} în contul 
Fundației Serviciilor Sociale Bethany 
până la data de 30 iunie 2019.</Checkbox>
          </div>
          <Button className="donate-btn" variant="contained" type="primary" disabled={!this.state.isChecked} onClick={this.donate.bind(this)}>Finalizează angajamentul</Button>
        </div>
      </div>
    );
  }
}

export default withCookies(LiveEventDonate);