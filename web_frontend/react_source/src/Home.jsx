import React, { Component } from 'react';
import './App.css';
import TopBar from './TopBar';
import { withOktaAuth  } from '@okta/okta-react';
// import * as firebase from 'firebase';

export default withOktaAuth (class Home extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  async login() {
    // Redirect to '/' after login
    this.props.oktaAuth.signInWithRedirect();
  }

  async logout() {
    // Redirect to '/' after logout
    this.props.oktaAuth.signOut('/');
  }

  render() {
    const {isAuthenticated, accessToken, idToken}  = this.props.authState;
    console.log(this.props.authState)
    return (
      <div>
        <TopBar Login_Method={this.login} Logout_Method={this.logout} authenticated={isAuthenticated}/>
        <div className="App-body">
          <p>Application Body</p>
          <TestComponent accessToken={accessToken} idToken={idToken}/>
        </div>
      </div>
    )
  }
});

class TestComponent extends Component{
  render() {
      const {accessToken, idToken} = this.props;
      console.log("access token", accessToken)
      // const response = await fetch('https://us-central1-smc2-e0416.cloudfunctions.net/react_client', {    
      // headers: {
      //     Authorization: 'Bearer ' + accessToken
      //   }
      // });
      // const json_response = await response.json()
      // console.log(json_response)
      // const token = json_response.firebaseAuthToken;
      // firebase.auth().signInWithCustomToken(token)
      // const data = await response.json();
      // console.log("Response Data",data);
      if (accessToken){
        return (<div>
          Access Token is: 
          <div className='accessToken'>
          {accessToken.value} 
          </div>
          ID Token is:
          {idToken.value}
          </div>)
      } else {
        return <div>Please sign in for access Token</div>
      }
      
  }
}
// TestComponent = withAuth(TestComponent);