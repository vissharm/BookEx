import React, { useState, useEffect } from "react";
import Loader from "../components/Loader.jsx"
import {showNotification} from './utility/helper.js'

const ProfileForm = (props) => {
  const {email, username, name, user_id} = props.user
  const {changeState, loggedIn} = props
  const [formValues, setFormValues] = useState({
    displayName: name,
    username: username,
    email: email,
    password: "",
    confirmPassword: "",
    changePassword: false,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  useEffect(() => {
    const isChanged =
      formValues.email?.trim().toLowerCase() !== email.trim().toLowerCase() ||
      (formValues.changePassword &&
        formValues.password &&
        formValues.password === formValues.confirmPassword);

    setIsDirty(isChanged);
  }, [formValues]);

  const validatePassword = (password) => {
    const errors = [];
    if (!/(?=.*[a-z])/.test(password)) errors.push("at least one lowercase letter");
    if (!/(?=.*[A-Z])/.test(password)) errors.push("at least one uppercase letter");
    if (!/(?=.*\d)/.test(password)) errors.push("at least one digit");
    if (!/(?=.*[@$!%*?&])/.test(password)) errors.push("at least one special character (e.g., @$!%*?&)");
    if (password.length < 8) errors.push("a minimum length of 8 characters");
    return errors.length === 0 ? null : `Password must contain ${errors.join(", ")}`;
  };
  
  const validateEmail = (email) => {
    const errors = [];
    if (!email) errors.push("Email is required.");
    if (!/\S+@\S+\.\S+/.test(email)) errors.push("Email is invalid.");
    return errors;
  }
  
  const checkUniqueEmail = (email) => {
    setIsCheckingEmail(true);
    fetch(`/api/users/check-availability?email=${email}&type=email`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setIsCheckingEmail(false);
        if (!data) {
          setEmailError("Email is already in use.");
        }
      })
      .catch((err) => {
        console.log(err);
        setIsCheckingEmail(false);
        return false;
      });
  };

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: updatedValue,
      ...(name === "changePassword" && !checked ? { password: "", confirmPassword: "" } : {}),
    }));

    if (isNotNullOrEmpty(value) && value != props.email) {
      if (name === "email") {
          const errors = validateEmail(value)
          if (errors.length == 0)
          {
            setEmailError("");
            checkUniqueEmail(value);
          }
          else
            setEmailError(errors.join(' '));
        }
    }

    if (name === "password" || name === "confirmPassword") {
      const error = validatePassword(value);
      setPasswordError(error);
    }
  };

  const isNotNullOrEmpty = (str) => {
    return str !== null && str !== undefined && str !== '';
  }

  const handleSave = () => {
    if (emailError || passwordError) return;

    const {email, password, changePassword} = formValues;

    const objToSend = {};
    if (props.email != email) {
      objToSend.email = email;
    }
    
    if (changePassword && isNotNullOrEmpty(password)){
      objToSend.password = password;
    }

    return fetch('/api/users/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        user_id: props.userId,
        ...objToSend
      })
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        setFormValues({
          ...formValues,
          password: '',
          confirmPassword: ''
        });
        changeState({user: {
          ...data
        }, loggedIn})
        showNotification("Profile saved successfully.", false);
      })
      .catch(error => {
        console.error(error);
      });
    console.log("Form data saved:", formValues);
  };

  return (
    <div className="container profile-container">
      {isCheckingEmail && (
        <div className="loader-overlay">
          <Loader text={isCheckingEmail} />
        </div>
      )}
      <h5 className="profile-title" style={{marginBottom: '60px'}}>User Profile</h5>
      <div className="input-field m-b-40">
        <input
          type="text"
          name="displayName"
          value={formValues.displayName}
          disabled
        />
        <label className="active c-gray">Display Name</label>
      </div>
      <div className="input-field m-b-40">
        <input
          type="text"
          name="username"
          value={formValues.username}
          disabled
        />
        <label className="active c-gray">Username</label>
      </div>
      <div className="input-field m-b-40">
        <input
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
        />
        <label className="active">Email</label>
        {emailError && <span className="red-text">{emailError}</span>}
        {isCheckingEmail && <span className="grey-text">Checking email...</span>}
      </div>
      
      <div className="input-field m-b-40" style={{height: '30px'}}>
        <label>
          <input
            type="checkbox"
            name="changePassword"
            className="filled-in profile-checkbox"
            checked={formValues.changePassword}
            onChange={handleChange}
          />
          <span className="profile-checkbox-label">Change Password</span>
        </label>
      </div>
      
      {formValues.changePassword && (
        <>
          <div className="input-field m-b-40">
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
            />
            <label className="c-gray">Password</label>
            {passwordError && <span className="red-text">{passwordError}</span>}
          </div>
          <div className="input-field m-b-40">
            <input
              type="password"
              name="confirmPassword"
              value={formValues.confirmPassword}
              onChange={handleChange}
            />
            <label className="c-gray">Confirm Password</label>
            {formValues.password !== formValues.confirmPassword && formValues.confirmPassword && (
              <span className="red-text">Passwords do not match</span>
            )}
          </div>
        </>
      )}
      
      <button
        className="btn waves-effect waves-light m-t-20"
        onClick={handleSave}
        disabled={
          !isDirty ||
          emailError ||
          (formValues.changePassword && passwordError) ||
          (formValues.changePassword && formValues.password !== formValues.confirmPassword) ||
          isCheckingEmail
        }
      >
        Save
      </button>
    </div>
  );
};

export default ProfileForm;
