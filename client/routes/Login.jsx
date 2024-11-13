import React, { useState } from 'react';
import { Link, Navigate } from "react-router-dom";

const Login = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = (e) => {
    e.preventDefault();
    fetch('/api/users/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    }).then(response => response.json())
        .then(data => {
          console.log('user from server: ', data);
          return props.changeState(data);
        }).catch(err => console.log('client error' + err));
  };

  const { loggedIn, error } = props;

  return (
    <div style={{height: '100%'}}>
      <div style={{height: '100%'}}>
        <main style={{height: '100%', marginTop: '5%'}}>
          <center>
            <div className="section"></div>
            <div className="container">
              <div className="z-depth-1 grey lighten-4 row" style={{display: 'inline-block', padding: '32px 48px 0px 48px', border: '1px solid #EEE', borderRadius: '10px', paddingBottom: '30px'}}>
              {loggedIn && <Navigate to="/" replace={true} />}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <h4 className="indigo-text" style={{marginBottom: '40px'}}>BookEx Login</h4>
                <form className="col s12" method="post" onSubmit={login}>
                  <div className='row'>
                    <div className='input-field col s12'>
                      <input
                          type="text"
                          className='validate'
                          name="username"
                          id="username"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                      />
                      <label for='username'>Enter your username</label>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='input-field col s12'>
                      <input
                          type="password"
                          name="password"
                          id="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                      <label for='password'>Enter your password</label>
                    </div>
                    <label style={{float: 'right'}}>
                      <Link to="/forgotpassword" className='pink-text'>Forgot Password?</Link>
                    </label>
                  </div>

                  <br />
                  <center>
                    <div className='row'>
                      <button type='submit' name='btn_login' className='col s12 btn btn-large waves-effect indigo'>Login</button>
                    </div>
                  </center>
                </form>
                <div style={{display: 'inline-flex', justifyContent: 'center'}}>
                    {/* <a href="/register"></a> */}
                    <label style={{float: 'right', fontSize: 'large'}}>
                      <Link to="/register">Create Account</Link>
                    </label>
                </div>
              </div>
            </div>
          </center>
        </main>
      </div>
    </div>
  );
};

export default Login;
