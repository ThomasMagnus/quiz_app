﻿import React from 'react'
import {Navigate} from "react-router-dom"
import MyForm from "../MyForm/MyForm";
import './Authorization.scss'
import Alert from 'react-bootstrap/Alert';

class Authorization extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            form: {
                Firstname: '',
                Lastname: '',
                Patronymic: '',
                GroupsId: '',
                Password: ''
            },
            groups: [],
            authorize: !!localStorage.getItem('data'),
            alert: false
        }
        this.admin = props.admin
    }

    onChangeProperties = (e) => {
        const target = e.target
        this.setState({
            form: {
                ...this.state.form,
                Firstname: target.name === 'firstname' ? target.value.toLowerCase() : this.state.form.Firstname,
                Lastname: target.name === 'lastname' ? target.value.toLowerCase() : this.state.form.Lastname,
                Patronymic: target.name === 'patronymic' ? target.value.toLowerCase() : this.state.form.Patronymic,
                GroupsId: target.name === 'group' ? target.options[target.selectedIndex].dataset.id : this.state.form.GroupsId,
                Password: target.name === 'password' ? target.value : this.state.form.Password,
            }
        })
    }

    detectToken = () => {
        const token = localStorage.getItem("accessToken")
        if (token) {
            fetch('http://localhost:5276/Authorization/DetectToken', {
                method: 'POST',
                body: JSON.stringify({'accessToken': token}),
                headers: {
                    'Content-Type': 'Application/json'
                }
            })
                .then(response => {
                    console.log(response)
                    return response.json()
                })
                .then(data => {
                    this.setState({authorize: data.accessToken})
                })
        }
    }

    postDataAuthUser = (e, urlToAction = 'http://localhost:5276/Authorization/Auth',
                        urlToPage = 'http://localhost:5276/UserPage/Index') => {
        this.props.postData(e, urlToAction, urlToPage, this.state.form, 'accessToken')
        console.log(JSON.stringify(this.state.form))
    }

    getGroups = async () => await fetch('http://localhost:5276/Authorization/GetGroups')

    componentDidMount() {
        this.getGroups()
            .then(response => response.json())
            .then(data => this.setState({groups: data}))

        this.detectToken()
    }

    render() {
        return (
            this.props.appState.authorize ? <Navigate to="/UserPage/Index"/>
                :
                <section className="authorization">
                    {this.props.text ?
                        <Alert key='danger' variant='danger' className='teacher__alert'>
                            {this.props.text}
                        </Alert> : ''}
                    <h1>Авторизация</h1>
                    <MyForm admin={this.admin} groups={this.state.groups} postData={this.postDataAuthUser}
                            onChangeProperties={this.onChangeProperties}/>
                </section>
        );
    }
}

export default Authorization;