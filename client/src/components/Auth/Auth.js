import React, { useState } from 'react';
import axios from 'axios';
import Home from '../Home/Home';
import classes from './Auth.module.css';

import {
  Switch,
  Route,
  Link,
  useHistory,
} from 'react-router-dom';

// Send json instead of form-data
const Auth = (props) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const tryLogin = async (e) => {
    e.preventDefault();

    await axios.post('http://localhost:4000/login', {
      email, password
    }).then((res) => {
      history.push({
        pathname: '/home',
        state: { id: res.data}
      });
    }).catch((err) => {
      console.log(err);
    });

    setEmail("");
    setPassword("");
  }

  const trySignup = async () => {

    await axios.post('http://localhost:4000/signup', {
      email, username, password
    }).then((res) => {
      history.push('/login');
    }).catch((err) => {
      console.log(err);
    })

    setEmail("");
    setPassword("");
    setUsername("");
  };


  return (
    <div>
      <Switch>
        <Route path="/login">
          <form onSubmit={tryLogin} className={classes.authForms}>
            <input
              value={email}
              type="text"
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Username"
            />
            <input
              value={password}
              type="password"
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Password" />
            <button className={classes.submitButtons}>LOGIN</button>
          </form>
          <nav className="nav-links">
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </nav>
        </Route>
        <Route path="/signup">
          <form onSubmit={trySignup} className={classes.authForms}>
            <input
              value={email}
              type="text"
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Email ID"
            />
            <input
              value={username}
              type="text"
              onChange={e => setUsername(e.target.value)}
              required
              placeholder="username"
            />
            <input
              value={password}
              type="password"
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
            <button className={classes.submitButtons}>SIGN UP</button>
          </form>
          <nav className="nav-links">
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </nav>
        </Route>
        <Route path='/home'>
          <Home />
        </Route>
      </Switch>

    </div>
  );
}

export default Auth;