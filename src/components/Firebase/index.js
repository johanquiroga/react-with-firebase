import React from 'react';
import FirebaseContext from './context';
import Firebase from './firebase';

const firebase = new Firebase();

function FirebaseProvider({ children }) {
  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
}

function useFirebase() {
  const context = React.useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export { FirebaseProvider, useFirebase };
