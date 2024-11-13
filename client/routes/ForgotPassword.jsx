import React, { useState } from 'react';
import { Link ,Navigate } from "react-router-dom";
import sendEmail from './utility/EmailService'

const ForgotPassword = (props) => {
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });

  const [message, setMessage] = useState('');
  async function resetPasswordWithHash() {
    try {
        const {username, email} = formData
        const result = await sendEmail(email, username);
        if (result) {
          setMessage('Email sent successfully! Please check.');
        } else {
          setMessage('Failed to send email. Try again later or contact support.');
        }
    }
    catch (error) {
      console.error('Error resetting password:', error);
    }
  }

  const resetPassword = async (e) => {
    e.preventDefault();
    if (validate()) {
      await resetPasswordWithHash();
    }
  }

  const { loggedIn, error } = props;

  const validate = () => {
    let tempErrors = {};
    if (!formData.username) tempErrors.username = "Username is required";
    if (!formData.email) tempErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Email is invalid";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{height: '100%'}}>
      <div style={{height: '100%'}}>
        <main style={{height: '100%', marginTop: '5%'}}>
          <center>
            <div className="section"></div>

            <div className="container">
              <div className="z-depth-1 grey lighten-4 row" style={{display: 'inline-block', padding: '32px 48px 0px 48px', border: '1px solid #EEE', borderRadius: '10px', paddingBottom: '30px', width: '450px'}}>
              {loggedIn && <Navigate to="/" replace={true} />}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <h5 className="indigo-text">Forgot Password</h5>
                <form className="col s12" method="post" onSubmit={resetPassword}>
                  <div className='row'>
                    <div className='input-field col s12'>
                      <input
                          type="text"
                          className='validate'
                          name="username"
                          id="username"
                          required
                          value={formData.username}
                          onChange={handleChange}
                      />
                      <label for='email'>Enter your username</label>
                    </div>
                  </div>
                  <div>
                    {errors.username && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.username}</p>}
                  </div>

                  <div className='row'>
                    <div className='input-field col s12'>
                      <input
                          type="email"
                          className='validate'
                          name="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                      />
                      <label for='email'>Enter your registered email</label>
                    </div>
                  </div>
                  <div>   
                    {errors.email && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.email}</p>}
                  </div>
                  <br />
                  <center>
                    <div className='row'>
                      <button type='submit' name='btn_login' className='col s12 btn btn-large waves-effect indigo'>Reset password</button>
                    </div>
                  </center>
                </form>
                <div style={{display: 'inline-flex', justifyContent: 'center'}}>
                    <label style={{float: 'right', fontSize: 'large'}}>
                      <Link to="/login">Login</Link>
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

export default ForgotPassword;
