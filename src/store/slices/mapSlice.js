import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  center: { lat: 10.7867, lng: 76.6548 }, // Default location
  zoom: 10,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setCenter: (state, action) => {
      state.center = action.payload;
    },
    setZoom: (state, action) => {
      state.zoom = action.payload;
    },
  },
});

export const { setCenter, setZoom } = mapSlice.actions;
export default mapSlice.reducer;

