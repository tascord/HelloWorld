import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React, { Component } from 'react';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
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

        if (!getToken()) return;
        Request('http://localhost:3001/self', {
            token: getToken()
        })

            .then(data => {
                this.setState({ user: { token: getToken(), ...data } });
            })
            .catch((e) => {
                console.warn(e);
                delToken();
                window.location.search = '';
            });

    }

    render() {

        if (!this.state.user['id'] && getToken() !== undefined) {
            return <></>;
        }

        if (!getToken() && login_urls.indexOf(window.location.pathname) === -1) return <Login setToken={setToken}></Login>
        if (window.location.search && login_urls.indexOf(window.location.pathname)) window.location = window.location.origin + window.location.pathname;

        return (
            <div className="wrapper">
                <BrowserRouter>
                    <Switch>

                        {/* Feed */}
                        <Route path="/dashboard">
                            <Dashboard user={this.state.user} />
                        </Route>

                        <Route path="/profile">
                            <Profile user={this.state.user} />
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