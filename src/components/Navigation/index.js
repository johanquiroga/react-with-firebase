import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../Session';

import SignOutButton from '../SignOut';

import * as ROUTES from '../../constants/routes';

function Navigation() {
  const authUser = useAuth();
  return <div>{authUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
}

function NavigationAuth() {
  return (
    <ul>
      <li>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </li>
      <li>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
      <li>
        <Link to={ROUTES.ACCOUNT}>Account</Link>
      </li>
      <li>
        <SignOutButton />
      </li>
    </ul>
  );
}

function NavigationNonAuth() {
  return (
    <ul>
      <li>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </li>
      <li>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </li>
    </ul>
  );
}

export default Navigation;
