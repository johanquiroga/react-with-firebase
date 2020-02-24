import React from 'react';

import { useFirebase } from '../Firebase';

const SignOut = () => {
  const firebase = useFirebase();

  return (
    <button type="button" onClick={firebase.doSignOut}>
      Sign Out
    </button>
  );
};

export default SignOut;
