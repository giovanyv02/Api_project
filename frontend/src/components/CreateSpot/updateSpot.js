import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./createForm.css";
import { addSpot } from "../../store/spots";
import {addImageThunk} from "../../store/image";

function UpdateForm({id}) {
    const spot = useSelector(state=> state.spots[id])
  const dispatch = useDispatch();

  const [country, setcountry] = useState(spot.country);
  const [streetAdress, setStreetAdress] = useState(spot.street);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state);
  const [description, setDescription] = useState(spot.description);
  const [title, setTitle] = useState(spot.title);
  const [price, setPrice] = useState(spot.price);
  const [image, setImage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [run, setRun] = useState("no")
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [url3, setUrl3] = useState("");
  const [url4, setUrl4] = useState("");
  const [url5, setUrl5] = useState("");


  const allSpots = useSelector(state => Object.values(state.spots));
  const spo = allSpots[allSpots.length - 1];

  //  useEffect(()=>{

  //      const errors = {};
  const err = {}
  if (!country.length) err['country'] = "Country can't be empty";
  if (!streetAdress.length) err['street'] = "street Adress can't be empty";
  if (!city.length) err['city'] = "City can't be empty";
  if (!state.length) err['state'] = "State can't be empty";
  if (description.length < 30) err['description'] = "description can't be empty";
  if (!title.length) err['title'] = "Name can't be empty";
  if (!price.length) err['price'] = "price can't be empty";
//   if (!url1.length) err['url1'] = "Preview image is required";
//   if (!url1.endsWith('.png') && !url1.endsWith('.jpg') && !url1.endsWith('jpeg')) err['url1'] = "Image Url must end in .png .jpg or .jpeg";

  //   if(typeof price != "number") err['price'] = "price must be a number";
  let newSpot = {}

  if (!Object.values(err).length) {

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
  const updateState = (e) => setState(e.target.value);
  const updateUrl1 = (e) => setUrl1(e.target.value);
  const updateUrl2 = (e) => setUrl2(e.target.value);
  const updateUrl3 = (e) => setUrl3(e.target.value);
  const updateUrl4 = (e) => setUrl4(e.target.value);
  const updateUrl5 = (e) => setUrl5(e.target.value);

  function onSubmit(e) {
    const errors = {};
    if (!country.length) errors['country'] = "Country can't be empty";
    if (!streetAdress.length) errors['street'] = "street Adress can't be empty";
    if (!city.length) errors['city'] = "City can't be empty";
    if (!state.length) errors['state'] = "State can't be empty";
    if (description.length < 30) errors['description'] = "description must be more than 30 characters";
    if (!title.length) errors['title'] = "Name can't be empty";
    if (!price.length) errors['price'] = "price is required";
   // if (!url1.endsWith('.png') && !url1.endsWith('.jpg') && !url1.endsWith('jpeg')) errors['url1'] = "Image Url must end in .png .jpg or .jpeg";
  //  if (!url1.length) errors['url1'] = "Preview image is required";
    //  if(typeof price != "number") errors['price'] = "price must be a number";
    setValidationErrors(errors);
    e.preventDefault();

    if (!Object.values(errors).length) {
      setRun("yes")


    } else {
      setRun("no")

    }


  }

  useEffect(() => {
    if (Object.values(newSpot).length && run === "yes") {
      const refun = async () => {
        const res = await dispatch(addSpot(newSpot))
        if(url1){
            const img1 = {"url":url1, "preview": true}
            dispatch(addImageThunk(res.id, img1));

        }
        // if(url2) dispatch(addImageThunk(res.id, url2))
        // if(url3) dispatch(addImageThunk(res.id, url3))
        // if(url4) dispatch(addImageThunk(res.id, url4))
        // if(url5) dispatch(addImageThunk(res.id, url5))
        history.push(`/spots/${res.id}`)

      }
      refun();

    }

  }, [run])

  return (
    <>
      <h1>Update your spot</h1>
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
        <label>

          <input
            type="text"
            value={url1}
            onChange={updateUrl1}


            placeholder="Preview Image Url"
          />
        </label>
        {validationErrors.url1 && <p className="errors">{validationErrors.url1}</p>}
        <label>

          <input
            type="text"
            value={url2}
            onChange={updateUrl2}
            placeholder="Image Url"

          />
        </label>

        <label>
          State
          <input
            type="text"
            value={url3}
            onChange={updateUrl3}
            placeholder="ImageUrl"

          />
        </label>

        <label>

          <input
            type="text"
            value={url4}
            onChange={updateUrl4}
            placeholder="Image Url"

          />
        </label>

        <label>

          <input
            type="text"
            value={url5}
            onChange={updateUrl5}
            placeholder="Image Url"
          />
        </label>

        <button>Update</button>
      </form>
    </>
  );
}

export default UpdateForm;