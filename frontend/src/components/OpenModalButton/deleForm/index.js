import { useDispatch } from "react-redux"
import { deleSpot } from "../../../store/spots"

import { useHistory } from "react-router-dom";
import "./delete.css";
import {useModal} from "../../../context/Modal"
export default function DeleteFormModel({id}){

    const { closeModal } = useModal();
    
    const dispatch = useDispatch();
    const history = useHistory()
    
    const subDelete = ()=>{
        dispatch(deleSpot(id));
         closeModal()
       
    };

    const subNo = ()=>{
        closeModal()
    }

   
    return(
        <>
        <div className="delDiv">

        <h3 className="delH3">Confirm Delete</h3>
        <p className="delP">Are you sure you want to remove this spot from the listings?</p>
        <button onClick={subDelete} className="delYes">Yes (delete spot)</button>
        <button onClick={subNo} type="submit" className="delNo">No (keep spot)</button>
        </div>
        
        </>
    )
}