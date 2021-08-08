import { Component } from "react";
import { ProfileData } from "../api_types";
import request from "../script/request";

interface SearchState {

    open: boolean

    query: string
    results: ProfileData[]
    loaded: boolean

    timer: NodeJS.Timeout | null

}

export default class Search extends Component<any, SearchState> {

    constructor(opts: any) {

        super(opts);
        this.state = {
            open: false,

            query: '',
            results: [],
            loaded: true,

            timer: null
        };

    }

    on_change = (event: any) => {

        this.setState({ open: event.target.value.length > 0, query: event.target.value });

        if (this.state.timer) clearTimeout(this.state.timer);
        if (event.target.value.length === 0) return;

        this.setState({ loaded: false, timer: setTimeout(this.do_search, 750) });

    }

    do_search = () => {

        request('/search', undefined, { query: this.state.query })
            .then((response: any) => {
                this.setState({ loaded: true, results: (response.users || []) as ProfileData[] })
            })
            .catch(console.warn)

    }

    format_results = () => {

        if (this.state.results.length === 0 && this.state.loaded) {

            return (
                <div className="result none">
                    <div className="content">
                        <h2>No results found.</h2>
                    </div>
                </div>
            )

        }

        return this.state.results.map((user, index) => {

            return (

                <div className="result" onClick={() => window.location.href = `/user/${user.handle}`} key={index}>
                    <img src={user.avatar || 'https://cdn.discordapp.com/attachments/605960705270611988/866875837709418546/image0.png'} alt={`Avatar of ${user.username}`} />
                    <div className="content">
                        <h2>{user.username}</h2>
                        <h3>{user.handle}</h3>
                    </div>
                </div>

            )

        })

    }

    render() {

        // Search box
        return (
            <div className={"search" + (this.state.open ? ' open' : '')}>
                <input type="text" placeholder="Search" onChange={this.on_change} value={this.state.query} autoComplete={'off'} spellCheck={false} />
                <div className="results">
                    {this.format_results()}
                </div>
            </div>
        );

    }

}