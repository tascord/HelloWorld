import { Component } from "react";
import Request from '../helpers/Request';

export default class Sidebar extends Component {

    constructor() {

        super();

        this.state = {
            following: []
        }

    }

    componentDidMount() {

        let count = 0;
        let following = [];

        this.props.user.following.forEach(i => {

            Request('http://localhost:3001/user', {
                id: i
            })

            .then(data => {
                count++;
                following.push(data);
                if(count === this.props.user.following.length) this.setState({ following });

            })
            
            .catch((e) => {
                console.warn(e);
                count++;
            });

        })

    }

    render() {

        return (
            <div className={"sidebar pane" + (this.props.tablet ? " tablet" : "")}>
                <div className="header">
                    <h2><a href="/dashboard">BR.C</a></h2>
                </div>
                <div className="following">
                    <h2>Following</h2>
                    {
                        this.state.following.map(u => {

                            return (
                                <div className="panel user" key={u.id} onClick={() => window.location.pathname = `/profile/${u.handle}`}>
                                    {u.live ? <div className="live-indicator" title="User is live"></div> : ''}
                                    <img alt={"Avatar of " + u.username} src={u.avatar}></img>
                                    <div className="text">
                                        <h2>{u.username}</h2>
                                        <h3>@{u.handle}</h3>
                                    </div>
                                </div>
                            )

                        })
                    }
                </div>
            </div>
        );

    }

}