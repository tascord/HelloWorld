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
                this.setState({ other: data, following: this.user.following.indexOf(data.id) !== -1, edits: { username: data.username, handle: data.handle } });
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

    handleEdits = (event) => {

        let edits = this.state.edits;

        if (event.target.id === 'username') {
            if (!/^.{0,20}$/.test(event.target.value)) event.target.classList = 'invalid';
            else event.target.classList = '';
            edits.username = event.target.value;
        }

        else if (event.target.id === 'handle') {
            if (!/^[A-z0-9_.]{0,15}$/.test(event.target.value)) event.target.classList = 'invalid';
            else event.target.classList = '';
            edits.handle = event.target.value;
        }

        this.setState({ edits })
    }

    imageUpload = () => {


        let file = document.getElementById('avatar').files[0];
        if (!file) return console.log('No file');
        else console.log('File!');

        let reader = new FileReader();
        reader.onload = (event) => {
            console.log('File read!');
            document.getElementById('imagePreview').src = event.target.result;
        }

        reader.readAsDataURL(file);


    }

    exitEdits = (event) => {

        if (!(event.srcElement || event.target).classList.contains('edit')) return;

        this.setState({
            edits: {
                username: this.state.other.username,
                handle: this.state.other.handle,
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
                    <form action="http://localhost:3001/edit" method="POST" encType="multipart/form-data">
                        <label>
                            <div className="imageUpload">
                                <input name="avatar" id="avatar" type="file" onChange={this.imageUpload}></input>
                                <img alt="Avatar" id="imagePreview" src={this.props.user.avatar}></img>
                            </div>
                        </label>
                        <label>
                            <h3 className="error" id="error" aria-hidden="true"></h3>
                        </label>
                        <label>
                            <h3>Username</h3>
                            <input name="username" id="username" type="text" autoComplete="off" autoCorrect="off" value={this.state.edits.username} onChange={this.handleEdits}></input>
                        </label>
                        <label>
                            <h3>Handle</h3>
                            <input name="handle" id="handle" type="text" autoComplete="off" autoCorrect="off" value={this.state.edits.handle} onChange={this.handleEdits}></input>
                        </label>
                        <label>
                            <button><i className="fas fa-save"></i> Save</button>
                        </label>
                        <input type="text" hidden="true" name="token" value={this.props.user.token}></input>
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