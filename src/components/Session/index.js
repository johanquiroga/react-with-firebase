import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import AuthContext from './context';

import { useFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes';

function AuthProvider({ children }) {
  const firebase = useFirebase();
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem('authUser')),
  );

  useEffect(() => {
    const unsubscribe = firebase.onAuthUserListener(
      user => {
        localStorage.setItem('authUser', JSON.stringify(user));
        setAuthUser(user);
      },
      () => {
        localStorage.removeItem('authUser');
        setAuthUser(null);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [firebase]);

  return (
    <AuthContext.Provider value={authUser}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

const withAuthorization = condition => Component => {
  function Wrapper(props) {
    const history = useHistory();
    const authUser = useAuth();

    if (!condition(authUser)) {
      history.push(ROUTES.SIGN_IN);
    }

    return condition(authUser) ? <Component {...props} /> : null;
  }
  Wrapper.displayName = `withAuthorization(${Component.displayName ||
    Component.name})`;
  return Wrapper;
};

export { AuthProvider, useAuth, withAuthorization };
