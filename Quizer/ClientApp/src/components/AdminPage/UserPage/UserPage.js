import React from 'react';
import "./UserPage.scss";
import {Navigate} from "react-router-dom";
import {getPage, detectLocalStorage} from "../../../Services/services";
import {Button} from "react-bootstrap";

class UserPage extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        subjects: [],
        userProps: {}
    }

    getTasks = async () => {
        this.response = await fetch('http://localhost:5276/UserPage/GetTasks')

        if (this.response.status === 200) {
            return await this.response.json()
        }

        console.log('Ошибка запроса tasks')
    }

    logOut = () => {
        localStorage.clear()
        return document.location = '/'
    }

    getUserProp = async () => {
        this.response = await fetch('http://localhost:5276/UserPage/GetUserProps')

        if (this.response.status === 200) {
            return await this.response.json()
        }

        console.log('Ошибка запроса')
    }

    async componentDidMount() {
        await getPage("http://localhost:5276/UserPage/GetSubjects", 'accessToken')
            .then(data => this.setState({subjects: data}))

        await this.getUserProp()
            .then(data => {
                this.setState({userProps: data})
            })

        await this.getTasks()
            .then(data => {
                console.log(data)
            })
    }

    render() {
        return (
            <>
                {
                    detectLocalStorage('accessToken') ?
                        <div className="user">
                            <div className="user__info">
                                <p>Пользователь: <span>{this.state.userProps['firstname']} {this.state.userProps['lastname']}</span></p>
                                <p>Группа: <span>{this.state.userProps['group'] ? this.state.userProps['group'].toUpperCase() : ''}</span></p>
                                <Button variant="primary" onClick={this.logOut}>Выйти</Button>
                            </div>

                            <div className="user__toolBar">
                                <nav className="user__nav">
                                    <ul className="user__list">
                                        {this.state.subjects.length !== 0 ? this.state.subjects.map((item, i) =>
                                                <li className="user__item" key={i}>
                                                    {item.name}
                                                </li>
                                            )
                                         : <div className='img'>
                                                <img src="img/spinner.gif" alt="спиннер"/>
                                            </div>}
                                    </ul>
                                </nav>
                                <div className="user__material">
                                    <div className="user__files">
                                        <div className="date">
                                            <p>01.01.2022</p>
                                        </div>
                                        <div className="file">
                                            <ul>
                                                <li>
                                                    <a href="/" download className="loadLink">
                                                        <span className="img">
                                                            <img src="img/doc.png" alt="Задание"/>
                                                        </span>
                                                        <span>Название файла</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    : <Navigate to={"/"}/>
                }
            </>
        )
    }
}

export default UserPage;