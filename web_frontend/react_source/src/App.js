import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Security, ImplicitCallback } from '@okta/okta-react';
import Home from './Home';

const config = {
  issuer: 'https://dev-496306.okta.com/oauth2/default',
  redirectUri: window.location.origin + '/implicit/callback',
  clientId: '0oa1wdt4ccM1ijs5c357',
  pkce: true
}

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
          <Security {...config}>
            <Route path="/" component={Home}/>
            <Route path='/implicit/callback' component={ImplicitCallback} />
            </Security>
          {/* </Switch> */}
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
