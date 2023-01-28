import React from 'react'
import {Navigate} from "react-router-dom"
import MyForm from "../MyForm/MyForm";
import './Authorization.scss'

class Authorization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                firstname: '',
                lastname: '',
                group: '',
                password: ''
            },
            groups: [],
            authorize: !!localStorage.getItem('data')
        }
        this.admin = props.admin
    }

    onChangeProperties = (e) => {
        const target = e.target
        this.setState({
            form: {
                ...this.state.form,
                firstname: target.name === 'firstname' ? target.value.toLowerCase() : this.state.form.firstname,
                lastname: target.name === 'lastname' ? target.value.toLowerCase() : this.state.form.lastname,
                group: target.name === 'group' ? target.options[target.selectedIndex].dataset.id : this.state.form.group,
                password: target.name === 'password' ? target.value : this.state.form.password,
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
            this.props.appState.authorize ? <Navigate to={"UserPage/Index"}/>
                :
                <section className="authorization">
                    <h1>Авторизация</h1>
                    <MyForm admin={this.admin} groups={this.state.groups} postData={this.postDataAuthUser}
                            onChangeProperties={this.onChangeProperties}/>
                </section>
        );
    }
}

export default Authorization;