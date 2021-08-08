import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './style/main.css';

import Home from './views/Home';
import Login from './views/Login';
import User from './views/User';
import Logout from './views/Logout';

ReactDOM.render(
    <React.StrictMode>

        <BrowserRouter>
            <Switch>

                {/* Login */}
                <Route path="/login">
                    <Login />
                </Route>

                {/* Logout */}
                <Route path="/logout">
                    <Logout />
                </Route>

                {/* Profiles */}
                <Route path="/user/:username">
                    <User />
                </Route>

                {/* Home */}
                <Route path="/">
                    <Home />
                </Route>

            </Switch>
        </BrowserRouter>

    </React.StrictMode>,
    document.getElementById('root')
);
