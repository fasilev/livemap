

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
