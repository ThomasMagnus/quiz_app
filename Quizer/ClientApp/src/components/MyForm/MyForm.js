import React, {Component} from "react";
import { Button, Form } from "react-bootstrap";

class MyForm extends Component{
    constructor(props) {
        super(props)
        this.admin = props.admin
    }
    
    render() {
        return (
            <Form className="row-cols-1">
                <Form.Group className="mb-2" controlId="formBasicEmail">
                    <Form.Control type="text" name="firstname" placeholder="Введите имя" onChange={this.props.onChangeProperties}/>
                </Form.Group>
                <Form.Group className="mb-2" controlId="formBasicEmail">
                    <Form.Control type="text" name="lastname" placeholder="Введите фамилию" onChange={this.props.onChangeProperties}/>
                </Form.Group>
                {!this.admin ?
                    <Form.Group className="mb-2">
                        <Form.Select id="disabledSelect" name="group" onChange={this.props.onChangeProperties}>
                            <option>Выберете номер группы</option>
                            {this.props.groups.map((item, i) =>
                                <option value={item[0]} key={i} data-id={item[1]} name="option">{item[0].toUpperCase()}</option>
                            )}
                        </Form.Select>
                    </Form.Group>
                : ""}
                <Form.Group className="mb-2" controlId="formBasicPassword">
                    <Form.Control type="password" name="password" placeholder="Пароль" onChange={this.props.onChangeProperties}/>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={e => this.props.postData(e)}>Войти</Button>
            </Form>
        );
    }
}

export default MyForm