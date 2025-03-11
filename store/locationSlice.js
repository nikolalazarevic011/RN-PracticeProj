const { createSlice } = require("@reduxjs/toolkit");

const locationSlice = createSlice({
    name: "location",
    initialState: {
        location: null, // Change this to null instead of an object with empty strings
    },
    reducers: {
        setLocation: (state, action) => {
            state.location = {
                latitude: action.payload.coords.latitude,
                longitude: action.payload.coords.longitude,
            };
        },
    },
});

export const { setLocation } = locationSlice.actions;
export default locationSlice.reducer;
