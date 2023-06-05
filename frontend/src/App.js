import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotComponent from "./components/Spot";
import SpotDetailComponent from "./components/SpotDetail";
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
      </Switch>)}
    </>
  );
}

export default App;