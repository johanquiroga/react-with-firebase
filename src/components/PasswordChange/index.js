import React, { useState } from 'react';

import { useFirebase } from '../Firebase';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

function PasswordChangeForm() {
  const firebase = useFirebase();
  const [{ passwordOne, passwordTwo, error }, setFormState] = useState({
    ...INITIAL_STATE,
  });

  const onSubmit = event => {
    event.preventDefault();

    firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        setFormState({ ...INITIAL_STATE });
      })
      .catch(error => {
        setFormState(formState => ({ ...INITIAL_STATE, error }));
      });
  };

  const onChange = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      [event.target.name]: event.target.value,
    }));
  };

  const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

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
        Reset My Password
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
}

export default PasswordChangeForm;
