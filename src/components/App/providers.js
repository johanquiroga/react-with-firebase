import React from 'react';

import { FirebaseProvider } from '../Firebase';
import { AuthProvider } from '../Session';

function AppProviders({ children }) {
  return (
    <FirebaseProvider>
      <AuthProvider>{children}</AuthProvider>
    </FirebaseProvider>
  );
}

export default AppProviders;
