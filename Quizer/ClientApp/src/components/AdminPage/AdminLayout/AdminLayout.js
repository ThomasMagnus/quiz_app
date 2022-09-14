import React from "react";
import {Form, Button} from "react-bootstrap";
import './AdminLayout.scss'

class AdminLayout extends React.Component {
    render() {
        return (
            <main className="main">
                <div className="container">
                    {this.props.children}
                </div>
            </main>
        )
    }
}

export default AdminLayout;