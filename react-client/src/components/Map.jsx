import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo, useState, useEffect } from "react";
import "../../public/Map.css";

const Map = () => {
    const [center, setCenter] = useState({ lat: 40.745067, lng: -70.024408}); //default near hoboken
    // const [markers, setMarkers] = useState([]); //will use to store markers for each apartment
    const [userAddress, setUserAddress] = useState({
        name: '',
        street_address: '',
        city: '',
        state: '',
        zip_code: '',
        googleMapLink: ''
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
    });
    
    if (loadError) {
        console.log(loadError)
        return <div>Error loading map</div>;
    }
    
    if (!isLoaded) {
        return <div>Loading map</div>;
    }
    

    return (
        <div className="Map">
            {!isLoaded ? (
                <h1>Loading...</h1>
            ) : (
                <>
                {/* <div>
                    <h1>Add New Parlor</h1>
                    <form onSubmit={this.handleSubmit}>
                    <input id="autocomplete"
                        className="input-field"
                        ref="input"
                        type="text"/>
                        <input 
                        name={"name"}
                        value={this.state.name}
                        placeholder={"Name"}
                        onChange={this.handleChange}
                        />
                        <input 
                        name={"street_address"}
                        value={this.state.street_address}
                        placeholder={"Street Address"}
                        onChange={this.handleChange}
                        />
                        <input 
                        name={"city"}
                        value={this.state.city}
                        placeholder={"City"}
                        onChange={this.handleChange}
                        />
                        <input
                        name={"state"}
                        value={this.state.state}
                        placeholder={"State"}
                        onChange={this.handleChange}
                        />
                        <input 
                        name={"zip_code"}
                        value={this.state.zip_code}
                        placeholder={"Zipcode"}
                        onChange={this.handleChange}
                        />
                        <button onSubmit={this.handleSubmit}>Submit</button>
                    </form>
                </div> */}
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