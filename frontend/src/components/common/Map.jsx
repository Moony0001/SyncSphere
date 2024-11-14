// import StoreCoordinates from './hooks/storeCoordinates';
// import useGeolocation from './hooks/useGeoLocation';
import { useEffect, useRef } from 'react'
import L from "leaflet";


export default function Map() {

    const mapRef = useRef(null);
    // var myIcon = L.icon({
    //     iconUrl: './img/marker.png',
    //     iconSize: [12, 12],
    // });
    // const userMarkerRef = useRef();
    // const polylineRef = useRef();
    // const latlngs = useRef([]);

    // const [userPosition, setUserPosition] = StoreCoordinates('authUser.id', {
    //     latitude: 0,
    //     longitude: 0,
    // });

    // const location = useGeolocation();

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([57.10, 25.12], 13);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '© SyncSphere'
            }).addTo(mapRef.current);
        }

        // polylineRef.current = L.polyline([], {color: 'red'}).addTo(mapRef.current);
    }, []);

    // useEffect(() => {
    //     setUserPosition({...userPosition})

    //     if(userMarkerRef.current){
    //     mapRef.current.removeLayer(userMarkerRef.current);
    //     }

    //     userMarkerRef.current = L.marker([location.latitude, location.longitude], {icon: myIcon}).addTo(mapRef.current);
    //     mapRef.current.setView([location.latitude, location.longitude], 13);

    //     latlngs.current.push([location.latitude, location.longitude]);
    //     polylineRef.current.setLatLngs(latlngs.current);
    // }, [location, userPosition.latitude, userPosition.longitude]);


    return (
        <div id="map"></div>
    )
}