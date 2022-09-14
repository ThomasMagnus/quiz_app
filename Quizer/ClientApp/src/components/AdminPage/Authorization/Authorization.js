import React from 'react'
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom"

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
        }
    }
    
    onChangeProperties = (e) => {
        const target = e.target
        this.setState( {
            form: {
                ...this.state.form,
                firstname: target.name === 'firstname' ? target.value.toLowerCase() : this.state.form.firstname,
                lastname: target.name === 'lastname' ? target.value.toLowerCase() : this.state.form.lastname,
                group: target.name === 'group' ? target.value.toLowerCase() : this.state.form.group,
                password: target.name === 'password' ? target.value : this.state.form.password,
            }
        })
        console.log(this.state)
    }
    
    postData = (e) => {
        e.preventDefault()
        const data = JSON.stringify(this.state.form)
        console.log(data)
        fetch('https://localhost:7276/Authorization/Auth', {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => console.log(response))
    }

    getGroups = async () => {
        await fetch('https://localhost:7276/Authorization/GetGroups')
            .then(response => {
                console.log(response)
                return response.json()
            })
            .then(data => {
                this.setState({ groups: data })
            })
    }

    componentDidMount() {
        this.getGroups()
    }
    
    render() {

        return (
            <section className="authorization">
                <h1>Авторизация</h1>
                <Form className="row-cols-1">
                    <Form.Group className="mb-2" controlId="formBasicEmail">
                        <Form.Control type="text" name="firstname" placeholder="Введите имя" onChange={this.onChangeProperties}/>
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="formBasicEmail">
                        <Form.Control type="text" name="lastname" placeholder="Введите фамилию" onChange={this.onChangeProperties}/>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Select id="disabledSelect" name="group" onChange={this.onChangeProperties}>
                            <option>Выберете номер группы</option>
                            {this.state.groups.map((item, i) => 
                                 <option value={item} key={i}>{item.toUpperCase()}</option>
                            )}
                            
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="formBasicPassword">
                        <Form.Control type="password" name="password" placeholder="Пароль" onChange={this.onChangeProperties}s/>
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={e => this.postData(e)}>Войти</Button>
                    <Link to='/UserPage/Index' >Открыть</Link>
                </Form>
            </section>
        );
    }
}

export default Authorization;