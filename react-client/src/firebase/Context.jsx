import React, {useState, useEffect} from 'react';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
export const Context = React.createContext();

export const Provider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    let listener = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
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

  return (
    <Context.Provider value={{currentUser}}>
      {children}
    </Context.Provider>
  );
};