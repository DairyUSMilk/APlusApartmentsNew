import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../firebase/Context';
import { useQuery } from '@apollo/client';
import { getApprovedApartments, getUserAccountType, getRenter, getLandlord, getAdmin } from '../graphql/Queries';
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

  const {data: userData, loading: userLoading, error:userError }  = useQuery(query, {
      variables: {id: uid},
      skip: !accountTypeData
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

  if (userLoading) {
    return (
      <h2> Loading user data... </h2>
    );
  }
  if (userError) {
    throw new Error(userError);
  }

  let user;
  if (accountType === 'renter') {
    user = userData.getRenterById;
  }
  else if (accountType === 'landlord') {
    user = userData.getLandlordById;
  }
  else if (accountType === 'admin') {
    user = userData.getAdminById;
  }

  let apartmentList =  
    data &&
    data.apartments.map((apartment) => {
        return (
        <ApartmentCard 
          apartment={apartment} 
          userId={uid} 
          accountType={accountType}
          inBookmark={user && user.savedApartments.some(item => item.id === apartment.id)} 
          key={apartment.id} 
        />
        );
    });

  return (
    <div className='card'>
      <h2>Apartments for Rent</h2>
      <CardGroup>{apartmentList}</CardGroup>
    </div>
  );
}

export default Home;
