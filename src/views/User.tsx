import { Component } from "react";
import { withRouter } from "react-router-dom";
import { ProfileData } from "../api_types";
import Search from "../components/Search";
import UserMenu from "../components/UserMenu";
import request from "../script/request";

interface UserState {

    user: ProfileData | null
    working: boolean

}

class User extends Component<any, UserState> {

    constructor(opts: any) {

        super(opts);
        this.state = {

            user: null,
            working: false,

        }

    }

    componentDidMount() {

        if (this.state.user !== null && !this.state.working) return;
        this.setState({ working: true });

        request(`/profile`, sessionStorage.getItem('token') || '', { identifier: this.props.match.params.username })
            .then(raw => {

                this.setState({
                    user: raw as ProfileData,
                    working: false
                });

            })

            .catch((error) => {

                // TODO: Display error message
                console.error("Error connecting to server", error);

            });

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

                <div className="ly3 main">

                    {/* Sidebar */}
                    <div className="panel"></div>

                    {/* Main content */}
                    <div className="panel main">

                        <div className="pane profile">

                            <div className="profile">
                                <div className="banner"></div>
                                <div className="content">
                                    <div className="user">
                                        <img src={this.state.user?.avatar || 'https://cdn.discordapp.com/attachments/605960705270611988/866875837709418546/image0.png'} alt="" />
                                        <h2>{this.state.user?.username}</h2>
                                        <sub>{this.state.user?.handle}</sub>
                                    </div>
                                    <div className="data">
                                        <h3><span>{this.state.user?.followers.length} </span>Followers</h3>
                                        <h3>Following <span>{this.state.user?.following.length}</span></h3>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Trending etc. */}
                    <div className="panel"></div>

                </div>

            </>

        )

    }

}

export default withRouter(User);