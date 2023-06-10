import { csrfFetch } from "./csrf";
import { removesSpot } from "./oneUserSpot";
import { uppdateSpot } from "./oneUserSpot";
const LOAD_SPOT = "spots/LOAD_SPOT";
 const ADD_SPOT = "spots/ADD_SPOT";
 const UPDATE_SPOT = "spots/UPDATE_SPOT";
 const REMOVE_SPOT = "spots/REMOVE_SPOT";
 const LOAD_ONE = "spots/LOAD_ONE"
 const loadSpot = (spots) => ({
    type: LOAD_SPOT,
    spots
});

 const loadOne = (spot) =>({
    type: LOAD_ONE,
    spot
})

 const addNewSpot = (spot) => ({
    type: ADD_SPOT,
    spot
});

 const removeSpot = (spotId) => ({
    type: REMOVE_SPOT,
    spotId
});

 const updateSpot = (spott) => ({
    type: UPDATE_SPOT,
    spott
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
    return spot;
   }
};

export const deleSpot = (id)=> async dispatch =>{
    const res = await csrfFetch(`/api/spots/${id}`,{
        method: "DELETE"
    });
    if (res.ok){
        // dispatch(removeSpot(id));
        dispatch(removesSpot(id));
    }
};

export const spotUpdate = (id, spottoUp)=> async dispatch=>{
    const res = await csrfFetch(`api/spots/${id}`,{
        method: 'PUT',
        header: { 'Content-Type': 'application/json'},
        body: JSON.stringify(spottoUp)
    });
    if (res.ok){
        const uSpot = await res.json()
        console.log("the spot to update", uSpot.spot)
         dispatch(updateSpot(uSpot))
        //   dispatch(uppdateSpot(uSpot))
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
                    case REMOVE_SPOT:
                        const nState = {...state};
                        console.log(nState)
                        delete nState[action.spotId];
                        return nState

                        case UPDATE_SPOT:
                  return {...state, [action.spott.spot.id]:action.spott.spot }          
        default:
            return state
    }
};

export default spotReducer