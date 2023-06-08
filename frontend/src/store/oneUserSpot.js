import { csrfFetch } from "./csrf";

const SPOT_USER = "spots/SPOT_USER";

const Aspots = (houses)=>({
    type: SPOT_USER,
    houses
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
           default:
            return state
    }
};

export default userSpotReducer