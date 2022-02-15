import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { authService, fireBaseInstance } from "fBase";
import AuthForm from "components/AuthForm";
//styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const Auth = () => {
    const onSocialClick = async(event) => {
        const {target:{name}} = event;
        let provider;
        if(name === "google") {
            provider = new GoogleAuthProvider();
        } else if(name === "github") {
            provider = new GithubAuthProvider();
        }
        const data = await signInWithPopup(authService, provider);
        console.log(data);
        //console.log(event.target.name);
    }
    return (
        <div className="authContainer">
            <FontAwesomeIcon
                icon={faTwitter}
                color={"#04AAFF"}
                size="3x"
                style={{ marginBottom: 30 }}
            />
            <AuthForm />
            <div className="authBtns">
                <button onClick = {onSocialClick} name = "google" className="authBtns">Continue with Google <FontAwesomeIcon icon={faGoogle} /></button>
                <button onClick = {onSocialClick} name = "github" className="authBtns">Continue with Github <FontAwesomeIcon icon={faGithub} /></button>
            </div>
        </div>
    )

}

export default Auth;
