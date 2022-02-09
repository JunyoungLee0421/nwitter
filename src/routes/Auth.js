import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { authService, fireBaseInstance } from "fBase";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name==="email") {
            setEmail(value);
        } else if (name==="password") {
            setPassword(value);
        }
    };
    const onSubmit = async(event) => {
        event.preventDefault();
        //error handling
        try{
            let data;
            if(newAccount) {
                //create account
                data = await createUserWithEmailAndPassword(authService, email,password);
            } else {
                //login
                data = await signInWithEmailAndPassword(authService, email, password);
            }
            console.log(data);
        } catch(error) {
            setError(error.message);
        }

    };

    const toggleAccount = () => setNewAccount((prev) => !prev);

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
    <div>
        <form onSubmit={onSubmit}>
            <input name = "email" type = "email" placeholder = "Email" required value = {email} onChange = {onChange}/>
            <input name = "password" type = "password" placeholder = "Password" required value = {password} onChange = {onChange}/>
            <input type = "submit" value = {newAccount ? "Create Account" : "Sign In"} />
            {error}
        </form>
        <span onClick = {toggleAccount}> {newAccount ? "Sign In" : "Create Account" }</span>
        <div>
            <button onClick = {onSocialClick} name = "google">Continue with Google</button>
            <button onClick = {onSocialClick} name = "github">Continue with Github</button>
        </div>
    </div>
    )

}

export default Auth;
