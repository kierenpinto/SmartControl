import React, { Component } from 'react';
import './App.css';
import TopBar from './TopBar';
import { withAuth } from '@okta/okta-react';
import * as firebase from 'firebase';

export default withAuth(class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: null };
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.checkAuthentication();
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  async login() {
    // Redirect to '/' after login
    this.props.auth.login('/');
  }

  async logout() {
    // Redirect to '/' after logout
    this.props.auth.logout('/');
  }

  render() {
    if (this.state.authenticated === null) return null;

    return (
      <div>
        <TopBar Login_Method={this.login} Logout_Method={this.logout} authenticated={this.state.authenticated}/>
        <div className="App-body">
          <p>Application Body</p>
          <TestComponent/>
        </div>
      </div>
    )
  }
});

class TestComponent extends Component{
  constructor(props) {
    super(props)
    this.state = {
      messages: null
    }
  }

  async componentDidMount() {
    try {
      let access_token = await this.props.auth.getAccessToken();
      console.log("access token", access_token)
      const response = await fetch('https://us-central1-smc2-e0416.cloudfunctions.net/react_client', {    
      headers: {
          Authorization: 'Bearer ' + access_token
        }
      });
      const json_response = await response.json()
      console.log(json_response)
      const token = json_response.firebaseAuthToken;
      firebase.auth().signInWithCustomToken(token)
      // const data = await response.json();
      // console.log("Response Data",data);
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    return <div>Check Console Log</div>
  }
}
TestComponent = withAuth(TestComponent);