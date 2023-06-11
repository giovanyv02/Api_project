import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink} from 'react-router-dom';
import { loadSpot } from "../../store/oneUserSpot";
import "./spot.css";
import { useHistory } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import DeleteFormModel from "../OpenModalButton/deleForm";
import UpdateForm from "../CreateSpot/updateSpot";

const OneUserSpotComponent = ()=>{
    const history = useHistory()
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(loadSpot())
    },[dispatch])

    const spots = useSelector(state=>Object.values(state.userSpots))
   if(!spots[0]){
    return <NavLink to="/create/spot">Create a new spot</NavLink>
   }
    // const upD = ()=>{
    //         <UpdateForm id={ele.id}/>
    // }
    return(
        <>
          <div className="allSpotPage">
        {spots.map(ele=>
          
               
            <div className="spotdiv">
                <NavLink key={ele.id} to={`/spots/${ele.id}`}>
              

                 <div className="spotimgDiv">
                     <img className="spotimg" src={ele.previewImage} alt={ele.name}/>
                 </div>
                </NavLink>
                 <div className="underSpot">
                     <div>
                     <p className="cityState">{ele.city} {ele.state}</p>
            
                     </div>
                     <div className="uright">
                        <i class="fas fa-star"></i>
                        {!ele.avgRating && <div>New</div>}
                        {ele.avgRating && <div>{ele.avgRating.toFixed(1)}</div>}
                        </div>
                 </div>
                 <div>
                     <p className="spotP"> ${ele.price} night</p>
                 </div>
                 <div>
                    
                    <OpenModalButton
                    buttonText="edit"
                    modalComponent={<UpdateForm id={ele.id}/>}
                    />
                    <OpenModalButton 
                    buttonText="Delete"
                    className = "button"
                   
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