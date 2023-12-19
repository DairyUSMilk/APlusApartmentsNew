import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../firebase/Context';
import { useQuery, useLazyQuery } from '@apollo/client';
import { getApprovedApartments, getUserAccountType } from '../graphql/Queries';
import ApartmentCard from './ApartmentCard';

import CardGroup from 'react-bootstrap/CardGroup';
import '../index.css';

function Home() {
  const  {currentUser} = useContext(Context);
  const [uid] = useState(currentUser ? currentUser.uid : null);

  const { data, loading, error } = useQuery(getApprovedApartments());
  const { data: accountTypeData, loading: accountTypeLoading, error: AccountTypeError } = useQuery(getUserAccountType(), {
    variables: { id: uid },
    skip: !currentUser || !currentUser.displayName
  });

  if (loading) {
      return (
        <h2> Loading apartments... </h2>
      );
  }
  if (accountTypeLoading) {
    return (
      <h2> Loading user data... </h2>
    );
}

  if (error) {
      throw new Error(error.message);
  }

  if (AccountTypeError) {
    throw new Error(AccountTypeError.message);
  }

  let accountType;
  if(accountTypeData) {
    accountType = accountTypeData.getUserAccountType;
  }

  let apartmentList =  
    data &&
    data.apartments.map((apartment) => {
        return <ApartmentCard apartment={apartment} userId={uid} accountType={accountType} key={apartment.id} />;
    });

  return (
    <div className='card'>
      <h2>Apartments for Rent</h2>
      <CardGroup>{apartmentList}</CardGroup>
    </div>
  );
}

export default Home;
