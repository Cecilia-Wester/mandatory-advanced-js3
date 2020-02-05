import React from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { updateToken, token$ } from './store'

export default class Login extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            token: token$.value,
            error: false,
            
        }
    }

    componentDidMount=()=> {
        this.subscription = token$.subscribe(token => {
            this.setState({token});
        }); 
    }
    
    componentWillUnmount=()=> {
        this.subscription.unsubscribe();
    }
    
    onChangeEmail=(e)=> {
        this.setState({email: e.target.value});
    }
    
    onChangePassword=(e)=> {
        this.setState({password: e.target.value});
    }
    

    onSubmit=(e)=> {
        e.preventDefault();
        let authData = {
            email: this.state.email,
            password: this.state.password,
        };

        axios.post('http://3.120.96.16:3002/auth', authData)
        .then(response => {
            this.setState({error: false});
            updateToken(response.data.token);
        })
        .catch(err => {
            this.setState({error: true});
            console.error(err);
        });
    }

    render (){
        if(this.state.token){
            return <Redirect to = '/todo' />
        }
        return(
            <div>
                <Helmet>
                    <title>Login</title>
                </Helmet>
                <form onSubmit={ this.onSubmit }>
                    <div>
                        <p>Enter your email:</p>
                        <input 
                            type='email' 
                            placeholder='Email'
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
                            value={this.state.value}
                            onChange={this.onChangePassword}
                            required
                        />
                    </div>
                    <button type='submit'>Login</button>
                </form>
                <button><Link to='/register'>Register</Link></button>
            </div>
        )
    }
}