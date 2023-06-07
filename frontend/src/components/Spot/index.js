import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink} from 'react-router-dom';
import { allSpots } from "../../store/spots";
import "./spot.css";
const SpotComponent = ()=>{
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(allSpots())
       
    },[dispatch]);
        
    const spots = useSelector(state=> Object.values(state.spots))
   
    return (<>
    
       <div className="allSpotPage">
        {spots.map(ele=>
          
               
            <div className="spotdiv">
                <NavLink key={ele.id} to={`/spots/${ele.id}`}>
              

                 <div>
                     <img className="spotimg" src={ele.previewImage} alt={ele.name}/>
                 </div>
                </NavLink>
                 <div className="underSpot">
                     <div>
                     <p className="cityState">{ele.city} {ele.state}</p>
            
                     </div>
                     <div >{ele.avgRating}</div>
                 </div>
                 <div>
                     <p className="spotText"> ${ele.price} night</p>
                 </div>
             </div> 
         )} 
        </div> 
    </>
    );
}

export default SpotComponent;