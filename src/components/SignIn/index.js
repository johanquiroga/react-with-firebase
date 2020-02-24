import React from 'react';
import { useHistory } from 'react-router-dom';

import { SignUpLink } from '../SignUp';

import { useFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes';
import { useState } from 'react';

const SignInPage = () => {
  return (
    <div>
      <h1>SignIn</h1>
      <SignInForm />
      <SignUpLink />
    </div>
  );
};

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

const SignInForm = () => {
  const firebase = useFirebase();
  const history = useHistory();
  const [{ email, password, error }, setFormState] = useState({
    ...INITIAL_STATE,
  });

  const isInvalid = email === '' || password === '';

  const onSubmit = event => {
    event.preventDefault();

    firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        setFormState({ ...INITIAL_STATE });
        history.push(ROUTES.HOME);
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
      <input
        name="password"
        value={password}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <button disabled={isInvalid} type="submit">
        Sign In
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

export default SignInPage;
