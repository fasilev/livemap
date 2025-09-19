
// import React from "react";
// import { useDispatch } from "react-redux";
// import { addMarker, clearMarkers } from "../store/slices/markersSlice";
// import SearchBar from "./SearchBar";

// const Sidebar = () => {
//   const dispatch = useDispatch();

//   const addRandomMarker = () => {
//     const lat = 51.5 + Math.random() * 0.1;
//     const lng = -0.09 + Math.random() * 0.1;
//     dispatch(addMarker({ lat, lng, label: "Random Marker" }));
//   };

//   return (
//     <div className="sidebar">
//       <h2>Search</h2>
//       <SearchBar />
//       <h2 style={{ marginTop: 18 }}>Actions</h2>
//       <button onClick={addRandomMarker}>Add Random Marker</button>
//       <button
//         onClick={() => dispatch(clearMarkers())}
//         style={{ marginLeft: 8 }}
//       >
//         Clear Markers
//       </button>
//     </div>
//   );
// };

// export default Sidebar;

import React from "react";
import { useDispatch } from "react-redux";
import { addMarker, clearMarkers } from "../store/slices/markersSlice";

const Sidebar = () => {
  const dispatch = useDispatch();

  const addRandomMarker = () => {
    const lat = 51.5 + Math.random() * 0.1;
    const lng = -0.09 + Math.random() * 0.1;
    dispatch(addMarker({ lat, lng, label: "Random Marker" }));
  };

  return (
    <div className="sidebar">
      <button onClick={addRandomMarker}>Add Random Marker</button>
      <button
        style={{ background: "#ff4d4d" }}
        onClick={() => dispatch(clearMarkers())}
      >
        Clear All Markers
      </button>
    </div>
  );
};

export default Sidebar;

