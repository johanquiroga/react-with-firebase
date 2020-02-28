import React, { useState, useEffect } from 'react';

import { withAuthorization, useAuth } from '../Session';
import { useFirebase } from '../Firebase';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import { useCallback } from 'react';

const SIGN_IN_METHODS = [
  {
    id: 'password',
    provider: null,
  },
  {
    id: 'google.com',
    provider: 'googleProvider',
  },
  {
    id: 'facebook.com',
    provider: 'facebookProvider',
  },
  {
    id: 'twitter.com',
    provider: 'twitterProvider',
  },
];

function AccountPage() {
  const authUser = useAuth();
  return (
    <div>
      <h1>Account: {authUser.email}</h1>
      <PasswordForgetForm />
      <PasswordChangeForm />
      <LoginManagement />
    </div>
  );
}

function LoginManagement() {
  const authUser = useAuth();
  const firebase = useFirebase();
  const [activeSignInMethods, setActiveSignInMethods] = useState([]);
  const [error, setError] = useState(null);

  const fetchSignInMethods = useCallback(() => {
    firebase.auth
      .fetchSignInMethodsForEmail(authUser.email)
      .then(signInMethods => {
        setActiveSignInMethods(signInMethods);
        setError(null);
      })
      .catch(setError);
  }, [authUser.email, firebase.auth]);

  useEffect(() => {
    fetchSignInMethods();
  }, [fetchSignInMethods]);

  const onSocialLoginLink = useCallback(
    provider => {
      firebase.auth.currentUser
        .linkWithPopup(firebase[provider])
        .then(fetchSignInMethods)
        .catch(setError);
    },
    [fetchSignInMethods, firebase],
  );

  const onUnlink = useCallback(
    providerId => {
      firebase.auth.currentUser
        .unlink(providerId)
        .then(fetchSignInMethods)
        .catch(setError);
    },
    [fetchSignInMethods, firebase.auth.currentUser],
  );

  const onDefaultLoginLink = useCallback(
    password => {
      const credential = firebase.emailAuthProvider.credential(
        authUser.email,
        password,
      );

      firebase.auth.currentUser
        .linkAndRetrieveDataWithCredential(credential)
        .then(fetchSignInMethods)
        .catch(setError);
    },
    [
      authUser.email,
      fetchSignInMethods,
      firebase.auth.currentUser,
      firebase.emailAuthProvider,
    ],
  );

  return (
    <div>
      Sign In Methods:
      <ul>
        {SIGN_IN_METHODS.map(signInMethod => {
          const onlyOneLeft = activeSignInMethods.length === 1;
          const isEnabled = activeSignInMethods.includes(signInMethod.id);

          return (
            <li key={signInMethod.id}>
              {signInMethod.id === 'password' ? (
                <DefaultLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onLink={onDefaultLoginLink}
                  onUnlink={onUnlink}
                />
              ) : (
                <SocialLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onLink={onSocialLoginLink}
                  onUnlink={onUnlink}
                />
              )}
            </li>
          );
        })}
      </ul>
      {error && <p>{error.message}</p>}
    </div>
  );
}

function SocialLoginToggle({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink,
}) {
  if (isEnabled) {
    return (
      <button
        type="button"
        onClick={() => onUnlink(signInMethod.id)}
        disabled={onlyOneLeft}
      >
        Deactivate {signInMethod.id}
      </button>
    );
  }

  return (
    <button type="button" onClick={() => onLink(signInMethod.provider)}>
      Link {signInMethod.id}
    </button>
  );
}

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
};

function DefaultLoginToggle({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink,
}) {
  const [{ passwordOne, passwordTwo }, setFormState] = useState({
    ...INITIAL_STATE,
  });

  const onSubmit = event => {
    event.preventDefault();

    onLink(passwordOne);
    setFormState({ ...INITIAL_STATE });
  };

  const onChange = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      [event.target.name]: event.target.value,
    }));
  };

  const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

  if (isEnabled)
    return (
      <button
        type="button"
        onClick={() => onUnlink(signInMethod.id)}
        disabled={onlyOneLeft}
      >
        Deactivate {signInMethod.id}
      </button>
    );

  return (
    <form onSubmit={onSubmit}>
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={onChange}
        type="password"
        placeholder="New Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange}
        type="password"
        placeholder="Confirm New Password"
      />

      <button disabled={isInvalid} type="submit">
        Link {signInMethod.id}
      </button>
    </form>
  );
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);
