import React, {useState, useEffect} from 'react';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import { useQuery } from "@apollo/client";

import { getUserAccountType } from '../graphql/Queries';
export const Context = React.createContext();

export const Provider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userAccountType, setUserAccountType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    let listener = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (currentUser && currentUser.displayName) {
        let { loading, data, error } =  useQuery(getUserAccountType(user.uid));
        setLoading(loading);
        setError(error);
        setUserAccountType(data.getUserAccountType);
      }
      else {
        setLoading(false);
      }
    });
    return () => {
      if (listener) listener();
    };
  }, []);

  if (loading) {
    return (
      <div>
      </div>
    );
  }
  if(error) {
    throw Error(error.message)
  }

  return (
    <Context.Provider value={{currentUser, userAccountType}}>
      {children}
    </Context.Provider>
  );
};