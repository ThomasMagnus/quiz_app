import React, {Component} from 'react'
import {Navigate} from "react-router-dom";
import {getPage, detectLocalStorage} from "../../../Services/services";

class AdminPage extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        getPage("https://localhost:7276/AdminPage/Index", 'accessAdminToken')
    }

    render() {
        return (
            <>
                {detectLocalStorage('accessAdminToken') ? <h1>Hello, Admin</h1> : <Navigate to={'/'}/>}
            </>
        )
    }
}

export default AdminPage