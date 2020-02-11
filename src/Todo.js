import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import axios from 'axios';
import {updateToken, token$} from './store';
import { Redirect, Link } from 'react-router-dom';
import MaterialIcon, {colorPalette} from 'material-icons-react';

export default class Todo extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            todos: [],
            todo: '',
            token: token$.value,
            internalId: 0,
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
        this.setState({error: true})
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
            let data = response.data;
            console.log(data.id)
            this.fetch()
        })
        .catch(error => {
            this.setState({error: true})
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
            console.error(error);
            updateToken(null);
            this.setState({error:true})
        });
    }

    onSubmitTask=(e)=>{
        e.preventDefault();
        let todoId = {id: "internal-" + this.state.internalId, todo: e.target.value};
        axios.post('http://3.120.96.16:3002/todos', {content: this.state.todo}, {
            headers: {
                Authorization: `Bearer ${this.state.token}`
            }
        })
        .then(()=>{
            this.setState({todos: [...this.state.todos, todoId], internalId: this.state.internalId + 1, todo: ''})
            this.fetch()
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
                                {data.content}
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