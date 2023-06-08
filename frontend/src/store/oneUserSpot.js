import { csrfFetch } from "./csrf";
const REMOVE_SPOT = "spots/REMOVE_SPOT";
const UPDATE_SPOT = "spots/UPDATE_SPOT";


const SPOT_USER = "spots/SPOT_USER";

const Aspots = (houses)=>({
    type: SPOT_USER,
    houses
});

export const removesSpot = (spotId) => ({
    type: REMOVE_SPOT,
    spotId
});

export const uppdateSpot = (spott) => ({
    type: UPDATE_SPOT,
    spott
});

export const loadSpot = ()=>async dispatch=>{
    const res = await csrfFetch('/api/spots/current');
    const spots = await res.json();
   
    dispatch(Aspots(spots));
};

const userSpotReducer = (state ={}, action)=>{
    switch(action.type){
        case SPOT_USER:
           const newState = {};
           action.houses.Spots.forEach(ele=> newState[ele.id]=ele);
           return {...state, ...newState}
           case REMOVE_SPOT:
            const n = {...state};
            delete n[action.spotId];
            return n
            case UPDATE_SPOT:
                return {...state, [action.spott.id]:action.spott }          

           default:
            return state
    }
};

export default userSpotReducer