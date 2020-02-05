import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import axios from 'axios';
import {updateToken, token$} from './store';
import jwt from 'jsonwebtoken';
import { Redirect } from 'react-router-dom';

export default class Todo extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            todos: [],
            content: {},
            token: token$.value,
        }
    }

    componentDidMount=()=> {
        token$.subscribe(token => {
            console.log(token)
            this.setState({token});
            const decoded = jwt.decode(token);
            console.log(decoded.email);
        });
    
        axios.get('http://3.120.96.16:3002/todos', {
            
            headers: {
                Authorization: `Bearer ${this.state.token}`
                
            }
        })
        .then(response => {
            this.setState({todos: response.data.todos});
        })
        .catch(error => {
            console.error(error);
            updateToken(null);
        });
    }


    onSubmitTask=(e)=>{
        e.preventDefault();
        axios.post('http://3.120.96.16:3002/todos', {content: e.target.value})
        this.setState({content: e.target.value})
    }


    logout=(e)=>{
        updateToken(null)
    }


    render(){
        if(!this.state.token){
            return <Redirect to = '/' />
        }
        
        return(
            <div>
                <Helmet>
                    <title>Todo</title>
                </Helmet>
                <div className = 'todoContainer'>
                    <p>My todo-list</p>
                    <p>{this.state.decoded}</p>
                    
                    <div>
                        <p>New task:</p>
                        <input type='text' onSubmit={this.onSubmitTask}/>
                        <ul>

                        </ul>
                    </div>
                </div>
                <button onClick={this.logout}>Logout</button>
            </div>
            


        )
    }
}