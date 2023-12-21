import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import AddressForm from "./AddressForm";
import "../../public/Map.css";

const libraries = ["places"];

const Map = ({apartments: markerList = []}) => {
    const [center, setCenter] = useState({ lat: 40.745067, lng: -70.024408}); //default near hoboken
    const [markers, setMarkers] = useState(markerList); //will use to store markers for each apartment

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
        libraries: libraries
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
        //add a marker at the new center
        setMarkers([...markers, {lat, lng}]);
    }

    return (
        <div className="Map">
            {!isLoaded ? (
                <h1>Loading Map...</h1>
            ) : (
                <>
                    <AddressForm returnCoords={updateCoords} mapCenter = {center} />
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