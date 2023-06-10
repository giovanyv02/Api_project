import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { getOneThunk } from "../../store/detail";
import {thunkOneReview} from "../../store/reviews"
import "./SpotDetail.css";
const SpotDetailComponent = () => {
    
    const dispatch = useDispatch();
    const { id } = useParams()
    useEffect(() => {
        dispatch(getOneThunk(id))
        
       
    }, [dispatch, id]);

    useEffect(()=>{
        dispatch(thunkOneReview(id))
    }, [dispatch])
    
    const spot = useSelector(state => state.detail);
    let firstImg;
    let otherImg
    if(spot.id){
         firstImg = spot.SpotImages[0]
         otherImg = spot.SpotImages.slice(1)

    }
   
    const reviews = useSelector(state=> Object.values(state.reviews))

    const reviewSpot = reviews.filter(rev=> rev.spotId == id);
    
    
    if(!spot.id) return null
    const alertf = ()=>{
        alert("Feature coming soon")
    }
    
    

    return (
        <>
        <div className="detailDiv">

            <div className="topimg">
               
                <h1>{spot.name}</h1>
                <p>{spot.city}, {spot.state}, {spot.country}</p>
            </div>
            <div className="imgdetail">
                <div className="left">
                    <img src={firstImg.url} className="fimg"/>
                </div>
                <div className="right">
                {otherImg.map(ele =>
                    <img src={ele.url} className="othr"/>
                )}

                </div>
            </div>
            <div className="unIm">
                <div className="hostedBy">
                    <h4>
                        Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
                    </h4>
                    <p>{spot.description}</p>
                </div>
                <div className="priceRev">
                    <div className="divanle">
                        <div className="divanledro">
                        <p>${spot.price} night</p>
                        </div>
                        {!reviewSpot[0] && <div className="divanlegauch"><i class="fas ti fa-star"></i><p>New</p></div>}

                        
                       { reviewSpot[0] && <div className="divanlegauch">
                        <i class="fas ti fa-star"></i>
                        <p>{spot.avgStarRating.toFixed(1)}</p>
                        <p>.</p>
                        <p>{reviewSpot.length} reviews</p>
                        </div>}
                    </div>
                    <button onClick={alertf} className="reserveBu">Reserve</button>
                </div>

            </div>
            <div>
               {reviewSpot.map(ele=> 
               <>
                <p>{ele.User.firstName}</p>
                <p>{ele.createdAt}</p>
                <p>{ele.review}</p>
               </>
                )}
            </div>
        </div>

        </>
    )
};

export default SpotDetailComponent;