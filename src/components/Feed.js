import { Component } from "react";
import SearchWindow from "../components/SearchWindow";

export default class Actions extends Component {

    render() {

        return (
            <div className="pane content">
                <div className="header">
                    <SearchWindow user={this.props.user} />
                </div>
                <h2>Feed</h2>
            </div>
        );

    }

}