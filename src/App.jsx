// import React from "react";
// import MapCanvas from "./components/Mapcanvas";
// import Sidebar from "./components/Sidebar";
// import useGoogleMaps from "./hooks/useGoogleMaps";

// const App = () => {
//   const apiKey = import.meta.env.MY_GOOGLE_MAPS;

//   // Load Google Maps script
//   useGoogleMaps(apiKey);

//   return (
//     <div className="app-container">
//       <Sidebar />
//       <MapCanvas />
//     </div>
//   );
// };

// export default App;

import React from "react";
import MapCanvas from "./components/Mapcanvas";
import Sidebar from "./components/Sidebar";

const App = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <MapCanvas />
    </div>
  );
};

export default App;
