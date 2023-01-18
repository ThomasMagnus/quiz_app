import React from "react";
import {Navigate} from "react-router-dom";
import MyForm from "../MyForm/MyForm";
import {detectLocalStorage, onChangeProperties} from "../../Services/services";

class TeacherAuth extends React.Component {
    constructor(props) {
        super(props);
        this.admin = props.admin
        this.onChangeProperties = onChangeProperties.bind(this)

        this.state = {
            form: {
                fname: '',
                lname: '',
                login: '',
                password: ''
            },
            auth: !!localStorage.getItem('data')
        }
    }

    postDataTeacher = (e, urlToAction = 'http://localhost:5276/Teacher/Index', urlToPage = 'http://localhost:5276/Teacher/TeacherPage/' +
                        this.state.form.login) => {
        this.props.postData(e, urlToAction, urlToPage, this.state.form, 'accessTokenTeacher')
    }

    componentDidMount() {
        if (localStorage.getItem('data')) this.setState({auth: true})
    }

    render() {
        return (
            this.state.auth ?
                <Navigate to={'/Teacher/TeacherPage/' + this.props.appState.teacherData['login']}/>
                    :
                <section className="authorization">
                    <h1>Авторизация преподавателя</h1>
                    <MyForm admin={this.admin} onChangeProperties={this.onChangeProperties}
                            postData={this.postDataTeacher}/>
                </section>
        )
    }
}

export default TeacherAuth;