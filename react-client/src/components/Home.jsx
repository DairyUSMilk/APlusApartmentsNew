import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../firebase/Context';
import { useQuery, useLazyQuery } from '@apollo/client';
import { getApprovedApartments, getUserAccountType } from '../graphql/Queries';
import ApartmentCard from './ApartmentCard';

import CardGroup from 'react-bootstrap/CardGroup';
import '../index.css';

function Home() {
  const  {currentUser} = useContext(Context);

  const { data, loading, error } = useQuery(getApprovedApartments());
  const [ getAccountType, { data: accountTypeData, loading: accountTypeLoading, error: AccountTypeError }] = useLazyQuery(getUserAccountType());

  if (currentUser && currentUser.displayName) {
    getAccountType( {variables: {id: currentUser.uid}} );
  }
  if (loading || accountTypeLoading) {
      return (
        <h2> Loading... </h2>
      );
  }

  if (error || AccountTypeError) {
      throw new Error(error.message);
  }

  let accountType = null;
  if(accountTypeData) {
    accountType = accountTypeData.getUserAccountType;
  }

  let apartmentList =  
    data &&
    data.apartments.map((apartment) => {
        return <ApartmentCard apartment={apartment} userId={currentUser.uid} accountType={accountType} key={apartment.id} />;
    });

  return (
    <div className='card'>
      <h2>Apartments for Rent</h2>
      <CardGroup>{apartmentList}</CardGroup>
    </div>
  );
}

export default Home;
