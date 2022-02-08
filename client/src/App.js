import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom'
import Home from "./pages/Home"
import Createpost from "./pages/Createpost"
import Post from "./pages/Post"
import Registration from "./pages/Registration"
import Login from "./pages/Login"
import PageNotFound from "./pages/PageNotFound"
import Profile from "./pages/Profile"
import ChangePassword from "./pages/ChangePassword"
import { AuthContext } from './helpers/AuthContext'
import { useState, useEffect } from 'react'
import axios from 'axios'

function App(){
    const [authState, setAuthState] = useState({
    userName: "", 
    id: 0, 
    status: false,})


    useEffect(() => {
      axios.get("http://localhost:3001/auth/auth", { headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    }).then((response) =>{
        if (response.data.error) {
          setAuthState({...authState, status: false})
        }else{
          setAuthState({
            userName: response.data.userName, 
            id: response.data.id, 
            status: true,})
        }
      })
    }, [])

    const logout = () => {
      localStorage.removeItem("accessToken")
      setAuthState({
        userName: "", 
        id: 0, 
        status: false,})
    }

    return (
      <div className="App">
        <AuthContext.Provider  value={{ authState, setAuthState }}>
          <Router>
            <div className='navbar'>
            <div className='links'>
            {!authState.status ? (
              <div> 
                <Link to="/login">Login</Link>
                <Link to="/registration">Resgistration</Link>
              </div>
            ): (
              <div>
              <Link to="/createpost">Create a Post</Link>
              <Link to="/">Home Page</Link>
              </div>
            )}
            </div>
             <div className='loggedInContainer'>
             {authState.status && <button onClick={logout}> Logout</button>}
              <h1>{authState.userName}</h1>
              
              </div>
            </div>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/createpost" exact component={Createpost}/>
              <Route path="/post/:id" exact component={Post}/>
              <Route path="/registration" exact component={Registration}/>
              <Route path="/login" exact component={Login}/>
              <Route path="/profile/:id" exact component={Profile}/>
              <Route path="/changePassword" exact component={ChangePassword}/>
              <Route path="*" exact component={PageNotFound}/>
            </Switch>
          </Router>
        </AuthContext.Provider>
      </div>
    );
}

export default App;
