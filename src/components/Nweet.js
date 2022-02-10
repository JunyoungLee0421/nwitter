import React, { useState } from "react";
import { dbService } from "fBase";
import { doc, deleteDoc, updateDoc }from"firebase/firestore";

/*
//리터럴
const NweetTextRef =doc(dbService, "nweets", `${nweetObj.id}`);

// delete 부분
await deleteDoc(NweetTextRef );

//update 부분
await updateDoc(NweetTextRef, {
text: newNweet,
}); */
const Nweet = ({nweetObj, isOwner}) => {
    //변수생성 using hooks
    const [editing, setEditing] = useState(false);
    const [newNweet, setNweNweet] = useState(nweetObj.text);
    const NweetTextRef =doc(dbService, "nweets", `${nweetObj.id}`);
    //functions
    //delete funtion
    const OnDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if(ok) {
            //delete nweet
            await deleteDoc(NweetTextRef);
        } 
    };
    //toggle edit
    const toggleEditing = () => setEditing((prev) => !prev);
    //edit funtion
    const onSubmit = async(event) => {
        event.preventDefault();
        await updateDoc(NweetTextRef, {text:newNweet},);
        setEditing(false);
    }
    const onChange = async (event) => {
        const {target: {value}, } = event;
        setNweNweet(value);
    }
    return (
        <div>
            {editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input type = "text" placeholder = "Edit your nweet" value = {newNweet} required  onChange={onChange}/>
                        <input type = "submit" value = "Update Nweet" />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>

            ) : (
                <>
                    <h4>
                        {nweetObj.text}
                    </h4>
                    {isOwner && (
                        <>
                            <button onClick={OnDeleteClick}>Delete Nweet</button>
                            <button onClick={toggleEditing}>Edit Nweet</button>
                        </>
                    )}
                </>
            )}

        </div>
    );
}


export default Nweet;
