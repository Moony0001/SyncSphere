import storeCoordinates from '../../hooks/storeCoordinates';
import useGeolocation from '../../hooks/useGeoLocation';
import { useEffect, useRef } from 'react'
import L from "leaflet";
import marker from "../../img/marker.png"


export default function Map({isRecording}) {

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

        latlngs.current.push([location.latitude, location.longitude]);
        polylineRef.current.setLatLngs(latlngs.current);
    }, [location, coordinates.latitude, coordinates.longitude]);

    useEffect(() => {
        if (!isRecording) return;
    
        // Start drawing the line when isRecording is true
        if (location.latitude !== 0 && location.longitude !== 0) {
          latlngs.current.push([location.latitude, location.longitude]);
          polylineRef.current.setLatLngs(latlngs.current);
        }
      }, [isRecording, location.latitude, location.longitude]);

      useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
       }, []);

    return (
        <div id="map"></div>
    )
}