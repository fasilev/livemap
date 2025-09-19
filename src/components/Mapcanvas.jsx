


// import React, { useEffect, useState, useRef } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   useMap,
// } from "react-leaflet";
// import { useSelector } from "react-redux";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
// import "leaflet-routing-machine";
// import SearchBar from "./SearchBar"; // Updated SearchBar

// // Fix default Leaflet icon issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// // Custom user location icon
// const userLocationIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//   iconSize: [35, 35],
//   iconAnchor: [17, 34],
// });

// // Smooth recenter
// const RecenterMap = ({ center }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (center) {
//       map.setView(center, 14, { animate: true });
//     }
//   }, [center, map]);
//   return null;
// };

// // Routing
// const RoutingMachine = ({ start, end }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (!start || !end) return;

//     const routingControl = L.Routing.control({
//       waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
//       routeWhileDragging: false,
//       lineOptions: { styles: [{ color: "#1E90FF", weight: 5 }] },
//       show: false,
//       addWaypoints: false,
//       draggableWaypoints: true,
//       fitSelectedRoutes: true,
//       createMarker: () => null,
//     }).addTo(map);

//     return () => map.removeControl(routingControl);
//   }, [map, start, end]);

//   return null;
// };

// const MapCanvas = () => {
//   const markers = useSelector((state) => state.markers);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [destination, setDestination] = useState(null);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [mapTheme, setMapTheme] = useState("light");

//   const mapRef = useRef(null);

//   // Map tile URLs
//   const themes = {
//     light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
//     dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
//     satellite:
//       "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
//   };

//   // Get live location
//   useEffect(() => {
//     if ("geolocation" in navigator) {
//       const watchId = navigator.geolocation.watchPosition(
//         (pos) => {
//           const { latitude, longitude } = pos.coords;
//           setCurrentLocation([latitude, longitude]);
//         },
//         (err) => setErrorMsg(err.message),
//         { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//       );
//       return () => navigator.geolocation.clearWatch(watchId);
//     } else {
//       setErrorMsg("Geolocation is not supported by this browser.");
//     }
//   }, []);

//   const center = currentLocation || [51.505, -0.09];

//   // Map click → set destination
//   const handleMapClick = (e) => {
//     setDestination([e.latlng.lat, e.latlng.lng]);
//   };

//   return (
//     <div className="map-wrapper">
//       {/* Search Bar */}
//       <SearchBar
//         onSelect={(coords) => {
//           if (mapRef.current) {
//             mapRef.current.setView(coords, 15);
//           }
//         }}
//       />

//       {/* Map Theme Toggle */}
//       <div className="theme-toggle">
//         <div
//           className={`toggle-btn ${mapTheme}`}
//           onClick={() =>
//             setMapTheme(
//               mapTheme === "light"
//                 ? "dark"
//                 : mapTheme === "dark"
//                 ? "satellite"
//                 : "light"
//             )
//           }
//         >
//           {mapTheme === "light" ? "☀️" : mapTheme === "dark" ? "🌙" : "🛰️"}
//         </div>
//       </div>

//       <MapContainer
//         center={center}
//         zoom={13}
//         scrollWheelZoom={true}
//         className="map-container"
//         whenCreated={(map) => {
//           mapRef.current = map;
//           map.on("click", handleMapClick);
//         }}
//       >
//         {/* Active Theme Layer */}
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
//           url={themes[mapTheme]}
//         />

//         {/* User's Current Location */}
//         {currentLocation && (
//           <Marker position={currentLocation} icon={userLocationIcon}>
//             <Popup>Your Location</Popup>
//           </Marker>
//         )}

//         {/* Destination Marker */}
//         {destination && (
//           <Marker position={destination}>
//             <Popup>Destination</Popup>
//           </Marker>
//         )}

//         {/* Redux Saved Markers */}
//         {markers.map((marker, idx) => (
//           <Marker key={idx} position={[marker.lat, marker.lng]}>
//             <Popup>{marker.label || "Marker"}</Popup>
//           </Marker>
//         ))}

//         {/* Directions */}
//         {currentLocation && destination && (
//           <RoutingMachine start={currentLocation} end={destination} />
//         )}

//         <RecenterMap center={center} />
//       </MapContainer>

//       {/* Floating Custom Controls */}
//       <div className="custom-controls">
//         <button
//           className="control-btn"
//           onClick={() => mapRef.current.zoomIn()}
//         >
//           ➕
//         </button>
//         <button
//           className="control-btn"
//           onClick={() => mapRef.current.zoomOut()}
//         >
//           ➖
//         </button>
//         <button
//           className="control-btn"
//           onClick={() =>
//             currentLocation && mapRef.current.setView(currentLocation, 15)
//           }
//         >
//           📍
//         </button>
//       </div>

//       {/* Error Message */}
//       {errorMsg && <div className="error-msg">{errorMsg}</div>}
//     </div>
//   );
// };

// export default MapCanvas;


