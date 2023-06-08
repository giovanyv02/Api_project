import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotComponent from "./components/Spot";
import SpotDetailComponent from "./components/SpotDetail";
import CreateForm from "./components/CreateSpot";
import OneUserSpotComponent from "./components/Spot/useSpot";
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
      <Switch>
        <Route exact path="/spots/:id">
          <SpotDetailComponent />
        </Route>
        <Route exact path="/">
        <SpotComponent />
        </Route>
        <Route path="/create/spot">
        <CreateForm />
        </Route>
        <Route exact path="/mySpots">
        <OneUserSpotComponent />
        </Route>
      </Switch>)}
    </>
  );
}

export default App;