import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import AuthContext from './context';

import { useFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes';

function AuthProvider({ children }) {
  const firebase = useFirebase();
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth.onAuthStateChanged(setAuthUser);

    return () => {
      unsubscribe();
    };
  }, [firebase.auth]);

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
      return null;
    }

    return <Component {...props} />;
  }
  Wrapper.displayName = `withAuthorization(${Component.displayName ||
    Component.name})`;
  return Wrapper;
};

export { AuthProvider, useAuth, withAuthorization };
