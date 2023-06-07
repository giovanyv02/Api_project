import { csrfFetch } from "./csrf";
  const ADD_IMAGE = "image/ADD_IMAGE";

  const addImage = (img)=>({
    typpe: ADD_IMAGE,
    img
  });

  export const addImageThunk = (id, img)=>async dispatch=>{
    const res = await csrfFetch(`/api/spots/${id}/images`,{
        method: "POST",
        header: { 'Content-Type': 'application/json'},
        body: JSON.stringify(img)
    });
    if(res.ok){
        const image = await res.json()
    }
  }