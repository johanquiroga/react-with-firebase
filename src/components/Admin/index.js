import React, { useState, useEffect } from 'react';

import { useFirebase } from '../Firebase';
import { withAuthorization } from '../Session';

import * as ROLES from '../../constants/roles';

function Admin() {
  const firebase = useFirebase();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setLoading(true);
    firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));

      setLoading(false);
      setUsers(usersList);
    });
    return () => {
      firebase.users().off();
    };
  }, [firebase]);

  return (
    <div>
      <h1>Admin</h1>
      <p>The Admin Page is accessible by every signed in admin user</p>
      {loading && <div>Loading...</div>}

      <UsersList users={users} />
    </div>
  );
}

function UsersList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.uid}>
          <span>
            <strong>ID:</strong> {user.uid}
          </span>
          <span>
            <strong>E-Mail:</strong> {user.email}
          </span>
          <span>
            <strong>Username:</strong> {user.username}
          </span>
        </li>
      ))}
    </ul>
  );
}

const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];

export default withAuthorization(condition)(Admin);
