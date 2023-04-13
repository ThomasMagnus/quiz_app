import React from 'react'
import {Button, Form} from "react-bootstrap";
import './addTask.scss'
import {Link} from "react-router-dom";
import './addTask.scss'

class AddTask extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        teacherData: JSON.parse(localStorage.getItem("data")) || null,
        group: null,
        subject: null,
        file: null
    }

    getGroup = (e) => {
        const target = e.target
        if (Object.keys(this.state.teacherData['props']).includes(target.value)) this.setState({group: target.value})
        else this.setState({group: null})
    }

    getSubjects = (e) => {
        const target = e.target
        this.setState({subject: target.value})
    }

    getFile = (e) => {
        const target = e.target
        this.setState({file: target.value})
    }

    getValidate = () => !!(this.state.group && this.state.subject && this.state.file);

    render() {
        return (
            <>
                <h1>Выложить задание</h1>
                <Form className='form'>
                    <Form.Select aria-label="Default select example" onChange={(e) => this.getGroup(e)}>
                        <option>Выберете предмет:</option>
                        {this.state.teacherData ? 
                            Object.keys(this.state.teacherData["props"]).map((item, i) => (
                                <option value={item} key={i} >{item}</option>
                            ))
                            :
                            ""
                        }
                    </Form.Select>
                    <Form.Select aria-label="Default select example" onChange={(e) => this.getSubjects(e)}>
                        <option>Выберете группу:</option>
                        {
                            this.state.group !== null && Object.keys(this.state.teacherData['props']).includes(this.state.group) ?
                                this.state.teacherData["props"][this.state.group].map((item, i) => (
                                    <option value={item} key={i}>{item}</option>
                                )) : ''
                        }
                    </Form.Select>
                    <Form.Group controlId="formFile" className="mb-3" onChange={(e) => this.getFile(e)}>
                        <Form.Control type="file"/>
                    </Form.Group>
                    <div className="btnGroup">
                        <Button disabled={!this.getValidate()}>Выложить</Button>
                        <Link className='canselBtn' to={'/Teacher/TeacherPage/' + this.props.login}>
                            <Button>Отмена</Button>
                        </Link>
                    </div>
                </Form>
            </>
        )
    }
}

export default AddTask
