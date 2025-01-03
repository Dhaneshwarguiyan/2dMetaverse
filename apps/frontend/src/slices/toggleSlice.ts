import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  entryCodeDialog: false,
  createSpaceDialog: false,
  optionsDialog: false,
};

const toggleSlice = createSlice({
  name: "toggle",
  initialState: initialState,
  reducers: {
    openEntryCodeDialog: (state) => {
      state.entryCodeDialog = true;
    },
    closeEntryCodeDialog: (state) => {
      state.entryCodeDialog = false;
    },
    openCreateSpaceDialog: (state) => {
      state.createSpaceDialog = true;
    },
    closeCreateSpaceDialog: (state) => {
      state.createSpaceDialog = false;
    },
    toggleOptionsDialog: (state) => {
      state.optionsDialog = !state.optionsDialog;
    },
    closeOptionsDialog: (state) => {
      state.optionsDialog = false;
    },
  },
});

export const {
  openEntryCodeDialog,
  closeEntryCodeDialog,
  openCreateSpaceDialog,
  closeCreateSpaceDialog,
} = toggleSlice.actions;
export default toggleSlice.reducer;
