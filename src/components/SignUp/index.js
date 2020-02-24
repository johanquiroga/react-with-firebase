import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes';

const SignUpPage = () => {
  return (
    <div>
      <h1>SignUp</h1>
      <SignUpForm />
    </div>
  );
};

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

const SignUpForm = () => {
  const firebase = useFirebase();
  const history = useHistory();

  const [
    { username, email, passwordOne, passwordTwo, error },
    setFormState,
  ] = useState({
    ...INITIAL_STATE,
  });

  const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === '' ||
    email === '' ||
    username === '';

  const onSubmit = event => {
    event.preventDefault();

    firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
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
        name="username"
        value={username}
        onChange={onChange}
        type="text"
        placeholder="Full Name"
      />
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange}
        type="password"
        placeholder="Confirm Password"
      />

      <button disabled={isInvalid} type="submit">
        Sign Up
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

export default SignUpPage;
export { SignUpForm, SignUpLink };
