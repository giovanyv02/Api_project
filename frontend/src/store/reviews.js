import {csrfFetch} from "./csrf";

const ONE_REVIEW = "review/ONE_REVIEW";
const ADD_REV = "review/ADD_REV";
const DEL = "review/Del"

const one = (reviews) =>({
    type: ONE_REVIEW,
    reviews
});

const loadRev = (rev, user)=>({
    type: ADD_REV,
    rev,
    user
});

const del = (id)=>({
    type: DEL,
    id
})

export const thunkOneReview = (id) => async dispatch=>{
    const res = await csrfFetch(`/api/spots/${id}/reviews`);
    if(res.ok){
        const reviews = await res.json();
        dispatch(one(reviews))
    }
};

export const addRev = (spoId,rev, user)=> async dispatch=>{
   const res = await csrfFetch(`/api/spots/${spoId}/reviews`,{
        method: "post",
        header: { 'Content-Type': 'application/json'},
        body: JSON.stringify(rev)
    });
    if(res.ok){
        const newR = await res.json();
        dispatch(loadRev(newR, user))
    }
}

export const delRev = (id)=> async dispatch=>{
   const res = await csrfFetch(`/api/reviews/${id}`,{
        method: "Delete"
    })
    if(res.ok){
        dispatch(del(id));
    }
}

const ReviewReducer = (state = {},action)=>{
    switch(action.type){
        case ONE_REVIEW:
            const newState = {};
            action.reviews.Reviews.forEach(ele=> newState[ele.id]= ele);
            return {...state, ...newState}
            case ADD_REV:
                const ns = {};
                ns[action.rev.id] = action.rev;
                ns[action.rev.id].User = action.user;
                return {...state, ...ns}
                case DEL:
        const d = {...state};
        delete d[action.id];
        return d
            default:
                return state
    }
};

export default ReviewReducer