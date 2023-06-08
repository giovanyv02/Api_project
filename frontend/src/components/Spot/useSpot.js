import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink} from 'react-router-dom';
import { loadSpot } from "../../store/oneUserSpot";
import "./spot.css";
import OpenModalButton from "../OpenModalButton";
import DeleteFormModel from "../OpenModalButton/deleForm";
import UpdateForm from "../CreateSpot/updateSpot";

const OneUserSpotComponent = ()=>{
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(loadSpot())
    },[dispatch])

    const spots = useSelector(state=>Object.values(state.userSpots))
   
    // const upD = ()=>{
    //         <UpdateForm id={ele.id}/>
    // }
    return(
        <>
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
                 <div>
                    <button className="msb" onClick={()=> <UpdateForm id={ele.id}/> }>Update</button>
                    <OpenModalButton 
                    buttonText="Delete"
                    className = "button"
                    id = {ele.id}
                    modalComponent={<DeleteFormModel id={ele.id}/>}
                    />
                 </div>
             </div> 
         )} 
        </div> 
        </>
    )
};

export default OneUserSpotComponent