import React, { useContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { getRenter, getLandlord, getAdmin, getUserAccountType } from '../graphql/Queries';
import { AuthContext } from './AuthContext';

export const UserContext = React.createContext({
    currentUser: null
});

export const UserProvider = ({children}) => {
  const {currentUser} = useContext(AuthContext);
  const [uid] = useState(currentUser ? currentUser.uid : null);

  const { data: accountTypeData, loading: accountTypeLoading, error: AccountTypeError } = useQuery(getUserAccountType(), {
    variables: { id: uid },
    skip: !currentUser || !currentUser.displayName
  });

  let accountType;
  if(accountTypeData) {
    accountType = accountTypeData.getUserAccountType;
  }

  let query = getRenter();
  if (accountType === 'landlord') {
     query = getLandlord();
  }
  else if (accountType === 'admin') {
      query = getAdmin();
  }

  const {data: user, loading: userLoading, error: userError }  = useQuery(query, {
      variables: {id: uid},
      skip: !accountTypeData
  });

  if (accountTypeLoading) {
    return (
      <h2> Loading user account type... </h2>
    );
  }
  if (AccountTypeError) {
    throw new Error(AccountTypeError);
  }

  if (userLoading) {
    return (
      <h2> Loading user data... </h2>
    );
  }
  if (userError) {
    throw new Error(userError);
  }

  let userData;
  if (accountType === 'renter') {
    userData = user.getRenterById;
  }
  else if (accountType === 'landlord') {
    userData = user.getLandlordById;
  }
  else if (accountType === 'admin') {
    userData = user.getAdminById;
  }

  return (
    <UserContext.Provider value={{currentUser, userData, accountType}}>
      {children}
    </UserContext.Provider>
  );
};