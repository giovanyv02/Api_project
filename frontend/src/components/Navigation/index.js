import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";
import logo from "../../img/ab.jpg"

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div className="headerB">
        <NavLink to="/create/spot">Create a Spot</NavLink>
        
        <ProfileButton user={sessionUser} />
      </div>
    );
  } else {
    sessionLinks = (
      <div className="headerButton">
        <OpenModalButton
          buttonText="Log In"
          className="button"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </div>
      
    );
  }

  return (
    <>
    <div className="ulNav">
      <div  className="logoLi">
        <NavLink exact to="/">
         <img className="logo" src={logo} alt="logo"/>
        </NavLink>
      </div>
      {isLoaded && sessionLinks}

    </div>
    <hr></hr>
    
    </>
  );
}

export default Navigation;