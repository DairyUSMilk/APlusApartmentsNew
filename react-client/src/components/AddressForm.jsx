import React, { useState, useRef, useEffect } from 'react';
import { Autocomplete } from '@react-google-maps/api';

const AddressForm = ({ updateCoords, mapCenter }) => {
    const [userAddress, setUserAddress] = useState({
        street_address: '',
        city: '',
        state: '',
        zip_code: '',
    });
    // maybe store bounds in state too?

    const autocompleteRefStreet = useRef(null);
    const autocompleteRefCity = useRef(null);
    const autocompleteRefState = useRef(null);
    const autocompleteRefZip = useRef(null);

    useEffect(() => {
        console.log("userAddress: ", userAddress);
    }, [userAddress]);

    const handleChange = (e) => {
        setUserAddress({ ...userAddress, [e.target.name]: e.target.value });
    };

    const updateAutocomplete = (autocompleteObj, center = {lat: mapCenter.lat, lng: mapCenter.lng}) => {
        center = new google.maps.LatLng(center.lat, center.lng);
        
        // lil circle to bias autocomplete results to a certain area
        let circle = new google.maps.Circle({
            center: center,
            radius: 10000
        });
        autocompleteObj.setBounds(circle.getBounds());
        autocompleteObj.setComponentRestrictions({country: "us"});
        return autocompleteObj;
    }
    
    const handleAutocompleteSelect = (place, fieldName) => {
        // console.log(place.address_components);
        // console.log(place.geometry.location.lat(), place.geometry.location.lng());
        let street_address = '';
        let city = '';
        let state = '';
        let zip_code = '';

        // based on which field was selected, update the other fields
        switch(fieldName) {
            case 'street_address':
                street_address = place.address_components[0].long_name + " " + place.address_components[1].long_name;
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

        // update the form fields to reflect the autocomplete selection
        document.getElementById("street_address").value = street_address;
        document.getElementById("city").value = city;
        document.getElementById("state").value = state;
        document.getElementById("zip_code").value = zip_code
        setUserAddress({ ...userAddress, street_address, city, state, zip_code });
        // updateCoords({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //complete
        
    }

    // prevent form submission on enter key... sometimes bugs for zip? idk why
    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    return (
        <div>
            <h1>View An Area:</h1>
            <form onSubmit={(e) => handleSubmit(e)}>

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
