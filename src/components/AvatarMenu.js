import { Component } from "react";

export default class AvatarMenu extends Component {

    constructor() {
        super();
        this.state = {
            open: false
        }
    }

    componentDidMount() {
        document.body.addEventListener('click', (event) => {

            // Close menu
            if(event.target ? event.target.id !== "avatarMenu" : true) this.setState({ open: false });

        }, true)
    }

    logOut() {
        sessionStorage.removeItem('token');
        console.log('Cleared token from AvatarMenu');
        window.location.pathname = '/';
    }

    render() {

        return (
            <>
                <img id="avatarMenu" alt="Avatar" src={this.props.user.avatar} onClick={() => this.setState({ open: !this.state.open })}></img>
                <div className={"profileMenu" + (this.state.open ? " open" : "")}>
                    <a href={`/profile/${this.props.user.handle}`}><i className="fas fa-user"></i> Profile</a>
                    <a href="/bugs"><i className="fas fa-bug"></i> Bugs</a>
                    <a href="https://discord.gg/NeqVuSy" target="__blank"><i className="fab fa-discord"></i> Discord</a>
                    <button onClick={this.logOut}><i className="fas fa-sign-out-alt"></i> Log Out</button>
                </div>
            </>
        )

    }

}