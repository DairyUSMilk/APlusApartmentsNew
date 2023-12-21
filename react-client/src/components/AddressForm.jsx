import React, { useState, useRef, useEffect } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import axios from 'axios';

const AddressForm = ({ updateCoords, mapCenter }) => {
    // State to manage user input
    const [userAddress, setUserAddress] = useState({
        street_address: '',
        city: '',
        state: '',
        zip_code: '',
    });

    // Refs for Autocomplete components
    const autocompleteRefStreet = useRef(null);
    const autocompleteRefCity = useRef(null);
    const autocompleteRefState = useRef(null);
    const autocompleteRefZip = useRef(null);

    // Function to handle user input change
    const handleChange = (e) => {
        setUserAddress({ ...userAddress, [e.target.name]: e.target.value });
    };

    // Function to update Autocomplete options based on map center
    const updateAutocomplete = (autocompleteObj, center = { lat: mapCenter.lat, lng: mapCenter.lng }) => {
        center = new google.maps.LatLng(center.lat, center.lng);

        // Create a circle to bias autocomplete results to a certain area
        let circle = new google.maps.Circle({
            center: center,
            radius: 10000,
        });

        // Set bounds and component restrictions for Autocomplete
        autocompleteObj.setBounds(circle.getBounds());
        autocompleteObj.setComponentRestrictions({ country: 'us' });

        return autocompleteObj;
    };

    // Function to handle Autocomplete selection
    const handleAutocompleteSelect = (place, fieldName) => {
        // Extract address components based on the selected field
        let street_address = '';
        let city = '';
        let state = '';
        let zip_code = '';

        switch (fieldName) {
            case 'street_address':
                street_address = place.address_components[0].long_name + ' ' + place.address_components[1].long_name;
                city = place.address_components[2].long_name;
                state = place.address_components[4].long_name;
                zip_code = place.address_components[6].long_name;
                break;

            case 'city':
                city = place.address_components[0].long_name;
                state = place.address_components[3].long_name;
                break;

            case 'state':
                state = place.address_components[0].long_name;
                break;

            case 'zip_code':
                zip_code = place.address_components[0].long_name;
                state = place.address_components[3].long_name;
                break;
        }

        // Update the form fields and userAddress state
        document.getElementById('street_address').value = street_address;
        document.getElementById('city').value = city;
        document.getElementById('state').value = state;
        document.getElementById('zip_code').value = zip_code;
        setUserAddress({ ...userAddress, street_address, city, state, zip_code });
    };

    // Function to handle address validation with Google API
    const handlePlaceValidation = async (inputAddress) => {
        const { street_address, city, state, zip_code } = inputAddress;
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        console.log(street_address, city, state, zip_code)
        try {
            // Send a POST request to Google's address validation API
            const response = await axios.post(
                `https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`,
                {
                    address: {
                        regionCode: 'US',
                        addressLines: [street_address, `${city}, ${state}, ${zip_code}`],
                    },
                    previousResponseId: '', // Need to update this if follow-up request?
                    enableUspsCass: false,
                }
            );

            // Extract relevant information from the API response
            const { verdict, address, geocode } = response.data.result;

            // Handle different cases based on the validation result
            if (!verdict.addressComplete) {
                // Address is incomplete or unconfirmed
                const unconfirmedComponentsArray = address.unconfirmedComponentTypes || [];
                const missingComponentsArray = address.missingComponentTypes || [];
                return { status: 'unconfirmed', data: { unconfirmedComponentsArray, missingComponentsArray } };
            } else {
                // Address is validated successfully
                const latLong = geocode.location;
                const status = verdict.hasInferredComponents ? 'inferred' : 'success';
                return { status: status, data: { address: address.postalAddress, lat: latLong.latitude, lng: latLong.longitude } };
            }
        } catch (error) {
            // Handle errors during address validation
            console.error('Error validating address', error);
            return { status: 'error', data: error };
        }
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationResult = await handlePlaceValidation(userAddress);
        console.log(validationResult)
        // Handle different cases based on the validation result
        if (validationResult.status === 'success' || validationResult.status === 'inferred') {
            // Update coordinates if validation is successful
            updateCoords({ lat: validationResult.data.lat, lng: validationResult.data.lng });
        } else if (validationResult.status === 'unconfirmed') {
            // Alert the user about unconfirmed components
            alert('Please confirm the following components: ' + validationResult.data.unconfirmedComponentsArray.join(', '));
            // You can also add logic to highlight the unconfirmed components in the form
        }
        document.getElementById('addressForm').reset();
    };

    // Function to prevent form submission on Enter key
    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    return (
        <div>
            <h1>View An Area:</h1>
            <form id = "addressForm" onSubmit={(e) => handleSubmit(e)}>

                <Autocomplete
                    ref={autocompleteRefStreet}
                    onLoad={(autocomplete) => {
                        autocompleteRefStreet.current = updateAutocomplete(autocomplete);
                    }}
                    onPlaceChanged={() => {
                        const place = autocompleteRefStreet.current.getPlace();
                        handleAutocompleteSelect(place, 'street_address');
                        // next line mostly just to update map center...
                        // but i think rerendering map updates the autocomplete bounds too?
                        // not sure.
                        autocompleteRefStreet.current = updateAutocomplete(autocompleteRefStreet.current, place.geometry.location);
                    }}
                    types={['address']}
                >
                    <input
                        id="street_address"
                        name="street_address"
                        placeholder="Enter your street address"
                        onChange={handleChange}
                        onKeyDown={handleEnterKey}
                    />
                </Autocomplete>

                <Autocomplete
                    ref={autocompleteRefCity}
                    onLoad={(autocomplete) => {
                        autocompleteRefCity.current = updateAutocomplete(autocomplete);
                    }}
                    onPlaceChanged={() => {
                        const place = autocompleteRefCity.current.getPlace();
                        handleAutocompleteSelect(place, 'city');
                    }}
                    types={['(cities)']}
                >
                    <input
                        id="city"
                        name="city"
                        placeholder="Enter your city"
                        onChange={handleChange}
                        onKeyDown={handleEnterKey}
                    />
                </Autocomplete>

                <Autocomplete
                    ref={autocompleteRefState}
                    onLoad={(autocomplete) => {
                        autocompleteRefState.current = updateAutocomplete(autocomplete);
                    }}
                    onPlaceChanged={() => {
                        const place = autocompleteRefState.current.getPlace();
                        handleAutocompleteSelect(place, 'state');
                    }}
                    types={['administrative_area_level_1']}
                >
                    <input
                        id="state"
                        name="state"
                        placeholder="Enter your state"
                        onChange={handleChange}
                        onKeyDown={handleEnterKey}
                    />
                </Autocomplete>

                <Autocomplete
                    onLoad={(autocomplete) => {
                        autocompleteRefZip.current = updateAutocomplete(autocomplete);
                    }}
                    onPlaceChanged={() => {
                        const place = autocompleteRefZip.current.getPlace();
                        handleAutocompleteSelect(place, 'zip_code');
                    }}
                    types={['postal_code']}
                >
                    <input
                        id="zip_code"
                        name="zip_code"
                        placeholder="Zipcode"
                        onChange={handleChange}
                        onKeyDown={handleEnterKey}
                    />
                </Autocomplete>
                <button type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddressForm;
