import { Component } from "react";
import { ProfileData } from "../api_types";
import request from "../script/request";

interface UserMenuProps { }
interface UserMenuState {
    is_open: boolean;
    user: ProfileData | null;
}

export default class UserMenu extends Component<UserMenuProps, UserMenuState> {

    constructor(opts: UserMenuProps) {

        super(opts);
        this.state = {
            is_open: false,
            user: null
        };

    }

    componentDidMount = () => {

        request('/self', window.sessionStorage.getItem('token') || '', {})
            .then(user => this.setState({ user: user as ProfileData }))
            .catch(() => { })

    }

    menu = () => {

        if (this.state.user === null) {

            return (
                <>
                    <a href="/login">Login / Register</a>
                </>
            )

        }

        return (

            <>
                <div className="user">
                    <h2>{this.state.user.username}</h2>
                    <h3>{this.state.user.handle}</h3>
                </div>
                <a href={`/user/${this.state.user.handle}`}>Profile</a>
                <a href="/logout">Logout</a>
            </>

        )

    }

    render() {

        return (
            <div className={!this.state.is_open ? "user-menu" : "user-menu open"}>
                <img className="icon" onClick={() => this.setState({ is_open: !this.state.is_open })} src={this.state.user
                    ?.avatar || 'https://cdn.discordapp.com/attachments/605960705270611988/866875837709418546/image0.png'} alt="" />
                <div className="menu">
                    {this.menu()}
                </div>
            </div>
        );

    }

}
