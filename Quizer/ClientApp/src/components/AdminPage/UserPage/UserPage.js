import React from 'react';
import "./UserPage.scss";

class UserPage extends React.Component {

    getPage() {
        fetch("https://localhost:7276/UserPage/Index")
            .then(response => {
                console.log(response)
            })
    }

    componentDidMount() {
        this.getPage()
    }

    render() {
        return (
            <h1>User page</h1>
        )
    }
}

export default UserPage;