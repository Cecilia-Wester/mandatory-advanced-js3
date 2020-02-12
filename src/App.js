import React from 'react';
import './App.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Login from './Login';
import Register from './Register';
import Header from './Header';
import Todo from './Todo'
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Footer from './Footer'

export default class App extends React.Component {
  render(){
    return (
      <div className="App">
        <HelmetProvider>
          
          <Router>
            <Header />
            <Route exact path='/' component={ Login } />
            <Route path = '/register' component= { Register } />
            <Route path = '/todo' component={ Todo } />
            <Footer />
          </Router>
        </HelmetProvider>
      </div>
    );
  }
}
