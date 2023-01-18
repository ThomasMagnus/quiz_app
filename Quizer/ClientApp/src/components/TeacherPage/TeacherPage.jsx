import React, {Component} from 'react'
import {Navigate} from "react-router-dom";
import {Form, Row, Col, Button, Container, ListGroup, Placeholder, Stack} from "react-bootstrap";
// import {getPage, detectLocalStorage} from "../../../Services/services";
import {detectLocalStorage, getPage} from "../../Services/services";

class TeacherPage extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props)
    }

    state = {
        data: {},
        auth: !!localStorage.getItem('data')
    }

    componentDidMount() {
        // this.detectAuth()
        console.log(this.state)
        getPage("http://localhost:5276/Teacher/TeacherPage/" + this.props.appState.teacherData['login'], 'accessTokenTeacher')
            .then(data => {
                this.setState({data: data})
                console.log(data)
            })


        if (sessionStorage.getItem('data')) {
            const data = JSON.parse(sessionStorage.getItem('data'))
            this.setState({'data': data})
        }
        fetch(this.props.url + 'Teacher/DetectAuth', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessTokenTeacher')}`
            }
        })
            .then(response => {
                console.log(response)
            })
    }

    // detectAuth = async () => {
    //     await fetch(this.props.url + '/Teacher/DetectAuth')
    //         .then(data => console.log(data))
    // }

    render() {
        return (
            <>
                {this.state.auth ?
                    <>
                        <Container>
                            <Row>
                                <Col>
                                    <h1>Личный кабинет</h1>
                                    <p className="admin__name">Преподаватель: <span>{this.props.appState.teacherData['username']}</span></p>
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
                                            <ListGroup.Item action variant="light">
                                                <Placeholder animation="glow">
                                                    <Placeholder xs={6}/>
                                                </Placeholder>
                                            </ListGroup.Item>
                                            <ListGroup.Item action variant="light">Dapibus ac facilisis
                                                in</ListGroup.Item>
                                            <ListGroup.Item action variant="light">Morbi leo risus</ListGroup.Item>
                                            <ListGroup.Item action variant="light">Porta ac consectetur
                                                ac</ListGroup.Item>
                                            <ListGroup.Item action variant="light">Vestibulum at eros</ListGroup.Item>
                                            <ListGroup.Item action variant="light">Dapibus ac facilisis
                                                in</ListGroup.Item>
                                            <ListGroup.Item action variant="light">Morbi leo risus</ListGroup.Item>
                                            <ListGroup.Item action variant="light">Porta ac consectetur
                                                ac</ListGroup.Item>
                                            <ListGroup.Item action variant="light">Vestibulum at eros</ListGroup.Item>
                                        </ListGroup>
                                    </div>
                                    <Button variant="primary" className='mt-3'>Добавить</Button>
                                </Col>
                                <Col>
                                    <h3>Ваши группы:</h3>
                                    <div className="admin__overview overflow-auto">
                                        <ListGroup className='mb-3'>
                                            <ListGroup.Item action variant="light">
                                                <Placeholder animation="glow">
                                                    <Placeholder xs={6}/>
                                                </Placeholder>
                                            </ListGroup.Item>
                                            <ListGroup.Item action variant="light">Dapibus ac facilisis
                                                in</ListGroup.Item>
                                            <ListGroup.Item action variant="light">Morbi leo risus</ListGroup.Item>
                                            <ListGroup.Item action variant="light">Porta ac consectetur
                                                ac</ListGroup.Item>
                                            <ListGroup.Item action variant="light">Vestibulum at eros</ListGroup.Item>
                                            <ListGroup.Item action variant="light">Dapibus ac facilisis
                                                in</ListGroup.Item>
                                            <ListGroup.Item action variant="light">Morbi leo risus</ListGroup.Item>
                                            <ListGroup.Item action variant="light">Porta ac consectetur
                                                ac</ListGroup.Item>
                                            <ListGroup.Item action variant="light">Vestibulum at eros</ListGroup.Item>
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