// import React, { useEffect, useState, useRef } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   useMap,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import SearchBar from "./SearchBar";
// import DirectionRoute from "./DirectionRoute"; // ✅ NEW

// // Fix default Leaflet marker issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// const userLocationIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//   iconSize: [35, 35],
//   iconAnchor: [17, 34],
// });

// const RecenterMap = ({ center }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (center) map.setView(center, 15, { animate: true });
//   }, [center, map]);
//   return null;
// };

// const MapCanvas = () => {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [destination, setDestination] = useState(null);
//   const [errorMsg, setErrorMsg] = useState("");
//   const mapRef = useRef(null);

//   const themes = {
//     light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
//     dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
//     satellite:
//       "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
//   };

//   const [mapTheme, setMapTheme] = useState("light");

//   // Get live location
//   useEffect(() => {
//     if ("geolocation" in navigator) {
//       const watchId = navigator.geolocation.watchPosition(
//         (pos) => {
//           setCurrentLocation([pos.coords.latitude, pos.coords.longitude]);
//         },
//         (err) => setErrorMsg(err.message),
//         { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//       );
//       return () => navigator.geolocation.clearWatch(watchId);
//     } else {
//       setErrorMsg("Geolocation is not supported by this browser.");
//     }
//   }, []);

//   const center = currentLocation ? currentLocation : [51.505, -0.09];

//   return (
//     <div className="map-wrapper">
//       {/* Search Bar */}
//       <SearchBar
//         onSelect={(coords) => {
//           setDestination(coords); // Set the destination when searched
//           if (mapRef.current) {
//             mapRef.current.setView(coords, 15);
//           }
//         }}
//       />

//       {/* Theme Toggle */}
//       <div className="theme-toggle">
//         <button onClick={() => setMapTheme("light")}>☀️</button>
//         <button onClick={() => setMapTheme("dark")}>🌙</button>
//         <button onClick={() => setMapTheme("satellite")}>🛰️</button>
//       </div>

//       {/* Map Container */}
//       <MapContainer
//         center={center}
//         zoom={13}
//         scrollWheelZoom={true}
//         className="map-container"
//         whenCreated={(map) => (mapRef.current = map)}
//         style={{ height: "100vh", width: "100%" }}
//       >
//         {/* Theme Layer */}
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
//           url={themes[mapTheme]}
//         />

//         {/* Current Location */}
//         {currentLocation && (
//           <Marker position={currentLocation} icon={userLocationIcon}>
//             <Popup>You are here</Popup>
//           </Marker>
//         )}

//         {/* Destination Marker */}
//         {destination && (
//           <Marker position={destination}>
//             <Popup>Destination</Popup>
//           </Marker>
//         )}

//         {/* Draw Direction Route */}
//         {currentLocation && destination && (
//           <DirectionRoute start={currentLocation} end={destination} />
//         )}

//         <RecenterMap center={center} />
//       </MapContainer>

//       {/* Error Message */}
//       {errorMsg && <div className="error-msg">{errorMsg}</div>}
//     </div>
//   );
// };

// export default MapCanvas;

import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import SearchBar from "./SearchBar";
import DirectionRoute from "./DirectionRoute";

// Fix default Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapCanvas = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null); // ✅ Now will be used
  const [mapTheme, setMapTheme] = useState("light"); // ✅ Now will be used
  const [directions, setDirections] = useState([]);
  const mapRef = useRef(null);

  // Map tile themes
  const themes = {
    light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    satellite:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  };

  // Get user live location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Default center if location not found
  const center = currentLocation ? currentLocation : [51.505, -0.09];

  return (
    <div className="map-wrapper">
      {/* Search Bar */}
      <SearchBar
        onSelect={(coords) => {
          if (mapRef.current) {
            mapRef.current.setView(coords, 15); // Auto zoom to searched location
            setDestination(coords); // ✅ Store as destination
          }
        }}
      />

      {/* Theme toggle buttons */}
      <div className="theme-buttons">
        <button
          className={mapTheme === "light" ? "active" : ""}
          onClick={() => setMapTheme("light")}
        >
          ☀️
        </button>
        <button
          className={mapTheme === "dark" ? "active" : ""}
          onClick={() => setMapTheme("dark")}
        >
          🌙
        </button>
        <button
          className={mapTheme === "satellite" ? "active" : ""}
          onClick={() => setMapTheme("satellite")}
        >
          🛰️
        </button>
      </div>

      {/* Map */}
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="map-container"
        whenCreated={(map) => (mapRef.current = map)}
      >
        {/* Theme Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url={themes[mapTheme]}
        />

        {/* Current location marker */}
        {currentLocation && (
          <Marker position={currentLocation}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Destination marker */}
        {destination && (
          <Marker position={destination}>
            <Popup>Destination</Popup>
          </Marker>
        )}

        {/* Directions */}
        {currentLocation && destination && (
          <DirectionRoute start={currentLocation} end={destination} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapCanvas;
