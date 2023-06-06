import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { getOneThunk } from "../../store/detail";
import {thunkOneReview} from "../../store/reviews"
const SpotDetailComponent = () => {
    
    const dispatch = useDispatch();
    const { id } = useParams()
    useEffect(() => {
        dispatch(getOneThunk(id))
        
        console.log("yes I ran")
    }, [dispatch, id]);

    useEffect(()=>{
        dispatch(thunkOneReview(id))
    }, [dispatch])
    
    const spot = useSelector(state => state.detail);
    const reviews = useSelector(state=> Object.values(state.reviews))
    
    
    if(!spot.id) return null
    
    
    

    return (
        <>
        
            <div>
               
                <h1>{spot.name}</h1>
                <p>{spot.city}, {spot.state}, {spot.country}</p>
            </div>
            <div>
                {spot.SpotImages.forEach(ele =>
                    <img src={ele.url} />
                )}
            </div>
            <div>
                <div>
                    <h4>
                        Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
                    </h4>
                    <p>{spot.description}</p>
                </div>
                <div>
                    <div>
                        <p>{spot.price}</p>

                    </div>
                    <button >Reserve</button>
                </div>

            </div>
            <div>
               {reviews.map(ele=> 
               <>
                <p>{ele.User.firstName}</p>
                <p>{ele.createdAt}</p>
                <p>{ele.review}</p>
               </>
                )}
            </div>

        </>
    )
};

export default SpotDetailComponent;