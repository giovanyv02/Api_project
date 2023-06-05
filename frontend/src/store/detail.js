
import { csrfFetch } from "./csrf";
const GET_DETAIL = "spot/GET_DETAIL"

const getOne = (spot)=>({
    type: GET_DETAIL,
    spot
});

export const getOneThunk=(id)=> async dispatch=>{
    const res = await csrfFetch(`/api/spots/${id}`);
    if(res.ok){
       const spot = await res.json();
       dispatch(getOne(spot))
    }
}

const detailReducer = (state = {}, action)=>{
    switch(action.type){
        case GET_DETAIL:
            const newState = {...state, ...action.spot};
            
            return newState
        default:
            return state;
    }
};

export default detailReducer;