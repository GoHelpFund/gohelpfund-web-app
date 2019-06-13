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
      amount: 200,
      isChecked: false,
      disableBtn: false
    }
  }

  onChange(value) {
    this.setState({amount: value})
  }

  toggleCheckbox() {
    this.setState({isChecked: !this.state.isChecked});
  }

  donate() {
    this.setState({disableBtn: true});
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

    let that = this;

    axios.post(url, params, config)
      .then(response => {
        localStorage.setItem('totalDonated', response.data.total_amount_donated);
        window.location.pathname = '/live-event-success';
        console.log(response);
      })
      .catch(function(error) {
        that.setState({disableBtn: false});
        console.log(error);
      });
  }

  render() {
    const userName = localStorage.getItem('userName');
    const totalDonated = localStorage.getItem('totalDonated');
    const thanksMessage = totalDonated ? <div className="thanks-message"> Până acum ai donat <span className="donated-amount">{totalDonated} RON</span>. Îți mulțumim!</div> : <div> Orice sumă donată ne aduce mai aproape de o lume așa cum ne dorim.</div>;
    return(
      <div id="app-live-event-donate">
        <div>
          <div className="welcome-message">Bine ai venit<span className="user-name">{' ' + userName}!</span>{thanksMessage}</div>
          {/* <h2>Orice sumă donată ne aduce mai aproape de o lume așa cum ne dorim.</h2> */}
          <h3>Suma donată în RON:</h3>
          <InputNumber
            defaultValue={this.state.amount}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\€\s?|(,*)/g, '')}
            onChange={this.onChange.bind(this)}
            className="amount-field"
          />
          <div className="checkbox-container">
            <Checkbox onChange={this.toggleCheckbox.bind(this)}>Mă angajez să virez suma de {this.state.amount} RON în contul <strong>Fundației Serviciilor Sociale Bethany</strong> până la data de 30 iunie 2019.</Checkbox>
          </div>
          <Button className="donate-btn" variant="contained" type="primary" disabled={!this.state.isChecked || this.state.disableBtn} onClick={this.donate.bind(this)}>Finalizează angajamentul</Button>
        </div>
      </div>
    );
  }
}

export default withCookies(LiveEventDonate);