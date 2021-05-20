import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React, { Component } from 'react';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Request from './helpers/Request';

import './style/main.css'

const login_urls = [
    '/discord'
]

const locations = {
    self: 'http://localhost:3000',
    api: 'http://localhost:3001',

    // self: 'https://bedroom.community',
    // api: 'https://api.bedroom.community'
}

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
        Request(`${locations.api}/self`, {
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

        if (!getToken() && login_urls.indexOf(window.location.pathname) === -1) return <Login setToken={setToken} locations={locations}></Login>
        if (window.location.search && login_urls.indexOf(window.location.pathname)) window.location = window.location.origin + window.location.pathname;

        return (
            <div className="wrapper">
                <BrowserRouter>
                    <Switch>

                        {/* Feed */}
                        <Route path="/dashboard">
                            <Dashboard user={this.state.user} locations={locations} />
                        </Route>

                        <Route path="/profile">
                            <Profile user={this.state.user} locations={locations} />
                        </Route>

                        {/* Discord Login */}
                        <Route path="/discord">
                            <Login setToken={setToken} discord="true" locations={locations} />
                        </Route>

                    </Switch>
                </BrowserRouter>
            </div>
        );

    }

}