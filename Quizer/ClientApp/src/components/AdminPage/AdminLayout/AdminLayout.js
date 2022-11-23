import React from "react";
import {Navigate} from "react-router-dom";
import './AdminLayout.scss'
import MyForm from "../../MyForm/MyForm";

class AdminLayout extends React.Component {
    constructor(props) {
        super(props);
        this.admin = props.admin

        this.state = {
            adminForm: {
                firstname: '',
                lastname: '',
                password: ''
            }
        }
    }

    onChangeProperties = (e) => {
        const target = e.target
        this.setState({
            adminForm: {
                ...this.state.adminForm,
                firstname: target.name === 'firstname' ? target.value.toLowerCase() : this.state.adminForm.firstname,
                lastname: target.name === 'lastname' ? target.value.toLowerCase() : this.state.adminForm.lastname,
                password: target.name === 'password' ? target.value.toLowerCase() : this.state.adminForm.password,
            }
        })
    }

    postDataAdmin = (e, urlToAction = 'https://localhost:7276/Admin/Index/1', urlToPage = 'https://localhost:7276/AdminPage/Index') => {
        this.props.postData(e, urlToAction, urlToPage, this.state.adminForm, 'accessAdminToken');
    }

    render() {
        return (
            this.props.appState.authorize ? <Navigate to={'/AdminPage/Index/' + this.props.appState.userId}/> :
            <section className="authorization">
                <h1>Авторизация</h1>
                <MyForm admin={this.admin} onChangeProperties={this.onChangeProperties} postData={this.postDataAdmin}/>
            </section>
        )
    }
}

export default AdminLayout;