import { csrfFetch } from "./csrf";
export const LOAD_SPOT = "spots/LOAD_SPOT";
export const ADD_SPOT = "spots/ADD_SPOT";
export const UPDATE_SPOT = "spots/UPDATE_SPOT";
export const REMOVE_SPOT = "spots/REMOVE_SPOT";

export const loadSpot = (spots) => ({
    type: LOAD_SPOT,
    spots
});

export const addNewSpot = (spot) => ({
    type: ADD_SPOT,
    spot
});

export const removeSpot = (spotId) => ({
    type: REMOVE_SPOT,
    spotId
});

export const updateSpot = (spotId) => ({
    type: updateSpot,
    spotId
});

export const allSpots = () => async dispatch => {
    const res = await csrfFetch("/api/spots");
    const spots = await res.json();
    console.log("SPOTS",spots)
    dispatch(loadSpot(spots));
}


const spotReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_SPOT:
            const newState = {};
            action.spots.Spots.forEach(ele => newState[ele.id] = ele);
            return { ...state, ...newState }
        default:
            return state
    }
};

export default spotReducer