import React from 'react';
import "./UserPage.scss";
import {Navigate} from "react-router-dom";
import {getPage, detectLocalStorage} from "../../Services/services";
import {Button} from "react-bootstrap";

class UserPage extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        subjects: [],
        userProps: {},
        tasks: [],
        fileDates: [],
    }

    getTasks = async () => {
        this.response = await fetch('http://localhost:5276/UserPage/GetTasks')

        if (this.response.status === 200) return await this.response.json()

        console.log('Ошибка запроса tasks')
    }

    logOut = () => {
        localStorage.clear()
        return document.location = '/'
    }

    getUserProp = async () => {
        this.response = await fetch('http://localhost:5276/UserPage/GetUserProps', {
            method: 'POST',
            body: JSON.stringify({'userId': localStorage.getItem('userId')}),
            headers: {
                'Content-type': 'application/json',
            }
        })

        if (this.response.status === 200) {
            return await this.response.json()
        }

        console.log(this.response.statusText)
    }

    async componentDidMount() {
        await getPage("http://localhost:5276/UserPage/GetSubjects", 'accessToken')
            .then(data => this.setState({subjects: data}))

        await this.getUserProp()
            .then(data => {
                console.log(data)
                this.setState({userProps: data})
            })

        await this.getTasks()
            .then(data => {
                this.setState({tasks: data})
                let uniqueMassDates = new Set()
                let resultMass = []
                data.forEach(item => {
                    uniqueMassDates.add(item.putdate)
                })
                uniqueMassDates.forEach(item => {
                    let mass = data.filter(elem => elem.putdate === item)
                    resultMass.push(mass)
                })
                this.setState({fileDates: uniqueMassDates})
                this.setState({tasks: resultMass})
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
                                    {
                                        this.state.tasks.length !== 0 ?
                                            this.state.tasks.map((item, index) => {
                                                return (
                                                    <div className="user__files" key={index}>
                                                        <div className="date">
                                                            <p>{this.state.fileDates ? new Date(Array(...this.state.fileDates)[index]).toLocaleDateString() : ''}</p>
                                                        </div>
                                                        <div className="file">
                                                            <ul className="user__fileList">
                                                                {
                                                                    item.map((elem, key) =>
                                                                        <li key={key} className="user__fileItem">
                                                                            <a href={elem.filepath.trim()} download className="loadLink">
                                                                                <span className="img">
                                                                                    <img src="img/doc.png" alt="Задание"/>
                                                                                </span>
                                                                                <span className="fileTitle">{elem.filename}</span>
                                                                            </a>
                                                                        </li>
                                                                    )
                                                                }
                                                                {/*<li>*/}
                                                                {/*    <a href="/" download className="loadLink">*/}
                                                                {/*        <span className="img">*/}
                                                                {/*            <img src="img/doc.png" alt="Задание"/>*/}
                                                                {/*        </span>*/}
                                                                {/*        <span>Название файла</span>*/}
                                                                {/*    </a>*/}
                                                                {/*</li>*/}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                )
                                            }) :
                                                    <div className='img'>
                                                        <img src="img/spinner.gif" alt="спиннер"/>
                                                    </div>
                                    }
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