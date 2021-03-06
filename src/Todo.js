import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import axios from 'axios';
import {updateToken, token$} from './store';
import { Redirect, Link } from 'react-router-dom';
import MaterialIcon, {colorPalette} from 'material-icons-react';
import Linkify from 'react-linkify';

export default class Todo extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            todos: [],
            todo: '',
            token: token$.value,
            error: false,
            errorTooLong: false,
        }
    }

    componentDidMount=()=> {
        this.subscription = token$.subscribe(token => {
            this.setState({token});
        });
        this.fetch()
    }

    componentWillUnmount=()=> {
        this.subscription.unsubscribe();
        updateToken(null);
    }

    deleteOnClick=(id)=>{
        axios.delete('http://3.120.96.16:3002/todos/' + id, {
            headers: {
                Authorization: `Bearer ${this.state.token}`
            }
        })
        .then(response => {
            this.setState({
                todos: this.state.todos.filter(x => x.id !== id)
            })
        })
        .catch(error => {
            if (error.response && error.response.status === 401) {
                this.setState({error: true});
            }
        })
    }

    fetch=()=>{
        axios.get('http://3.120.96.16:3002/todos', {
            headers: {
                Authorization: `Bearer ${this.state.token}`  
            }
        })
        .then(response => {
            this.setState({todos: response.data.todos});
        })
        .catch(error => {
            this.setState({error:true})
            updateToken(null);
        });
    }

    onSubmitTask=(e)=>{
        e.preventDefault();
        if (this.state.todo.trim().length === 0) {
            this.setState({errorTooLong: true})
            return;
        }
        axios.post('http://3.120.96.16:3002/todos', {content: this.state.todo}, {
            headers: {
                Authorization: `Bearer ${this.state.token}`
            }
        })
        .then((resp)=>{ 
            this.setState({
                todos: [...this.state.todos, resp.data.todo], 
                todo: ''
            })
        })
        .catch(error => {
            console.log(error)
            this.setState({errorTooLong: true})
        })
    }

    onChange=(e)=>{
        this.setState({todo: e.target.value})
    }

    render(){
        if(this.state.errorTooLong){
            return (
                <>
                <p>Oops...something went wrong, please try again</p>
                <Link to='/todo' onClick = { () => (this.setState({errorTooLong: false, todo:''}))}>Return to todo page</Link>
                </>
            )
        }
        if(this.state.error){
            return (
                <>
                <p>Oops...something went wrong, please login again</p>
                <Link to='/' onClick = { () => (this.setState({error: false}))}>Return to login page</Link>
                </>
            )
        }
        if(!this.state.token){
            return <Redirect to = '/' />
        }
        return(
            <div className='todoPage'>
                <Helmet>
                    <title>Todo</title>
                </Helmet>
                <div className = 'todoContainer'>
                    <div className='newTask'>
                        <p>New task:</p>
                        <form onSubmit={this.onSubmitTask}>
                        <input 
                            onChange={this.onChange} 
                            value={this.state.todo} 
                            type='text'
                            className='todoInput' 
                            placeholder='New task...' 
                        />
                        <button type='submit'>Submit</button></form>
                    </div>
                    <div className='todoTasks'>
                        <ul>
                            {this.state.todos.map(data => (
                                <li key={data.id}>
                                <Linkify>{data.content}</Linkify>
                                <button className='todoDeleteButton' onClick = { () => this.deleteOnClick(data.id) }><MaterialIcon icon="delete" /></button>
                            </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}