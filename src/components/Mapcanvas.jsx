// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import { useSelector } from "react-redux";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Fix default Leaflet icon issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// // Custom icon for current location
// const userLocationIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//   iconSize: [35, 35],
//   iconAnchor: [17, 34],
//   popupAnchor: [0, -30],
// });

// // Component to recenter map dynamically
// const RecenterMap = ({ center }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (center) {
//       map.setView(center, 14, { animate: true });
//     }
//   }, [center, map]);
//   return null;
// };

// const MapCanvas = () => {
//   const markers = useSelector((state) => state.markers);

//   // For current location
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState("");

//   // Fetch user's location using Geolocation API
//   useEffect(() => {
//     if ("geolocation" in navigator) {
//       const watchId = navigator.geolocation.watchPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setCurrentLocation([latitude, longitude]);
//         },
//         (error) => {
//           setErrorMsg(error.message);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 10000,
//           maximumAge: 0,
//         }
//       );

//       // Cleanup
//       return () => navigator.geolocation.clearWatch(watchId);
//     } else {
//       setErrorMsg("Geolocation is not supported by your browser.");
//     }
//   }, []);

//   // Default center
//   const center = currentLocation
//     ? currentLocation
//     : markers.length
//     ? [markers[markers.length - 1].lat, markers[markers.length - 1].lng]
//     : [51.505, -0.09]; // fallback center

//   return (
//     <div style={{ height: "100vh", width: "100%" }}>
//       <MapContainer
//         center={center}
//         zoom={13}
//         scrollWheelZoom={true}
//         style={{ height: "100%", width: "100%" }}
//       >
//         {/* OpenStreetMap Tiles */}
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {/* Show current location */}
//         {currentLocation && (
//           <Marker position={currentLocation} icon={userLocationIcon}>
//             <Popup>You are here</Popup>
//           </Marker>
//         )}

//         {/* Show all markers from Redux */}
//         {markers.map((marker, idx) => (
//           <Marker key={idx} position={[marker.lat, marker.lng]}>
//             <Popup>{marker.label || "Unnamed Marker"}</Popup>
//           </Marker>
//         ))}

//         <RecenterMap center={center} />
//       </MapContainer>

//       {/* If error in location fetching */}
//       {errorMsg && (
//         <div
//           style={{
//             position: "absolute",
//             top: 10,
//             right: 10,
//             background: "rgba(255,0,0,0.7)",
//             color: "#fff",
//             padding: "8px 12px",
//             borderRadius: "6px",
//             fontSize: "14px",
//           }}
//         >
//           {errorMsg}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MapCanvas;


import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import { useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";

// Fix default Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

// Custom icon for current location
const userLocationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30]
});

// Recenter map smoothly
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 14, { animate: true });
    }
  }, [center, map]);
  return null;
};

// Routing control component
const RoutingMachine = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: "#1E90FF", weight: 5 }]
      },
      show: false,
      addWaypoints: false,
      draggableWaypoints: true,
      fitSelectedRoutes: true,
      createMarker: () => null // disable default markers
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, start, end]);

  return null;
};

const MapCanvas = () => {
  const markers = useSelector((state) => state.markers);

  // Current location
  const [currentLocation, setCurrentLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Directions state
  const [destination, setDestination] = useState(null);

  // Fetch user's location
  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
        },
        (error) => {
          setErrorMsg(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setErrorMsg("Geolocation is not supported by your browser.");
    }
  }, []);

  // Default map center
  const center = currentLocation
    ? currentLocation
    : markers.length
    ? [markers[markers.length - 1].lat, markers[markers.length - 1].lng]
    : [51.505, -0.09];

  // When clicking on map, set destination
  const handleMapClick = (e) => {
    setDestination([e.latlng.lat, e.latlng.lng]);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(map) => {
          map.on("click", handleMapClick);
        }}
      >
        {/* Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Show current location */}
        {currentLocation && (
          <Marker position={currentLocation} icon={userLocationIcon}>
            <Popup>Your current location</Popup>
          </Marker>
        )}

        {/* Show destination marker */}
        {destination && (
          <Marker position={destination}>
            <Popup>Destination</Popup>
          </Marker>
        )}

        {/* Other markers from Redux */}
        {markers.map((marker, idx) => (
          <Marker key={idx} position={[marker.lat, marker.lng]}>
            <Popup>{marker.label || "Unnamed Marker"}</Popup>
          </Marker>
        ))}

        {/* Draw route when both start and end are set */}
        {currentLocation && destination && (
          <RoutingMachine start={currentLocation} end={destination} />
        )}

        <RecenterMap center={center} />
      </MapContainer>

      {/* Error Message */}
      {errorMsg && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(255,0,0,0.7)",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "14px"
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* Instructions */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          padding: "8px 15px",
          borderRadius: "8px",
          fontSize: "14px"
        }}
      >
        Tap on the map to set your destination 🚩
      </div>
    </div>
  );
};

export default MapCanvas;
