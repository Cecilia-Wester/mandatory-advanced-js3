import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom';


export default class Register extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            redirect: false,
        }
    }
        
    onChangeEmail=(e)=>{
        this.setState({email: e.target.value})
    }

    onChangePassword=(e)=>{
        this.setState({password: e.target.value})
    }

    
    onSubmit=(e)=>{
        e.preventDefault();
        let authData = {
            email: this.state.email,
            password: this.state.password,
        };
        axios.post('http://3.120.96.16:3002/register', authData)
        .then((response)=>{
            this.setState({redirect: true})
        })
        .catch((error)=>{
            console.log(error)
        })
    }


    render(){
        if(this.state.redirect){
            return(<Redirect to='/' />)
        }
        return(
            <div>
                <Helmet>
                    <title>Registration</title>
                </Helmet>
                <form onSubmit={ this.onSubmit }>
                    <div>
                        <p>Enter your email:</p>
                        <input 
                            type='email' 
                            placeholder='Email  '
                            value={this.state.email}
                            onChange={this.onChangeEmail} 
                            required
                        />
                    </div>
                    <div>
                        <p>Enter a password:</p>
                        <input 
                            type='password'
                            placeholder='Password'
                            value={this.state.password}
                            onChange={this.onChangePassword}
                            required
                        />
                    </div>
                    <button type='submit'>Submit</button>
                </form>
            </div>
        )
    }
}