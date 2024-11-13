import React, { Fragment, useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import BookIcon from './BookIcon';
import M from 'materialize-css';
import { colors } from '@mui/material';

const Navigation = (props) => {
    const {user} = props
    const [activeItem, setActiveItem] = useState(null);
    useEffect(() => {
        const dropdowns = document.querySelectorAll('.dropdown-trigger');
        M.Dropdown.init(dropdowns, {
            alignment: 'left',
            coverTrigger: false,
            onOpenStart: function(el) {
              var dropdownContent = document.getElementById(el.dataset.target);
              dropdownContent.classList.add('max-width');
            },
            onCloseEnd: function(el) {
              var dropdownContent = document.getElementById(el.dataset.target);
              dropdownContent.classList.remove('max-width');
            }
          });
      }, []);

    const navComponents = [];

    const handleItemClick = (item) => {
        setActiveItem(item);
    };
    
    if (props.loggedIn) {
        console.log(props)
        navComponents.push(
                <ul key={0} className="nav-items right hide-on-med-and-down">
                    <li key={0} className={activeItem === 'home' ? 'p-r-5 p-l-5 active' : 'p-r-5 p-l-5'}>
                        <Link to="/" onClick={() => handleItemClick('home')}>
                            Home
                        </Link>
                    </li>
                    <li key={2} className={activeItem === 'books' ? 'p-r-5 p-l-5 active' : 'p-r-5 p-l-5'}>
                        <Link to="/managebooks" onClick={() => handleItemClick('books')}>
                            Manage books
                        </Link>
                    </li>
                    <li key={3} className={activeItem === 'order' ? 'p-r-5 p-l-5 active' : 'p-r-5 p-l-5'}>
                        <Link to="/search" onClick={() => handleItemClick('order')}>
                            Order Books
                        </Link>
                    </li>
                </ul>
        )
    } else {
        navComponents.push(
            <ul key={1} className="right hide-on-med-and-down">
                <li key={1} className={activeItem === 'login' ? 'p-r-5 p-l-5 active' : 'p-r-5 p-l-5'}><Link to="/login" onClick={() => handleItemClick('login')}>Login</Link></li>
                <li key={2} className={activeItem === 'register' ? 'p-r-5 p-l-5 active' : 'p-r-5 p-l-5'}><Link to="/register" onClick={() => handleItemClick('register')}>Register</Link></li>
            </ul>
        )
    }

    return (
        
        // <div className="nav-bar">
        //     {navComponents}
        <nav>
            <div class="nav-wrapper" style={{background: 'royalblue'}}>
                <div style={{display: 'flex'}}>
                    <div><BookIcon /></div>
                    <div><a href="#" class="brand-logo">BookEx</a></div>
                    <div style={{position:'fixed', right: 0}}>
                        <ul id="nav-mobile" className="right hide-on-med-and-down" style={{ display: props.loggedIn ? 'block' : 'none' }}>
                            <li key={5} className={activeItem === 'user' ? 'p-r-5 p-l-5 active' : 'p-r-5 p-l-5'}>
                                <div style={{display: 'flex'}}>
                                        <div><i className="material-icons">verified_user</i></div>
                                        <div><a className="dropdown-trigger" href="#!" data-target="dropdown1" onClick={() => handleItemClick('user')}><span style={{color:'gold'}}>{user || 'user'}</span></a></div>
                                </div>
                            </li>
                        </ul>
                        <ul id="dropdown1" className="dropdown-content" style={{top: '65px !important', display: 'contents !important'}}>
                            <li key={6}>
                                <Link to="/" onClick={props.logOut}>
                                    Logout
                                </Link>
                            </li>
                            <li key={7}>
                                <Link to="/profile">
                                    Profile
                                </Link>
                            </li>
                        </ul>
                        <ul id="nav-mobile" className="right hide-on-med-and-down" style={{ display: props.loggedIn ? 'block' : 'none' }}>
                            <li key={8} className={activeItem === 'requests' ? 'p-r-5 p-l-5 active' : 'p-r-5 p-l-5'}>
                                <div style={{display: 'flex'}}>
                                        <div><a className="dropdown-trigger" href="#!" data-target="dropdown2" onClick={() => handleItemClick('requests')}>Requests</a></div>
                                </div>
                            </li>
                        </ul>
                        <ul id="dropdown2" className="dropdown-content" style={{top: '65px !important', display: 'contents !important'}}>
                            <li key={9}>
                                <Link to="/orders/created">
                                    Book Orders Raised
                                </Link>
                            </li>
                            <li key={10}>
                                <Link to="/orders/received">
                                    Book Orders Received
                                </Link>
                            </li>
                        </ul>
                        {navComponents}                  
                    </div>
                </div>
            </div>
        </nav>
        // </div>
    )
}

export default Navigation;
