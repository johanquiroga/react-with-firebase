import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes';

function PasswordForgetPage() {
  return (
    <div>
      <h1>PasswordForget</h1>
      <PasswordForgetForm />
    </div>
  );
}

const INITIAL_STATE = {
  email: '',
  error: null,
};

function PasswordForgetForm() {
  const firebase = useFirebase();
  const [{ email, error }, setFormState] = useState({ ...INITIAL_STATE });

  const isInvalid = email === '';

  const onSubmit = event => {
    event.preventDefault();

    firebase
      .doPasswordReset(email)
      .then(() => {
        setFormState({ ...INITIAL_STATE });
      })
      .catch(error => {
        setFormState(formState => ({ ...formState, error }));
      });
  };

  const onChange = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />

      <button disabled={isInvalid} type="submit">
        Reset My Password
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
}

function PasswordForgetLink() {
  return (
    <p>
      <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
    </p>
  );
}

export default PasswordForgetPage;
export { PasswordForgetForm, PasswordForgetLink };
