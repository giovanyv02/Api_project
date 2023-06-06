import { csrfFetch } from "./csrf";
export const LOAD_SPOT = "spots/LOAD_SPOT";
export const ADD_SPOT = "spots/ADD_SPOT";
export const UPDATE_SPOT = "spots/UPDATE_SPOT";
export const REMOVE_SPOT = "spots/REMOVE_SPOT";
export const LOAD_ONE = "spots/LOAD_ONE"
export const loadSpot = (spots) => ({
    type: LOAD_SPOT,
    spots
});

export const loadOne = (spot) =>({
    type: LOAD_ONE,
    spot
})

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
   
    dispatch(loadSpot(spots));
};

export const addSpot = (newSpot)=> async dispatch =>{
   const res = await  csrfFetch("/api/spots",{
    method: "POST",
    header: { 'Content-Type': 'application/json'},
    body: JSON.stringify(newSpot)
   });
   if(res.ok){
    const spot = await res.json();
    dispatch(addNewSpot(spot));
    return spot.json;
   }
}


const spotReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_SPOT:
            const newState = {};
            action.spots.Spots.forEach(ele => newState[ele.id] = ele);
            return { ...state, ...newState }
            case LOAD_ONE:
                return {...action.spot}
                case ADD_SPOT:
                    const np = {};
                    np[action.spot.id] = action.spot;
                    return {...state, ...np}
        default:
            return state
    }
};

export default spotReducer