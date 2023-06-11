import {csrfFetch} from "./csrf";

const ONE_REVIEW = "review/ONE_REVIEW";

const one = (reviews) =>({
    type: ONE_REVIEW,
    reviews
});

export const thunkOneReview = (id) => async dispatch=>{
    const res = await csrfFetch(`/api/spots/${id}/reviews`);
    if(res.ok){
        const reviews = await res.json();
        dispatch(one(reviews))
    }
};

export const addRev = (spoId,rev)=> async dispatch=>{
    await csrfFetch(`/api/spots/${spoId}/reviews`,{
        method: "post",
        header: { 'Content-Type': 'application/json'},
        body: JSON.stringify(rev)
    })
}

const ReviewReducer = (state = {},action)=>{
    switch(action.type){
        case ONE_REVIEW:
            const newState = {};
            action.reviews.Reviews.forEach(ele=> newState[ele.id]= ele);
            return {...state, ...newState}
            default:
                return state
    }
};

export default ReviewReducer