import React from 'react';

import { withAuthorization, useAuth } from '../Session';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

function AccountPage() {
  const authUser = useAuth();
  return (
    <div>
      <h1>Account: {authUser.email}</h1>
      <PasswordForgetForm />
      <PasswordChangeForm />
    </div>
  );
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);
