import React, { useState } from 'react';
import { Navigate } from "react-router-dom";
import {showNotification} from './utility/helper.js'

const Register = (props) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    passwordconfirm: '',
    email: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    validate();
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Name is required field.";
    if (!formData.username) tempErrors.username = "Username is required field.";
    if (!formData.password) tempErrors.password = "Password is required field.";

    let error;
    if (!/(?=.*[a-z])/.test(formData.password)) {
      error = 'Password must have at least one lowercase letter.';
      tempErrors.password = tempErrors.password && tempErrors.password.length > 0 ? `\n ${error}` : error;
    }
    if (!/(?=.*[A-Z])/.test(formData.password)) {
      error = "Password must have at least one uppercase letter";
      tempErrors.password = tempErrors.password && tempErrors.password.length > 0 ? `\n ${error}` : error;
    }
    if (!/(?=.*\d)/.test(formData.password)) {
      error = "Password must have at least one digit";
      tempErrors.password = tempErrors.password && tempErrors.password.length > 0 ? `\n ${error}` : error;
    }
    if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
      error = "Password must have at least one special character (e.g., @$!%*?&).";
      tempErrors.password = tempErrors.password && tempErrors.password.length > 0 ? `\n ${error}` : error;
    }
    if (formData.password.length < 8) {
      error = "Password must have a minimum length of 8 characters.";
      tempErrors.password = tempErrors.password && tempErrors.password.length > 0 ? `\n ${error}` : error;
    }

    if (formData.password !== formData.passwordconfirm) tempErrors.passwordconfirm = "Passwords do not match.";
    if (!formData.email) tempErrors.email = "Email is required.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Email is invalid.";
    if (!formData.phone) tempErrors.phone = "Phone number is required.";
    if (!/^\d{10}$/.test(formData.phone)) tempErrors.phone = "Phone number is invalid.";
    if (!formData.address) tempErrors.address = "Address is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const verifyUsername = (e, hideValidNotification = true) => {
    e.preventDefault();
    let tempErrors = {};
    fetch(`/api/users/check-availability?username=${formData.username}&type=username`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (!data) {
          // const error = "Username already registered. Please try again.";
          // tempErrors.username = error;
          // setErrors({...errors, ...tempErrors});
          showNotification("Username already registered. Please try again.", true);
        } else if (!hideValidNotification) {
          showNotification("Valid Username. Please proceed with other fields.", false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const verifyEmail = (e, hideValidNotification = true) => {
    e.preventDefault();
    let tempErrors = {};
    fetch(`/api/users/check-availability?email=${formData.email}&type=email`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (!data) {
          // const error = "Email already registered. Please try again.";
          // tempErrors.email = error;
          // setErrors({...errors, ...tempErrors});
          showNotification("Email already registered. Please try again.", true);
        } else if (!hideValidNotification) {
          showNotification("Valid Email. Please proceed with other fields.", false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const verifyContact = (e, hideValidNotification = true) => {
    e.preventDefault();
    let tempErrors = {};
    fetch(`/api/users/check-availability?phone=${formData.phone}&type=phone`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (!data) {
          // const error = "Contact already registered. Please try again.";
          // tempErrors.phone = error;
          // setErrors({...errors, ...tempErrors});
          showNotification("Contact already registered. Please try again.", true);
        } else if (!hideValidNotification) {
          showNotification("Valid contact. Please proceed with other fields.", false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // TODO- - Add username availaibility api
  const register = (e) => {
    e.preventDefault();
    //let tempErrors = {};
    if (validate()) {
      // check availabilities
      verifyEmail(e, true);
      verifyUsername(e, true);
      verifyContact(e, true);
      
      // setErrors(tempErrors);
      if (Object.keys(errors).length != 0) {
        return
      }

      fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      }).then(response => response.json())
        .then(data => {
          return props.changeState(data);
        });
    }
  };

  const { loggedIn, error } = props;

  return (
    <div className="register-container">
      <div style={{ height: '100%' }}>
        <div style={{ height: '100%' }}>
          <main style={{ height: '100%', marginTop: '5%' }}>
            <center>
              <div className="section"></div>
              <div className="container">
                <div className="z-depth-1 grey lighten-4 row" style={{ display: 'inline-block', padding: '32px 48px 0px 48px', border: '1px solid #EEE', borderRadius: '10px', paddingBottom: '30px' }}>
                  <h4 className="indigo-text">Sign Up</h4>
                  <div>
                    {loggedIn && <Navigate to="/" replace={true} />}
                    {error && <p style={{ color: 'red', fontSize: '0.9em' }}>{error}</p>}
                    <form className="register-form" onSubmit={register}>
                      <div className='row'>
                        <div className='input-field col s12'>
                          <input
                            className='field-form'
                            type="text"
                            placeholder="Name"
                            name="name"
                            id="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                          />
                        </div>
                        <div className='m-l-10'>
                          {errors.name && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.name}</p>}
                        </div>
                        <div className='input-field col s12 register-form-div'>
                          <input
                            className='field-form'
                            type="text"
                            placeholder="Username"
                            name="username"
                            id="username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                          />
                          <button onClick={verifyUsername} className='register-form-button'>Verify</button>
                        </div>
                        <div className='m-l-10'>
                          {errors.username && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.username}</p>}
                        </div>
                        <div className='input-field col s12'>
                          <input
                            className='field-form'
                            type="password"
                            placeholder="Password"
                            name="password"
                            id="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                          />
                        </div>
                        <div className='m-l-10'>
                          {errors.password && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.password}</p>}
                        </div>
                        <div className='input-field col s12'>
                          <input
                            className='field-form'
                            type="password"
                            placeholder="Confirm password"
                            name="passwordconfirm"
                            id="passwordconfirm"
                            required
                            value={formData.passwordconfirm}
                            onChange={handleChange}
                          />
                        </div>
                        <div className='m-l-10'>
                          {errors.passwordconfirm && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.passwordconfirm}</p>}
                        </div>
                        <div className='input-field col s12 register-form-div'>
                          <input
                            className='field-form'
                            type="email"
                            placeholder="Email"
                            name="email"
                            id="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                          />
                          <button onClick={verifyEmail} className='register-form-button'>Verify</button>
                        </div>
                        <div className='m-l-10'>
                          {errors.email && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.email}</p>}
                        </div>
                        <div className='input-field col s12 register-form-div'>
                          <input
                            className='field-form phone-field'
                            type="phone"
                            placeholder="Phone number"
                            name="phone"
                            id="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                          />
                          <button onClick={verifyContact} className='register-form-button m-t-26'>Verify</button>
                        </div>
                        <div className='m-l-10'>
                          {errors.phone && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.phone}</p>}
                        </div>
                        <div className='input-field col s12'>
                          <input
                            className='field-form'
                            type="text"
                            placeholder="Zipcode"
                            name="address"
                            id="address"
                            required
                            value={formData.address}
                            onChange={handleChange}
                          />
                        </div>
                        <div className='m-l-10'>
                          {errors.address && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.address}</p>}
                        </div>
                        <div className='input-field col s12'>
                          <input type="submit" className='col s12 btn btn-large waves-effect indigo' value="Register" />
                        </div>
                      </div>
                    </form>
                  </div>

                </div>
              </div>
            </center>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Register;
