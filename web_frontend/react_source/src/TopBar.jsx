import React from 'react';
import AppBar from '@material-ui/core/AppBar'
import { Toolbar, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
  }));

function TopBar(props) {
    const classes = useStyles();
    const Login_Logout_Button = function(){
        if (props.authenticated){
            return <Button color="inherit" onClick={props.Logout_Method}>Logout</Button>
        }else{
            return <Button color="inherit" onClick={props.Login_Method}>Login</Button>
        }
    }();
    return (
        <div className={classes.root}>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography align="left" variant="h6" className={classes.title}>Kpin Konnect Smart Home</Typography>
                    {Login_Logout_Button}
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default TopBar;