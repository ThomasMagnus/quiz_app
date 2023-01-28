import React, { Component } from 'react';
import Authorization from './components/Authorization/Authorization';
import AdminLayout from "./components/AdminPage/AdminLayout/AdminLayout";
import {Route, Routes} from "react-router-dom";
import UserPage from "./components/UserPage/UserPage";
import Main from "./components/Main/Main";
import AdminPage from "./components/AdminPage/Admin/AdminPage";
import TeacherPage from "./components/TeacherPage/TeacherPage";
import TeacherAuth from "./components/TeacherAuth/TeacherAuth";
import './app.scss'
import FirstPage from "./components/FirstPage/FirstPage";

export default class App extends Component {

    serverURL = 'http://localhost:5276/'

    state = {
        authorize: localStorage.getItem("accessToken" || 'accessAdminToken' || 'accessTokenTeacher') || '',
        userId: localStorage.getItem('userId') || '',
        teacherData: JSON.parse(localStorage.getItem('data')) || {},
        tokenWork: false,
        loader: false
    }

    postData = async (e, urlToAction, urlToPage, state, tokenName) => {
        e.preventDefault()
        const data = JSON.stringify(state)
        this.setState({loader: true})
        await fetch(urlToAction, {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://localhost:5276',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
                    'Chrome/102.0.5005.167 YaBrowser/22.7.5.1027 Yowser/2.5 Safari/537.36',
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            else return response
        })
        .then(data => {
            try {
                if (data[tokenName]) {
                    localStorage.setItem(tokenName, data[tokenName])
                    localStorage.setItem('userId', data['id'])

                    localStorage.setItem('data', JSON.stringify(data))

                    this.setState({teacherData: data})
                    this.setState({tokenWork: true})

                    fetch(urlToPage, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem(tokenName)}`
                        }
                    })
                        .then(response => {
                            this.setState({authorize: true})
                            document.location.reload()
                        })
                        .catch(e => {
                            console.log(e)
                            this.setState({loader: true})
                        })
                } else {
                    console.log(data)
                }
            }catch (ex) {
                console.log(ex)
                this.setState({loader: false})
            }

        })
    }

    render() {
        return (
            <Main loader={this.state.loader}>
                <Routes>
                    <Route path="/" element={<FirstPage/>}/>
                    <Route path="/authStudent" element={<Authorization admin={false} postData={this.postData} appState={this.state}/>}/>
                    <Route path="/adm" element={<AdminLayout admin={true} postData={this.postData} appState={this.state}/>}/>
                    <Route path="/teach" element={<TeacherAuth admin={true} postData={this.postData} appState={this.state}/>}/>
                    <Route path="/UserPage/Index" element={<UserPage/>}/>
                    <Route path={"/Teacher/TeacherPage/" + this.state.teacherData['login']} element={<TeacherPage appState={this.state} url={this.serverURL}/>}/>
                </Routes>
            </Main>
        );
    }
}
