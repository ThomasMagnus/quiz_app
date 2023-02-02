import React from 'react'
import {Button, Form} from "react-bootstrap";
import './addTask.scss'
import {Link} from "react-router-dom";
import './addTask.scss'

class AddTask extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <h1>Выложить задание</h1>
                <Form className='form'>
                    <Form.Select aria-label="Default select example">
                        <option>Выберете предмет:</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </Form.Select>
                    <Form.Select aria-label="Default select example">
                        <option>Выберете группу:</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </Form.Select>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Control type="file"/>
                    </Form.Group>
                    <div className="btnGroup">
                        <Button>Выложить</Button>
                        <Link className='canselBtn' to={'/Teacher/TeacherPage/anton'}>
                            <Button>Отмена</Button>
                        </Link>
                    </div>
                </Form>
            </>
        )
    }
}

export default AddTask
