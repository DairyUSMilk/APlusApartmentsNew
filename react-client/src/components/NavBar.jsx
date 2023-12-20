import React, {useContext} from 'react';
import {UserContext} from '../context/UserContext';
import {logOut} from '../firebase/AuthFunctions';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../index.css';

function NavBar() {
  const {currentUser} = useContext(UserContext);
  return <div>{currentUser ? <NavBarSignedIn /> : <NavBarSignedOut />}</div>;
}

const NavBarSignedIn = () => {
    return (
      <Navbar bg="light" data-bs-theme="light">
      <Container>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/account">Account</Nav.Link>
          <SignOutButton />
        </Nav>
      </Container>
    </Navbar>
    );
  };
  
  const NavBarSignedOut = () => {
    return (
      <Navbar bg="light" data-bs-theme="light">
      <Container>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/sign-in">Sign In</Nav.Link>
          <Nav.Link href="/sign-up">Sign Up</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
    );
  };
  
  const SignOutButton = () => {
    return (
      <Nav.Link href="/" onClick={logOut}>Sign Out</Nav.Link>
    );
  };

  export default NavBar;
  
