import { createSlice } from "@reduxjs/toolkit";

const markersSlice = createSlice({
  name: "markers",
  initialState: [],
  reducers: {
    addMarker: (state, action) => {
      state.push(action.payload);
    },
    clearMarkers: () => {
      return [];
    },
  },
});

export const { addMarker, clearMarkers } = markersSlice.actions;
export default markersSlice.reducer;
   