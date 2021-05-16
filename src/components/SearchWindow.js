import { Component } from "react";
import Request from "../helpers/Request";

export default class SearchWindow extends Component {

    constructor() {

        super();
        this.state = {
            data: [],
            query: null
        }

    }

    search = (event) => {

        let query = event.target.value.trim();
        if(this.state.query === query) return;

        this.setState({ query });
        if(!this.state.query) return;

        Request('http://localhost:3001/search', {
            token: this.props.user.token,
            query: this.state.query
        })

            .then(data => {
                this.setState({ data });
                this.render();
            })

    }

    clearSearch = () => {

        this.setState({
            query: null,
            data: []
        })

    }

    render() {

        return (
            <>
                <div className="search-box">
                    <i className="fas fa-search"></i>
                    <input type="text" placeholder="Search for anything" onInput={this.search} onPaste={this.search} onChange={this.search} onBlur={this.clearSearch}></input>
                </div>
                <div className={"search-window" + (this.state.query ? ' searching' : '')}>
                    {this.state.data.map(u => {
                        return (
                            <div className="user" key={u.id} onClick={() => window.location.pathname = `/profile/${u.handle}`}>
                                <img alt={"Avatar of " + u.avatar} src={u.avatar}></img>
                                <div className="text">
                                    <h2>{u.username}</h2>
                                    <h3>@{u.handle}</h3>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </>
        );

    }

}