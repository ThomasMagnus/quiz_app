import React, {Component} from 'react'
import {Navigate} from "react-router-dom";
import {Row, Col, Button, Container, ListGroup, Placeholder, Stack, CloseButton, Modal} from "react-bootstrap";
import {getPage} from "../../Services/services";
import './TeacherPage.scss'
import MyVerticallyCenteredModal from "../Modal/Modal";


class TeacherPage extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props)
    }

    state = {
        data: JSON.parse(localStorage.getItem('data')),
        auth: !!localStorage.getItem('data'),
        tokenWork: false,
        modal: false,
        modalData: {
            subject: '',
            group: ''
        }
    }

    componentDidMount() {
        this.detectAuth()
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    this.setState({tokenWork: true})
                } else {
                    localStorage.clear()
                    document.location = '/'
                }
            })
        // getPage("http://localhost:5276/Teacher/TeacherPage/" + this.props.appState.teacherData['login'], 'accessTokenTeacher')
        //     .then(data => {
        //         this.setState({data: data})
        //     })
        
    }

    detectAuth = async () => {
        return await fetch(this.props.url + 'Authorization/DetectToken', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessTokenTeacher')}`,
                'Content-type': 'application/json'
            },
        })
    }

    logOut(e) {
        e.preventDefault()
        localStorage.clear()
        document.location = '/teach'
    }

    showHideModal = (e) => {
        const target = e.target
        if (!target.classList.contains('.admin__close')) {
            if (this.state.modal) {
                this.setState({modal: false})
            } else {
                this.setState({
                    modalData: {
                        ...this.state.modalData,
                        subject: target.textContent
                    }
                })
                this.setState({modal: true})
            }
        }
    }


    render() {
        return (
            <>
                {this.state.auth ?
                    <>
                        <MyVerticallyCenteredModal
                            show={this.state.modal}
                            onHide={this.showHideModal}
                            subject={this.state.modalData.subject}/>
                        <Container>
                            <Row>
                                <Col>
                                    <h1>Личный кабинет</h1>
                                    <p className="admin__name">Преподаватель: <span>{this.props.appState.teacherData['username']}</span>
                                    </p>
                                </Col>
                                <Col>
                                    <div className="admin__info">
                                        <p><Button variant="primary">Опубликовать задание</Button></p>
                                        <Button variant="primary" onClick={this.logOut}>Выйти</Button>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                        <Container>
                            <Row>
                                <Col>
                                    <h3>Ваши предметы:</h3>
                                    <div className="admin__overview overflow-auto">
                                        <ListGroup className='mb-3'>
                                            {/* {
                                                this.state.data['props'] ? 
                                                this.state.data['props'].map((item, i) => (
                                                    <ListGroup.Item className="admin__item" variant="light" key={i}>
                                                        Группа: {item[1]}
                                                        <br />
                                                        Предметы:
                                                        <br />
                                                        {item[0]}
                                                        <CloseButton className="admin__close" />
                                                    </ListGroup.Item>
                                                )) : ''
                                            } */}
                                            {
                                                this.state.data['props'] ?
                                                this.state.data['props']['subjects'].map((item, i) => (
                                                    <ListGroup.Item className="admin__item" action variant="light" key={i} onClick={this.showHideModal}>
                                                        {item}
                                                        <CloseButton className="admin__close" />
                                                    </ListGroup.Item>
                                                )) :
                                                  <ListGroup.Item action variant="light">
                                                    <Placeholder animation="glow">
                                                        <Placeholder xs={6}/>
                                                    </Placeholder>
                                                </ListGroup.Item>
                                            }
                                        </ListGroup>
                                    </div>
                                    <Button variant="primary" className='mt-3'>Добавить</Button>
                                </Col>
                                <Col>
                                    <h3>Ваши группы:</h3>
                                    <div className="admin__overview overflow-auto">
                                        <ListGroup className='mb-3'>
                                            {
                                                this.state.data['props'] ?
                                                this.state.data['props']['groups'].map((item, i) => (
                                                    <ListGroup.Item action variant="light" key={i}>
                                                        {item}
                                                        <CloseButton className="admin__close" />
                                                    </ListGroup.Item>
                                                )) :
                                                  <ListGroup.Item action variant="light">
                                                    <Placeholder animation="glow">
                                                        <Placeholder xs={6}/>
                                                    </Placeholder>
                                                </ListGroup.Item>
                                            }
                                        </ListGroup>
                                    </div>
                                    <Stack direction='horizontal' className='mt-3'>
                                        <Button className="ms-auto" variant="primary">Добавить</Button>
                                    </Stack>
                                </Col>
                            </Row>
                        </Container>
                    </>
                    : <Navigate to={'/teach'}/>}
            </>
        )
    }
}

export default TeacherPage