import React, {useState, useEffect} from 'react';
import {getAuth, onAuthStateChanged} from 'firebase/auth';

export const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
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
      <h2> Loading... </h2>
    );
  }

  return (
    <AuthContext.Provider value={{currentUser}}>
      {children}
    </AuthContext.Provider>
  );
};