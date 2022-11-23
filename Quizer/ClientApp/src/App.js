import React, { Component } from 'react';
import Authorization from './components/AdminPage/Authorization/Authorization';
import AdminLayout from "./components/AdminPage/AdminLayout/AdminLayout";
import {Route, Routes} from "react-router-dom";
import UserPage from "./components/AdminPage/UserPage/UserPage";
import Main from "./components/Main/Main";
import AdminPage from "./components/AdminPage/Admin/AdminPage";

export default class App extends Component {

    state = {
        authorize: localStorage.getItem("accessToken" || 'accessAdminToken'),
        userId: localStorage.getItem('userId')
    }

    postData = async (e, urlToAction, urlToPage, state, tokenName) => {
        e.preventDefault()
            const data = JSON.stringify(state)
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
                if (response.ok) { return response.json() }
                else { return response }
            })
            .then(data => {

                if (data[tokenName]) {
                    localStorage.setItem(tokenName, data[tokenName])
                    localStorage.setItem('userId', data['id'])

                    this.setState({userId: data['id']})
                    fetch(urlToPage, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem(tokenName)}`
                        }
                    })
                        .then(response => {
                            this.setState({authorize: true})
                        })
                } else {
                    console.log(data)
                }

            })
    }

    render() {
        return (
            <Main>
                <Routes>
                    <Route path="/" element={<Authorization admin={false} postData={this.postData} appState={this.state}/>}/>
                    <Route path="/UserPage/Index" element={<UserPage/>}/>
                    <Route path="/adm" element={<AdminLayout admin={true} postData={this.postData} appState={this.state}/>}/>
                    <Route path={"/AdminPage/Index/" + this.state.userId} element={<AdminPage/>}/>
                </Routes>
            </Main>
        );
    }
}
