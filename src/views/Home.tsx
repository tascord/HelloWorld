import { Component } from "react";
import Search from "../components/Search";
import UserMenu from "../components/UserMenu";

export default class Home extends Component {

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

                <div className="ly main">

                    {/* Sidebar */}
                    <div className="panel"></div>

                    {/* Main content */}
                    <div className="panel main">
                        
                    </div>

                    {/* Trending etc. */}
                    <div className="panel"></div>

                </div>

            </>

        );

    }

}