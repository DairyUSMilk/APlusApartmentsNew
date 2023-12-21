import React, { useState, useRef, useEffect } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import axios from 'axios';

const AddressForm = ({ updateCoords, mapCenter }) => {
    // State to manage user input
    const [userAddress, setUserAddress] = useState({
        street_address: '',
        city: '',
        state: '',
        postcode: '',
        subpremise: '',
    });

    // useEffect(() => {
    //     console.log(userAddress)
    // }, [userAddress]) //debugging

    // Refs for Autocomplete components
    const autocompleteRefStreet = useRef(null);
    const autocompleteRefCity = useRef(null);
    const autocompleteRefState = useRef(null);
    const autocompleteRefZip = useRef(null);

    // Function to handle user input change
    const handleChange = (e) => {
        setUserAddress({ ...userAddress, [e.target.name]: e.target.value });
    };

    const updateAutocomplete = (autocomplete, center = { lat: mapCenter.lat, lng: mapCenter.lng }) => {
        center = new google.maps.LatLng(center.lat, center.lng);

        // Create a circle to bias autocomplete results to a certain area
        let circle = new google.maps.Circle({
            center: center,
            radius: 10000,
        });
        autocomplete.setBounds(circle.getBounds());
        autocomplete.setComponentRestrictions({ country: 'us' });
        return autocomplete;
    }

    // Function to update Autocomplete options based on map center
    const updateAutocompletes = (center = { lat: mapCenter.lat, lng: mapCenter.lng }) => { // Default val may be unecessary
        // Set bounds and component restrictions for Autocomplete
        autocompleteRefStreet.current = updateAutocomplete(autocompleteRefStreet.current, center);
        autocompleteRefCity.current = updateAutocomplete(autocompleteRefCity.current, center);
        autocompleteRefState.current = updateAutocomplete(autocompleteRefState.current, center);
        autocompleteRefZip.current = updateAutocomplete(autocompleteRefZip.current, center);
    };

    // Function to handle Autocomplete selection
    const handleAutocompleteSelect = (place) => {
        // Extract address components based on the selected field
        let street_address = '';
        let city = '';
        let state = '';
        let postcode = '';
        for (const component of place.address_components) {

            const componentType = component.types[0];
        
            switch (componentType) {
              case "street_number": {
                street_address = `${component.long_name} ${street_address}`;
                break;
              }
        
              case "route": {
                street_address += component.short_name;
                break;
              }
        
              case "postal_code": {
                postcode = `${component.long_name}${postcode}`;
                break;
              }
        
              case "postal_code_suffix": {
                postcode = `${postcode}-${component.long_name}`;
                break;
              }
              case "locality":
                city = component.long_name;
                document.getElementById("city").value = component.long_name;
                break;
              case "administrative_area_level_1": {
                state = component.short_name;
                document.getElementById("state").value = component.short_name;
                break;
              }
            }
          }

        // Update the form fields and userAddress state
        document.getElementById('street_address').value = street_address;
        document.getElementById('postcode').value = postcode;
        setUserAddress({ ...userAddress, street_address, city, state, postcode});
    };

    // Function to handle address validation with Google API
    const handlePlaceValidation = async (inputAddress) => {
        const { street_address, city, state, postcode, subpremise } = inputAddress;
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        
        try {
            // Send a POST request to Google's address validation API
            const response = await axios.post(
                `https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`,
                {
                    address: {
                        regionCode: 'US',
                        addressLines: [street_address, `${subpremise} ${city}, ${state}, ${postcode}`],
                    },
                    previousResponseId: '', // Need to update this if follow-up request?
                    enableUspsCass: false,
                }
            );

            // Extract relevant information from the API response
            const { verdict, address, geocode } = response.data.result;
            console.log(response.data.result)
            // Handle different cases based on the validation result
            if (!verdict.addressComplete) {
                if(address.missingComponentTypes.length === 1 && address.missingComponentTypes[0] !== 'subpremise'){
                    // Tell user to enter apartment number
                    alert('Please enter an apartment number');
                }
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
        console.log(userAddress)
        const validationResult = await handlePlaceValidation(userAddress);
        console.log(validationResult)
        // Handle different cases based on the validation result
        if (validationResult.status === 'success' || validationResult.status === 'inferred') {
            // Update coordinates if validation is successful
            updateAutocompletes({ lat: validationResult.data.lat, lng: validationResult.data.lng });
            updateCoords({ lat: validationResult.data.lat, lng: validationResult.data.lng });
            document.getElementById('addressForm').reset();
        } else if (validationResult.status === 'unconfirmed') {
            // Alert the user about unconfirmed components
            let alertMessage = ''
            if (validationResult.data.unconfirmedComponentsArray.length > 0){
                alertMessage += 'Please confirm the following components: ';
                for (const component of validationResult.data.unconfirmedComponentsArray) {
                    alertMessage += `${component}, `;
                }
            }
            if (validationResult.data.missingComponentsArray.length > 0){
                alertMessage += '\nPlease enter the following components: ';
                for (const component of validationResult.data.missingComponentsArray) {
                    alertMessage += `${component}, `;
                }
            }
            alert(alertMessage);
            // Need to add logic to highlight the unconfirmed components in the form
        }
        else{
            alert('Please enter a valid address');
        }
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
                        handleAutocompleteSelect(place);
                        // next line mostly just to update map center...
                        // but i think rerendering map updates the autocomplete bounds too?
                        // not sure.
                    }}
                    types={['address']}
                >
                    <input
                        id="street_address"
                        name="street_address"
                        placeholder="Enter your street address"
                        onChange={handleChange}
                        onKeyDown={handleEnterKey}
                        style={{ width: '50%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </Autocomplete>

                <input
                    id="subpremise"
                    name="subpremise"
                    placeholder="Apartment Number / Unit Number (optional)"
                    onChange={handleChange}
                    onKeyDown={handleEnterKey}
                    style={{ width: '50%', padding: '8px', boxSizing: 'border-box' }}
                />

                <Autocomplete
                    ref={autocompleteRefCity}
                    onLoad={(autocomplete) => {
                        autocompleteRefCity.current = updateAutocomplete(autocomplete);
                    }}
                    onPlaceChanged={() => {
                        const place = autocompleteRefCity.current.getPlace();
                        handleAutocompleteSelect(place);
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
                        handleAutocompleteSelect(place);
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
                    ref={autocompleteRefZip}
                    onLoad={(autocomplete) => {
                        autocompleteRefZip.current = updateAutocomplete(autocomplete);
                    }}
                    onPlaceChanged={() => {
                        const place = autocompleteRefZip.current.getPlace();
                        handleAutocompleteSelect(place);
                    }}
                    types={['postal_code']}
                >
                    <input
                        id="postcode"
                        name="postcode"
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
