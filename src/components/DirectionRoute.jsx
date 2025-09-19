// // src/components/DirectionRoute.jsx
// import { useEffect } from "react";
// import { useMap } from "react-leaflet";
// import L from "leaflet";
// import "leaflet-routing-machine";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// const DirectionRoute = ({ start, end }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (!start || !end) return;

//     // Create routing control
//     const routingControl = L.Routing.control({
//       waypoints: [
//         L.latLng(start[0], start[1]),
//         L.latLng(end[0], end[1]),
//       ],
//       router: new L.Routing.OSRMv1({
//         serviceUrl: "https://router.project-osrm.org/route/v1", // Free OSM Routing Server
//       }),
//       lineOptions: {
//         styles: [{ color: "#1E90FF", weight: 5 }],
//       },
//       routeWhileDragging: false,
//       addWaypoints: false,
//       draggableWaypoints: false,
//       fitSelectedRoutes: true,
//       show: false,
//       createMarker: (i, waypoint) => {
//         return L.marker(waypoint.latLng, {
//           icon: L.icon({
//             iconUrl:
//               i === 0
//                 ? "https://cdn-icons-png.flaticon.com/512/684/684908.png" // Start marker
//                 : "https://cdn-icons-png.flaticon.com/512/149/149059.png", // End marker
//             iconSize: [35, 35],
//             iconAnchor: [17, 34],
//           }),
//         });
//       },
//     }).addTo(map);

//     return () => {
//       map.removeControl(routingControl); // Cleanup when component unmounts
//     };
//   }, [map, start, end]);

//   return null;
// };

// export default DirectionRoute;

import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const DirectionRoute = ({ map, start, end, onStepsUpdate }) => {
  useEffect(() => {
    if (!map || !start || !end) return;

    // Create routing control
    const routeControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1]),
      ],
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: (i, waypoint) => {
        return L.marker(waypoint.latLng, {
          icon: L.icon({
            iconUrl:
              i === 0
                ? "https://cdn-icons-png.flaticon.com/512/684/684908.png" // Start icon
                : "https://cdn-icons-png.flaticon.com/512/149/149059.png", // End icon
            iconSize: [35, 35],
            iconAnchor: [17, 34],
          }),
        });
      },
    }).addTo(map);

    // Fetch step-by-step instructions
    routeControl.on("routesfound", function (e) {
      const route = e.routes[0];

      const formattedSteps = route.instructions.map((step, index) => ({
        id: index,
        text: step.text,
        distance: step.distance,
        type: step.type,
      }));

      // Send steps to parent component
      onStepsUpdate(formattedSteps);
    });

    // Cleanup on unmount
    return () => {
      if (routeControl) {
        map.removeControl(routeControl);
      }
    };
  }, [map, start, end, onStepsUpdate]); // ✅ Added missing dependencies

  return null;
};

export default DirectionRoute;
