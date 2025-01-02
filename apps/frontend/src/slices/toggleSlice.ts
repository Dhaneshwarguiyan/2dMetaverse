import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    entryCodeDialog:false,
    createSpaceDialog:false
}

const toggleSlice = createSlice({
    name:"toggle",
    initialState:initialState,
    reducers:{
        openEntryCodeDialog:(state)=>{
            state.entryCodeDialog = true;
        },
        closeEntryCodeDialog:(state)=>{
            state.entryCodeDialog = false;
        },
        toggleEntryCodeDialog:(state)=>{
            state.entryCodeDialog = !state.entryCodeDialog;
        },
        openCreateSpaceDialog:(state)=>{
            state.createSpaceDialog = true;
        },
        closeCreateSpaceDialog:(state)=>{
            state.createSpaceDialog = false;
        },
        toggleCreateSpaceDialog:(state)=>{
            state.createSpaceDialog = !state.createSpaceDialog;
        },
    }
})

export const {openEntryCodeDialog,closeEntryCodeDialog,toggleEntryCodeDialog,openCreateSpaceDialog,closeCreateSpaceDialog} = toggleSlice.actions;
export default toggleSlice.reducer;