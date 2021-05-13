import React, { Component } from "react";
import Request from '../helpers/Request';

export default class Content extends Component {

    constructor() {
        super();

        this.state = {
            user: {},
            other: {},
            following: false
        };

    }

    componentDidMount(props) {

        console.log('User Props', this.props.user);

        Request('http://localhost:3001/user', {
            id: 'System'
        })

        .then(data => {
            this.setState({other: data, following: this.props.user.following.indexOf(this.state.other.id) !== -1});
            console.log('Other', this.state.other)
        })
        .catch((e) => {
            console.warn(e);
        });

    }

    follow = (unfollow = false) => {

        if(!this.state.other['id']) return;
        Request(`http://localhost:3001/${unfollow ? 'unfollow' : 'follow'}`, {
            token: this.props.user['token'],
            other: this.state.other['id']
        })

        .then(() => console.log('Done!'))
        .catch((error) => console.warn('Unable to follow: ' + error));

    }

    render() {

        return (

            <div className="pane content">

                <div className="header"></div>

                <div className="profile">

                    <div className="banner"></div>
                    <div className="details">
                        <img className="avatar" src={this.state.other.avatar} alt={"Avatar of " + this.state.other.username}></img>
                        <div className="text">
                            <h2>{this.state.other.username}</h2>
                            <h3>@{this.state.other.id}</h3>
                        </div>
                        <button className="follow" onClick={this.state.following ? () => this.follow(true) : () => this.follow()}>{this.state.following ? 'Unfollow' : 'Follow'}</button>
                    </div>

                </div>

            </div>

        )

    }

}