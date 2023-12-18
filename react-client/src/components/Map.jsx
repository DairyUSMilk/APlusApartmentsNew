import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import AddressForm from "./AddressForm";
import "../../public/Map.css";

const Map = ({apartments: markerList = []}) => {
    const [center, setCenter] = useState({ lat: 40.745067, lng: -70.024408}); //default near hoboken
    // const [markers, setMarkers] = useState(markerList); //will use to store markers for each apartment
    const [userAddress, setUserAddress] = useState({
        name: '',
        street_address: '',
        city: '',
        state: '',
        zip_code: '',
    }); //store user input address/city to center map on (NOT GEOLOCATION (lat/long))

    useEffect(() => {
        const success = (position) => {
            setCenter({ lat: position.coords.latitude, lng: position.coords.longitude});
        }
        const error = () => {
            console.log("Unable to retrieve your location");
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error, {enableHighAccuracy: true});
        } 
        else {
            console.log("Geolocation not supported");
        }
    }, []);


    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: import.meta.env.VITE_LIBRARIES.split(" ")
    });
    
    if (loadError) {
        console.log(loadError)
        return <div>Error loading map</div>;
    }
    
    if (!isLoaded) {
        return <div>Loading map</div>;
    }

    const updateCoords = ({lat, lng}) => { //change map center to user input address
        setCenter({lat, lng});
    }
    

    return (
        <div className="Map">
            {!isLoaded ? (
                <h1>Loading Map...</h1>
            ) : (
                <>
                    <AddressForm updateCoords={updateCoords} mapCenter = {center} />
                    <GoogleMap
                        mapContainerClassName="map-container"
                        center={center}
                        zoom={15}
                    />
                </>
            )}
        </div>
    );
};

export default Map;