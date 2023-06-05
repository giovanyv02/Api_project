import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink} from 'react-router-dom';
import { allSpots } from "../../store/spots";
const SpotComponent = ()=>{
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(allSpots())
    },[dispatch]);

    const spots = useSelector(state=> Object.values(state.spots))
    //  if(spots.length) return null;
    return (<>
    
       <div className="page">
        {spots.map(ele=>
          
               
            <div className="spotdiv">
                <NavLink key={ele.id} to={`/spots/${ele.id}`}>
                <div>
                     <h1>{ele.name}</h1>
                 </div>

                </NavLink>
                 <div>
                     <img src={ele.previewImage} alt={ele.description}/>
                 </div>
                 <div>
                     <div>
                     <p>{ele.city}</p>
                     <p>{ele.state}</p>
                     </div>
                     <div>{ele.avgRating}</div>
                 </div>
                 <div>
                     <p>{ele.price}</p>
                 </div>
             </div> 
         )} 
        </div> 
    </>
    );
}

export default SpotComponent;