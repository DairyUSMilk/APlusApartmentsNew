import React, {useContext} from 'react';
import '../index.css';
import Map from './Map';

function Home() {
  return (
    <div className='card'>
      <h2>
        Home page -- TODO: list all apartments for rent
      </h2>
      <Map />
    </div>
  );
}

export default Home;