import { useDispatch } from "react-redux"
import { deleSpot } from "../../../store/spots"

import { useHistory } from "react-router-dom";
export default function DeleteFormModel({id}){

    
    
    const dispatch = useDispatch();
    const history = useHistory()
    
    const subDelete = ()=>{
        dispatch(deleSpot(id));
       
    };

    const subNo = ()=>{
        history.push("/mySpots")
    }

   
    return(
        <>
        <button onClick={subDelete}>Yes (delete spot)</button>
        <button type="submit">No (keep spot)</button>
        
        </>
    )
}