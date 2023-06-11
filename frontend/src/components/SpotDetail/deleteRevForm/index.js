import { useModal } from "../../../context/Modal"
import { useDispatch } from "react-redux";
import { delRev } from "../../../store/reviews";

export default function DeleteReviewModel({id}){
    const {closeModal} = useModal()
    const dispatch = useDispatch();

    const subDelete = ()=>{
        dispatch(delRev(id));
         closeModal()
       
    };

    const subNo = ()=>{
        closeModal()
    }
    return (
        <>
       <div className="delDiv">

<h3 className="delH3">Confirm Delete</h3>
<p className="delP">Are you sure you want to remove your review?</p>
<button onClick={subDelete} className="delYes">Yes (delete review)</button>
<button onClick={subNo} type="submit" className="delNo">No (keep review)</button>
</div>
            </>
    )
}