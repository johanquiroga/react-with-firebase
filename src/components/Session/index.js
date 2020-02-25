import React, { useState, useEffect } from 'react';

import { useFirebase } from '../Firebase';

import AuthContext from './context';

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

export { AuthProvider, useAuth };
