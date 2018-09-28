import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import logo from '../../assets/images/ghf-logo.png';
import './style.css';

class Header extends Component {
  render() {
    return (
      <div id="app-header">
        <Link to="/home" className="ghf-logo">
            <img src={logo} />
            <div>go help fund</div>
        </Link>
        <Link to="/create-campaign" className="create-btn-link">
          <Button variant="contained" color="primary" className="create-btn">
            Create campaign
          </Button>
        </Link>
      </div>
    );
  }
}

export default Header;