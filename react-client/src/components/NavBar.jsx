import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import {Context} from '../firebase/Context';
import {logOut} from '../firebase/AuthFunctions';
import '../index.css';

function NavBar() {
  const {currentUser} = useContext(Context);
  return <div>{currentUser ? <NavBarSignedIn /> : <NavBarSignedOut />}</div>;
}

const NavBarSignedIn = () => {
    return (
      <nav className='navigation'>
        <ul>
          <li>
            <NavLink to='/'>Home</NavLink>
          </li>
          <li>
            <NavLink to='/account'>Account</NavLink>
          </li>
          <li>
            <SignOutButton />
          </li>
        </ul>
      </nav>
    );
  };
  
  const NavBarSignedOut = () => {
    return (
      <nav className='navigation'>
        <ul>
          <li>
            <NavLink to='/'>Home</NavLink>
          </li>
          <li>
            <NavLink to='/sign-up'>Sign up</NavLink>
          </li>
  
          <li>
            <NavLink to='/sign-in'>Sign In</NavLink>
          </li>
        </ul>
      </nav>
    );
  };
  
  const SignOutButton = () => {
    return (
      <button className='button' type='button' onClick={logOut}>
        Sign Out
      </button>
    );
  };

  export default NavBar;
  
