import React, { Component } from "react";
import Request from '../helpers/Request';

export default class Profile extends Component {

    constructor() {
        super();

        this.user = null;
        this.state = {
            other: {},
            following: false
        };

        this.other_name = window.location.pathname.split('/').slice(1).pop();
        console.log(this.other_name);

    }

    componentDidMount() {

        this.user = this.props.user;

        Request('http://localhost:3001/user', {
            id: this.other_name
        })

        .then(data => {
            this.setState({other: data, following: this.user.following.indexOf(data.id) !== -1});
        })

        .catch((e) => {
            this.setState({ other: false, following: false });
        });

    }

    follow = (unfollow = false) => {

        console.log(unfollow ? 'Unfollowing' : 'Following');

        if(!this.state.other['id']) return;
        Request(`http://localhost:3001/${unfollow ? 'unfollow' : 'follow'}`, {
            token: this.user['token'],
            other: this.state.other['id']
        })

        .then(data => {
            
            this.user = {token: this.user.token, ...data};
            this.setState({following: this.user.following.indexOf(this.state.other.id) !== -1});
            this.render();

        })
        .catch((error) => console.warn('Unable to follow: ' + error));

    }

    render() {

        if(!this.user) return (<></>);

        return (

            <div className="pane content">

                <div className="header"></div>

                <div className="profile">

                    <div className="banner"></div>
                    <div className="details">
                        <img className="avatar" src={this.state.other !== false ? this.state.other.avatar : '/system.png'} alt={"Avatar of " + this.state.other.username}></img>
                        <div className="text">
                            <h2>{this.state.other !== false ? this.state.other.username : ''}</h2>
                            <h3>{this.state.other !== false ? ('@' + this.state.other.id) : 'No user found'}</h3>
                        </div>
                        {this.state.other !== false ? this.state.other.id === this.user.id ? <button className="follow">Edit Profile</button> : <button className="follow" onClick={this.state.following ? () => this.follow(true) : () => this.follow()}>{this.state.following ? 'Unfollow' : 'Follow'}</button> : ''}
                    </div>

                </div>

            </div>

        )

    }

}