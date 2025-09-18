import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "./slices/mapSlice";
import markersReducer from "./slices/markersSlice";

const store = configureStore({
  reducer: {
    map: mapReducer,
    markers: markersReducer,
  },
});

export default store;
