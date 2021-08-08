import { Component, FormEvent } from "react";
import Search from "../components/Search";
import UserMenu from "../components/UserMenu";
import request from "../script/request";

interface LoginState {
    username: string
    password: string
    email: string
    register: boolean
    message: string
    working: boolean
    valid: {
        username: boolean,
        password: boolean,
        email: boolean
    }
}

export default class Login extends Component<any, LoginState> {

    constructor(opts: any) {

        super(opts);
        this.state = {
            username: '',
            password: '',
            email: '',
            register: false,
            message: '',
            working: false,
            valid: {
                username: true,
                password: true,
                email: true
            },
        }

    }

    handle_submit = (event: FormEvent): Boolean => {

        event.preventDefault();

        if (this.state.working) return false;
        this.setState({ working: true });

        if (this.state.register) {

            request('/register', undefined, { username: this.state.username, password: this.state.password, email: this.state.email })
                .then((response: any) => {

                    // Successful register
                    this.setState({ message: '' });
                    window.sessionStorage.setItem('token', response.session.token);
                    window.location.href = '/dash';


                })

                .catch(error => {

                    // Unsuccessful register
                    this.setState({ working: false, message: error.message || "Error registering, try again" });

                });


        }

        else {

            request('/login', undefined, { username: this.state.username, password: this.state.password })

                .then((response: any) => {

                    // Successful login
                    this.setState({ message: '' });
                    window.sessionStorage.setItem('token', response.session.token);
                    window.location.href = '/dash';

                })

                .catch(error => {

                    // Unsuccessful login
                    this.setState({ working: false, message: error.message || "Error attempting login, try again" });

                });


        }

        return false;

    }

    // TODO: What event type is this?
    handle_change = (event: any) => {

        const target = event.target;

        if (!target) return;
        if (['password', 'username', 'email'].indexOf(target.name) === -1) return;

        switch (target.name) {

            case 'username':
                this.setState({ valid: { ...this.state.valid, username: target.value.length > 3 && target.value.length <= 25 } });
                break;

            case 'password':

                const password = target.value;

                // Password requirements
                let password_valid = password.length > 8 && password.length <= 128;
                if (!/[0-9]/.test(password)) password_valid = false;
                if (!/[A-Z]/.test(password)) password_valid = false;
                if (!/[a-z]/.test(password)) password_valid = false;

                this.setState({ valid: { ...this.state.valid, password: password_valid } });
                break;

            case 'email':

                // Check for valid email
                this.setState({ valid: { ...this.state.valid, email: /^.+?@.+?\..+$/.test(target.value) } });
                break;

        }

        let state_shift: { [key: string]: string } = {};
        state_shift[target.name] = target.value;
        this.setState(state_shift as any);

    }

    render() {

        return (

            <>

                <div className="ly3 header">

                    <div className="panel">
                        <a href="/">
                            <h1 className="logo">
                                brc
                            </h1>
                        </a>
                    </div>

                    <div className="panel main">
                        <Search />
                    </div>

                    <div className="panel">
                        <UserMenu />
                    </div>

                </div>

                <div className="ly main">

                    {/* Sidebar */}
                    <div className="panel"></div>

                    {/* Main content */}
                    <div className="panel main">

                        {/* Login Form */}
                        <form className="pane login" onSubmit={this.handle_submit}>
                            <div className="tabs">
                                <button type="button" disabled={this.state.working} className={"tab " + (this.state.register ? '' : 'active')} onClick={() => this.setState({ register: false })}>Login</button>
                                <button type="button" disabled={this.state.working} className={"tab " + (this.state.register ? 'active' : '')} onClick={() => this.setState({ register: true })}>Register</button>
                            </div>
                            <h3 className="message">{this.state.message}</h3>
                            <input autoComplete={'off'} disabled={this.state.working} className={(this.state.valid.username || !this.state.register) ? '' : 'invalid'} type="text" name="username" placeholder="Handle" value={this.state.username} onChange={this.handle_change} />
                            {this.state.register ? <input disabled={this.state.working} className={this.state.valid.email ? '' : 'invalid'} type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.handle_change} /> : <></>}
                            <input disabled={this.state.working} className={(this.state.valid.password || !this.state.register) ? '' : 'invalid'} type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handle_change} />
                            <input disabled={this.state.working} type="submit" value="Login" />
                        </form>

                    </div>

                    {/* Trending etc. */}
                    <div className="panel"></div>

                </div>

            </>

        );

    }

}