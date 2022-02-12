import { authService, dbService, storageService } from "fBase";
import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { collection, where } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export default ( {userObj, refreshUser} ) => {
    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    //logout function
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    }

    //when change is made
    const onChange = (event) =>{
        const {
            target:{value},
        } = event;
        setNewDisplayName(value);
    };

    //on submission
    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, {displayName : newDisplayName});
        };
        refreshUser();
    };

    /*using query("if" want to use it, not necessary for this course)
    const getMyNweets = async() => {
        //filtering the user
        const nweets = await collection(dbService, "nweets").where("creatorId", "==", userObj.uid).get();
        }
    
    useEffect(() => {
        getMyNweets();
    }, []);
    */
    return (
        <>
            <form onSubmit={onSubmit}>
                <input type = "text" placeholder="Display name" value = {newDisplayName} onChange = {onChange}/>
                <input type = "submit" value = "Update Profile"/>
            </form>

            <button onClick={onLogOutClick }>Log Out</button>
        </>
    )
};
