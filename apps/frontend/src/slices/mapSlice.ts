import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  room: "",
};

const mapSlice = createSlice({
  name: "map",
  initialState: initialState,
  reducers: {
    initMap: (state, action) => {
      state.room = action.payload;
    },
  },
});

export const { initMap } = mapSlice.actions;
export default mapSlice.reducer;
