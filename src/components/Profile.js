import React, { Component } from "react";
import Request from '../helpers/Request';
import SearchWindow from "./SearchWindow";

export default class Profile extends Component {

    constructor() {
        super();

        this.user = null;
        this.state = {
            other: {},
            following: false,
            editOpen: false,
            edits: {
                username: '',
                handle: '',
                avatar: ''
            }
        };

        this.other_name = window.location.pathname.split('/').slice(1).pop();

    }

    componentDidMount() {

        this.user = this.props.user;

        Request('http://localhost:3001/user', {
            handle: this.other_name
        })

            .then(data => {
                this.setState({ other: data, following: this.user.following.indexOf(data.id) !== -1, edits: { username: data.username, handle: data.handle, avatar: data.avatar } });
            })

            .catch((e) => {
                this.setState({ other: false, following: false });
            });

    }

    follow = (unfollow = false) => {

        if (!this.state.other['id']) return;
        Request(`http://localhost:3001/${unfollow ? 'unfollow' : 'follow'}`, {
            token: this.user['token'],
            other: this.state.other['id']
        })

            .then(data => {

                this.user = { token: this.user.token, ...data };
                this.setState({ following: this.user.following.indexOf(this.state.other.id) !== -1 });
                this.render();

            })
            .catch((error) => console.warn('Unable to follow: ' + error));

    }

    saveEdits = (event) => {

        Request('http://localhost:3001/edit', {
            token: this.props.user.token,
            username: document.getElementById('username').value,
            handle: document.getElementById('handle').value,
            avatar: document.getElementById('avatar').value,
        })

        .then((new_user) => {
            document.getElementById('error').innerText = '';
            
            this.setState({
                editOpen: false
            });

            if(new_user.handle !== this.user.handle) window.location.pathname = `/profile/${new_user.handle}`;
        })

        .catch((error) => {
            document.getElementById('error').innerText = error;
        })

        event.preventDefault();
        return false;

    }

    handleEdits = (event) => {
        
        let edits = this.state.edits;
        
        if(event.target.id === 'username') {
            if(!/^.{0,20}$/.test(event.target.value)) event.target.classList = 'invalid';
            else event.target.classList = '';
            edits.username = event.target.value;
        }
        
        else if(event.target.id === 'handle') {
            if(!/^[A-z0-9_.]{0,15}$/.test(event.target.value)) event.target.classList = 'invalid';
            else event.target.classList = '';
            edits.handle = event.target.value;
        }

        if(event.target.id === 'avatar') {
            if(!/^.+$/.test(event.target.value)) event.target.classList = 'invalid';
            else event.target.classList = '';
            edits.avatar = event.target.value;
        }

        this.setState({ edits })
    }

    exitEdits = (event) => {

        if(!(event.srcElement || event.target).classList.contains('edit')) return;

        this.setState({
            edits: {
                username: this.state.other.username,
                handle: this.state.other.handle,
                avatar: this.state.other.avatar,
            },
            editOpen: false
        })
    }

    render() {

        if (!this.user) return (<></>);

        return (

            <div className="pane content">

                <div className="header">
                    <SearchWindow user={this.props.user} />
                </div>

                <div className={"edit" + (this.state.editOpen ? " open" : "")} onClick={this.exitEdits}>
                    <form>
                        <label>
                            <h3 className="error" id="error" aria-hidden="true"></h3>
                        </label>
                        <label>
                            <h3>Username</h3>
                            <input id="username" type="text" autoComplete="off" autoCorrect="off" value={this.state.edits.username} onChange={this.handleEdits}></input>
                        </label>
                        <label>
                            <h3>Handle</h3>
                            <input id="handle" type="text" autoComplete="off" autoCorrect="off" value={this.state.edits.handle} onChange={this.handleEdits}></input>
                        </label>
                        <label>
                            <h3>Avatar (URL)</h3>
                            <input id="avatar" type="text" autoComplete="off" autoCorrect="off" value={this.state.edits.avatar} onChange={this.handleEdits}></input>
                        </label>
                        <label>
                            <button onClick={this.saveEdits}><i className="fas fa-save"></i> Save</button>
                        </label>
                    </form>
                </div>

                <div className="profile">

                    <div className="banner"></div>
                    <div className="details">
                        <img className="avatar" src={this.state.other !== false ? this.state.other.avatar : '/system.png'} alt={"Avatar of " + this.state.other.username}></img>
                        <div className="text">
                            <h2>{this.state.other !== false ? this.state.other.username : ''}</h2>
                            <h3>{this.state.other !== false ? ('@' + this.state.other.handle) : 'No user found'}</h3>
                        </div>
                        {
                            this.state.other !== false ?
                                this.state.other.handle === this.user.handle ?
                                    <button className="follow" onClick={() => this.setState({ editOpen: true })}><i className="fas fa-user-edit"></i> Edit Profile</button> : // Edit profile
                                    this.state.following ?
                                        <button className="follow red" onClick={() => this.follow(true)}><i className="fas fa-user-minus"></i> Unfollow</button> : // Unfollow
                                        <button className="follow" onClick={() => this.follow()}><i className="fas fa-user-plus"></i> Follow</button> : // Follow
                                ''
                        }

                    </div>

                </div>

            </div>

        )

    }

}