import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./createForm.css";
import { addSpot } from "../../store/spots";

function CreateForm() {
  const dispatch = useDispatch();
 
  const [country, setcountry] = useState("");
  const [streetAdress, setStreetAdress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [run, setRun] = useState("no")
  
  const allSpots = useSelector(state=>Object.values(state.spots));
  const spo = allSpots[allSpots.length - 1];
  //  useEffect(()=>{
      
      //      const errors = {};
      const err = {}
      if(!country.length) err['country'] = "Country can't be empty";
      if(!streetAdress.length) err['street'] = "street Adress can't be empty";
      if(!city.length) err['city'] = "City can't be empty";
      if(!state.length) err['state'] = "State can't be empty";
      if(!description.length) err['description'] = "description can't be empty";
      if(!title.length) err['title'] = "Name can't be empty";
      if(!price.length) err['price'] = "price can't be empty";
      //   if(typeof price != "number") err['price'] = "price must be a number";
      let newSpot = {}
      
      if(!Object.values(err).length){
          
          newSpot = {
              "address": streetAdress,
              country,
              city,
              state,
              "lat": 37.76545358,
              "lng": -122.45730327,
              "name": title,
              description,
              price
            };
        };
        
        
        
        //      if(!streetAdress.length) errors['country'] = "Country can't be empty";
        //      if(!city.length) errors['country'] = "Country can't be empty";
        //      if(!state.length) errors['country'] = "Country can't be empty";
        //      if(!description.length) errors['description'] = "description can't be empty";
        //      if(!title.length) errors['title'] = "title can't be empty";
        //      if(!price.length) errors['price'] = "price can't be empty";
        //      if(typeof price != "number") errors['price'] = "price must be a number";
        //  setValidationErrors(errors);
        //  },[country,streetAdress,state,city,description,title,price])
        
        const history = useHistory();
        const updateCountry = (e) => setcountry(e.target.value);
        const updateStreet = (e) => setStreetAdress(e.target.value);
        const updatecity = (e) => setCity(e.target.value);
        const updateDescription = (e) => setDescription(e.target.value);
        const updateTitle = (e) => setTitle(e.target.value);
        const updatePrice = (e) => setPrice(e.target.value);
        const updateState = (e)=> setState(e.target.value);
        
        function onSubmit(e){
            const errors = {};
            if(!country.length) errors['country'] = "Country can't be empty";
            if(!streetAdress.length) errors['street'] = "street Adress can't be empty";
            if(!city.length) errors['city'] = "City can't be empty";
            if(!state.length) errors['state'] = "State can't be empty";
            if(!description.length) errors['description'] = "description can't be empty";
            if(!title.length) errors['title'] = "Name can't be empty";
            if(!price.length) errors['price'] = "price can't be empty";
            //  if(typeof price != "number") errors['price'] = "price must be a number";
            setValidationErrors(errors);
            e.preventDefault();
            
            if(!Object.values(errors).length){
                setRun("yes")
                
                
                    history.push(`/spots/${spo.id}`)
            }else{
                setRun("no")

            }
            
            
        }
        
        useEffect(()=>{
            if(Object.values(newSpot).length && run === "yes"){
                   dispatch(addSpot(newSpot))
             
            }
            
        },[run])
        
        return (
    <>
      <h1>Create a Spot</h1>
      <h2>Where's your place located</h2>
      <p>Guest will only get your exact address once they booked a reservation.</p>
      <form onSubmit={onSubmit}>
      <label>
          Country
          <input
            type="text"
            value={country}
            onChange={updateCountry}
            // 
          />
        </label>
        {validationErrors.country && <p className="errors">{validationErrors.country}</p>}
         <label>
          street address
          <input
            type="text"
            value={streetAdress}
            onChange={updateStreet}
           
          />
        </label>
        {validationErrors.street && <p className="errors">{validationErrors.street}</p>}
         <label>
          city
          <input
            type="text"
            value={city}
            onChange={updatecity}
            
          />
        </label>
        {validationErrors.city && <p className="errors">{validationErrors.city}</p>}
         <label>
          State 
          <input
            type="text"
            value={state}
            onChange={updateState}
            
          />
        </label> 
        {validationErrors.state && <p className="errors">{validationErrors.state}</p>}
        <h3>Describe your place to guest</h3>
        <p> Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
        <textarea value={description} onChange={updateDescription}>
          Description 
         
        </textarea> 
        {validationErrors.description && <p className="errors">{validationErrors.description}</p>}
        <h4>Create a title for your spot</h4>
        <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
        <label>
          
          <input
            type="text"
            value={title}
            onChange={updateTitle}
            
            placeholder="Name of your spot"
          />
        </label>
        {validationErrors.title && <p className="errors">{validationErrors.title}</p>}
        <h4>Set a base price for your spot</h4>
        <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
         <label>
          $
          <input
            type="number"
            value={price}
            onChange={updatePrice}
            
            min="0"
            placeholder="Price per night (USD)"
          />
        </label> 
        {validationErrors.price && <p className="errors">{validationErrors.price}</p>}
      <button>Create spot</button>
      </form>
    </>
  );
}

export default CreateForm;