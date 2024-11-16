import storeCoordinates from '../../hooks/storeCoordinates';
import useGeolocation from '../../hooks/useGeoLocation';
import { useEffect, useRef } from 'react'
import L from "leaflet";
import marker from "../../img/marker.png"

function haversineDistance(lat1, lon1, lat2, lon2) {
    console.log("Calculating distance between:", lat1, lon1, "and", lat2, lon2);
    const R = 6371; // Radius of Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}


export default function Map({isRecording, distance, setDistance}) {

    const mapRef = useRef(null);
    var myIcon = L.icon({
        iconUrl: marker,
        iconSize: [12, 12],
    });
    const userMarkerRef = useRef();
    const polylineRef = useRef();
    const latlngs = useRef([]);
    

    const { value: coordinates, setValue: setCoordinates } = storeCoordinates('authUser.id', {
        latitude: 0,
        longitude: 0,
    });

    const { position: location, error, loading } = useGeolocation();

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([coordinates.latitude, coordinates.longitude], 13);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '© SyncSphere'
            }).addTo(mapRef.current);

            polylineRef.current = L.polyline([], {color: 'red'}).addTo(mapRef.current);

        }
    }, [coordinates.latitude, coordinates.longitude]);

    useEffect(() => {
        setCoordinates({...coordinates})
        if (loading) return;        // Don't do anything if loading

        if (error) {
            console.error("Error retrieving geolocation:", error);
            return; 
        }

        if (location.latitude !== 0 && location.longitude !== 0) {    
            if(userMarkerRef.current){
                mapRef.current.removeLayer(userMarkerRef.current);
            }

            userMarkerRef.current = L.marker([location.latitude, location.longitude], {icon: myIcon}).addTo(mapRef.current);
            mapRef.current.setView([location.latitude, location.longitude], 19);}

            if (isRecording){
                latlngs.current.push([location.latitude, location.longitude]);
                polylineRef.current.setLatLngs(latlngs.current);
            }
        
    }, [location, coordinates.latitude, coordinates.longitude, isRecording]);

    useEffect(() => {
        if (!isRecording || !location || location.latitude === 0 || location.longitude === 0) return;
    
        const newPoint = [location.latitude, location.longitude];
        console.log("New Location: ", newPoint);
    
        if (latlngs.current.length > 0) {
            const [prevLat, prevLon] = latlngs.current[latlngs.current.length - 1];
            console.log("Previous Point (last in latlngs):", [prevLat, prevLon]);
            const distanceToAdd = haversineDistance(prevLat, prevLon, newPoint[0], newPoint[1]);
            console.log("Adding Distance: ", distanceToAdd);
            setDistance((prevDistance) => {
                console.log("Previous Distance: ", prevDistance);
                const updatedDistance = prevDistance + distanceToAdd;
                console.log("Updated Distance: ", updatedDistance);
                return updatedDistance; // Ensure the state gets updated properly
            });
        }
    
        latlngs.current.push(newPoint);
        polylineRef.current.setLatLngs(latlngs.current);
    }, [location, isRecording]);
    

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
            setDistance(0); // Reset distance
            latlngs.current = [];
        };
    }, []);

    return (
        <div id="map"></div>
    )
}