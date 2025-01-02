import { configureStore } from "@reduxjs/toolkit";
import userSlice from '../slices/userslice';
import mapSlice from "../slices/mapSlice";
import toggleSlice from "../slices/toggleSlice";
import renderSlice from "../slices/renderSlice";

export const store = configureStore({
    reducer:{
        user:userSlice,
        map:mapSlice,
        toggleDialog:toggleSlice,
        render:renderSlice
    }
})

export type RootState = ReturnType<typeof store.getState>