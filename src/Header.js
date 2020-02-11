import React from 'react';
import { token$, updateToken } from './store';
import jwt from 'jsonwebtoken';
import { Link, Redirect } from 'react-router-dom';


export default class Header extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            token: token$.value,
        }
    }

    componentDidMount=()=> {
        token$.subscribe(token => {
            this.setState({token});
        });
    }

    logout=()=>{
        updateToken(null)
    }

    render(){
        const decoded = jwt.decode(this.state.token);
        return(
            <div className='wholeHeader'>
                <div className='headerText'>
                    <p>{this.state.token? `You are logged in as ${decoded.email}`:'You are not logged in yet'}</p>
                    <div className='headerBtn'>
                        {!this.state.token?<button><Link to='/'>Login</Link></button>  : <button onClick={this.logout}>Logout</button>}
                        {!this.state.token?<button><Link to='/register'>Register</Link></button> : null }
                    </div>
                </div>
                <h1>Make your own todo list</h1>
            </div>
        )
    }
}