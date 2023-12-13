import React, { useEffect, useState } from 'react';
import '../index.css';

function Home() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApartments = async () => {
      const query = JSON.stringify({
        query: `
          query {
            apartments {
              id
              address
              description
              images
              price
              amenities
              landlord {
                name
              }
            }
          }
        `,
      });

      try {
        const response = await fetch('http://localhost:3000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: query,
        });

        const result = await response.json();
        if (result.data && result.data.apartments) {
          setApartments(result.data.apartments);
        }
      } catch (error) {
        console.error('Error fetching apartments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  return (
    <div className='card'>
      <h2>Home Page - Apartments for Rent</h2>
      {loading ? (
        <p>Loading apartments...</p>
      ) : (
        <div className="apartments-list">
          {apartments.map((apartment, index) => (
            <div key={index} className="apartment">
              <h3>{apartment.address}</h3>
              <p>{apartment.description}</p>
              <p>{`Price: $${apartment.price}`}</p>
              <p>Amenities: {apartment.amenities.join(', ')}</p>
              <p>Landlord: {apartment.landlord.name}</p>
              {/* Display images here */}
              {apartment.images && apartment.images.map((image, imgIndex) => (
                <img key={imgIndex} src={image} alt={`Apartment at ${apartment.address}`} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
