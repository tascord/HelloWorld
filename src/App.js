import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React, { Component } from 'react';

import { Dashboard } from './pages/Dashboard';
import Preferences from './pages/Preferences';
import Login from './pages/Login';
import Request from './helpers/Request';

import './style/main.css'

const login_urls = [
    '/discord'
]

function setToken(token) {
    sessionStorage.setItem('token', token);
    console.log('Token set');
}

function getToken(token) {
    console.log('Token retrieved')
    return sessionStorage.getItem('token') || undefined;
}

function delToken() {
    sessionStorage.removeItem('token');
    console.log('Cleared token');
}

export default class App extends Component {

    constructor() {
        super();

        this.state = {};
        this.state.user = {};
    }

    componentDidMount() {

        if(!getToken()) return;
        Request('http://localhost:3001/self', {
            token: getToken()
        })

        .then(data => {
            this.setState({user: {token: getToken(), ...data}});
            console.log('Set State', data);
        })
        .catch((e) => {
            console.warn(e);
            delToken();
        });

    }

    render() {

        if(!this.state.user['id'] && getToken()) {
            return <h1>Loading...</h1>
        }

        console.log(`Saved token: ${getToken()}`);
        if (!getToken() && login_urls.indexOf(window.location.pathname) === -1) return <Login setToken={setToken}></Login>

        return (
            <div className="wrapper">
                <BrowserRouter>
                    <Switch>

                        {/* Main App */}
                        <Route path="/dashboard">
                            <Dashboard user={this.state.user} />
                        </Route>

                        {/* Settings */}
                        <Route path="/preferences">
                            <Preferences />
                        </Route>

                        {/* Discord Login */}
                        <Route path="/discord">
                            <Login setToken={setToken} discord="true" />
                        </Route>

                    </Switch>
                </BrowserRouter>
            </div>
        );

    }

}