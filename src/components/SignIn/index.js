import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useFirebase } from '../Firebase';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';

import * as ROUTES from '../../constants/routes';

function SignInPage() {
  return (
    <div>
      <h1>SignIn</h1>
      <SignInForm />
      <SignInGoogle />
      <SignInFacebook />
      <SignInTwitter />
      <PasswordForgetLink />
      <SignUpLink />
    </div>
  );
}

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

function SignInForm() {
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
}

function SignInGoogle() {
  const history = useHistory();
  const firebase = useFirebase();
  const [error, setError] = useState(null);

  const onSubmit = event => {
    event.preventDefault();

    firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
          roles: {},
        });
      })
      .then(() => {
        setError(null);
        history.push(ROUTES.HOME);
      })
      .catch(setError);
  };

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Google</button>

      {error && <p>{error.message}</p>}
    </form>
  );
}

function SignInFacebook() {
  const history = useHistory();
  const firebase = useFirebase();
  const [error, setError] = useState(null);

  const onSubmit = event => {
    event.preventDefault();

    firebase
      .doSignInWithFacebook()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          roles: {},
        });
      })
      .then(() => {
        setError(null);
        history.push(ROUTES.HOME);
      })
      .catch(setError);
  };

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Facebook</button>

      {error && <p>{error.message}</p>}
    </form>
  );
}

function SignInTwitter() {
  const history = useHistory();
  const firebase = useFirebase();
  const [error, setError] = useState(null);

  const onSubmit = event => {
    event.preventDefault();

    firebase
      .doSignInWithTwitter()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          roles: {},
        });
      })
      .then(() => {
        setError(null);
        history.push(ROUTES.HOME);
      })
      .catch(setError);
  };

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Twitter</button>

      {error && <p>{error.message}</p>}
    </form>
  );
}

export default SignInPage;
export { SignInForm, SignInGoogle, SignInFacebook, SignInTwitter };
