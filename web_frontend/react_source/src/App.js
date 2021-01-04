import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';
import {
  BrowserRouter as Router,
  // Switch,
  Route
} from "react-router-dom";
import { SecureRoute, Security, LoginCallback } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';
import Home from './Home';

const oktaAuth = new OktaAuth({
  issuer: 'https://dev-496306.okta.com/oauth2/default',
  clientId: '0oa1wdt4ccM1ijs5c357',
  redirectUri: window.location.origin + '/login/callback'
});

let theme = createMuiTheme({
    palette: {
      primary: {
        light: '#b2fab4',
        main: '#81c784',
        dark: '#519657',
        contrastText: '#000000',
      },
      secondary: {
        light: '#c1d5e0',
        main: '#90a4ae',
        dark: '#62757f',
        contrastText: '#000000',
      },
    },
  })
function App() {
  return (
    <div className="App">
      <Router>
        <ThemeProvider theme={theme}>
          {/* <Switch> */}
          <Security oktaAuth={oktaAuth}>
            <Route path="/" component={Home}/>
            <Route path='/login/callback' component={LoginCallback} />
            </Security>
          {/* </Switch> */}
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
