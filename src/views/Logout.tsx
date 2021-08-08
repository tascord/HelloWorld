import { Component } from "react";

export default class Logout extends Component {

    componentDidMount() {

        window.sessionStorage.removeItem('token');
        window.location.href = "/";

    }

    render = () => {
        return <></>;
    }

}