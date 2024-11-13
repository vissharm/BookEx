import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation.jsx';
import Dashboard from './routes/Dashboard.jsx';
import Login from './routes/Login.jsx';
import Register from './routes/Register.jsx';
import ManageBooks from './routes/ManageBooks.jsx';
import OrderBook from './routes/OrderBook.jsx';
import ForgotPassword from './routes/ForgotPassword.jsx'
import OrdersCreated from './routes/OrdersCreated.jsx'
import OrdersReceived from './routes/OrdersReceived.jsx'
import Profile from './routes/Profile.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [state, setState] = useState({
    loggedIn: false,
    userId: null,
    email: '',
    error: null,
    username: '',
    name: '',
    user: {}
  });

  const changeState = (data) => {
    if (data.err) {
      console.log('error found');
      setState({ loggedIn: false, error: "Please Try Again" });
    } else if (data.loggedIn) {
      setState({
        loggedIn: true,
        userId: data.user.user_id,
        email: data.user.email,
        name: data.user.name,
        username: data.user.name,
        error: null,
        user: data.user
      });
    } else {
      setState({ loggedIn: false, error: "Please Try Again" });
    }
  };

  const logOut = () => {
    setState({ loggedIn: false, userId: null, error: null });
  };

  return (
      <div style={state.loggedIn ? {background: 'bottom', height: '100%', backgroundColor: 'lightyellow'} : {background: 'black', height: '100%'}}>
        <Router>
          <Navigation logOut={logOut} loggedIn={state.loggedIn} user={state.name || state.username} userId={state.userId} />
          <Routes>
            <Route path="/login" element={<Login changeState={changeState} loggedIn={state.loggedIn} userId={state.userId} error={state.error} />} />
            <Route path="/register" element={<Register changeState={changeState} loggedIn={state.loggedIn} userId={state.userId} error={state.error} />} />
            <Route path="/forgotpassword" element={<ForgotPassword changeState={changeState} loggedIn={state.loggedIn} userId={state.userId} email={state.email} error={state.error} />} />
            <Route path="/managebooks" element={<ManageBooks loggedIn={state.loggedIn} userId={state.userId} />} />
            <Route path="/search" element={<OrderBook loggedIn={state.loggedIn} userId={state.userId} />} />
            <Route path="/orders/created" element={<OrdersCreated loggedIn={state.loggedIn} userId={state.userId} />} />
            <Route path="/orders/received" element={<OrdersReceived loggedIn={state.loggedIn} userId={state.userId} />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile changeState={changeState} loggedIn={state.loggedIn} user={state.user} userId={state.userId} />} />
          </Routes>
        </Router>
        <div>
          <ToastContainer />
        </div>
      </div>
  );
};

export default App;
