import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import logo from '../../assets/images/ghf-logo.png';
import './style.css';

class Header extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: this.props.isLoggedIn,
      hasBg: window.location.pathname === '/home'
    }
  }

  componentDidMount() {
    // if(window.location.pathname === '/home') {
    //   this.setState({hasBg: true});
    // }
    window.addEventListener('scroll', this.handleScroll.bind(this));
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  };

  handleScroll(event) {
    if(window.location.pathname === '/home') {
      let scrollTop = event.srcElement.body.scrollTop;
      if (window.scrollY > 30) {
        this.setState({hasBg: false});
      } else {
        this.setState({hasBg: true});
      }
    } else {
      this.setState({hasBg: false});
    }

  };

  componentWillReceiveProps(props) {
    this.setState({isLoggedIn: props.isLoggedIn});
  }

  logOut() {
    const { cookies } = this.props;
    cookies.remove('accessToken');
    global.accessToken = null;
    this.props.updateLoginState(false);
  }

  goToHomePage() {
    this.setState({hasBg: true});
  }

  render() {
    const authActionButton = this.state.isLoggedIn ? <a onClick={this.logOut.bind(this)}>Log out</a>
                                        : <Link to="/onboarding">Log in</Link>;

    return (
      <div id="app-header" className={ this.state.hasBg ? 'has-bg' : ''}>
        <Link to="/home" className="ghf-logo" onClick={this.goToHomePage.bind(this)}>
            <img src={logo} />
            <div>go help fund</div>
        </Link>
        <div className="header-action-container">
          {authActionButton}
        </div>
        <div className="header-action-container">
          <Link to="/create-campaign-ant" className="create-btn-link">
            Create campaign
          </Link>
        </div>
      </div>
    );
  }
}

export default withCookies(Header);