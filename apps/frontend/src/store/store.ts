import { configureStore } from "@reduxjs/toolkit";
import userSlice from '../slices/userslice';
import mapSlice from "../slices/mapSlice";

export const store = configureStore({
    reducer:{
        user:userSlice,
        map:mapSlice
    }
})

export type RootState = ReturnType<typeof store.getState>