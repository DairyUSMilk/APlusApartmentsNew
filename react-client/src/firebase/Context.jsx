import React, {useState, useEffect} from 'react';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import { useLazyQuery } from "@apollo/client";

import { getUserAccountType } from '../graphql/Queries';

export const Context = React.createContext();

export const Provider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  const [userAccountType, { data: accountType, loading: isLoading }] = useLazyQuery(getUserAccountType());

  useEffect(() => {
    let listener = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.displayName) {
        userAccountType({
          variables: {uid: user.uid}
        })
      }
      setLoading(false);
    });
    return () => {
      if (listener) listener();
    };
  }, []);

  if (loading || isLoading) {
    return (
      <h2> Loading... </h2>
    );
  }

  let currentAccountType = null;
  if (accountType) {
    currentAccountType = accountType.getUserAccountType;
  }

  return (
    <Context.Provider value={{currentUser, currentAccountType}}>
      {children}
    </Context.Provider>
  );
};