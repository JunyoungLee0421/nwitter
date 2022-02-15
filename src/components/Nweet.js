import React, { useState } from "react";
import { dbService, storageService } from "fBase";
import { doc, deleteDoc, updateDoc }from"firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
//styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
            //delete photo
            await deleteObject(ref(storageService, nweetObj.attachmentUrl));
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
        <div className="nweet">
            {editing ? (
                <>
                    <form onSubmit={onSubmit} className="container nweetEdit">
                        <input type = "text" placeholder = "Edit your nweet" value = {newNweet} required onChange={onChange} autoFocus className="formInput"/>
                        <input type = "submit" value = "Update Nweet" className="formBtn" />
                    </form>
                    <span onClick={toggleEditing} className="formBtn cancelBtn">
                        Cancel
                    </span>   
                </>

            ) : (
                <>
                    <h4>
                        {nweetObj.text}
                    </h4>
                    {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} />}


                    {isOwner && (
                        <div className="nweet__actions">
                            <span onClick={OnDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                    )}
                </>
            )}

        </div>
    );
}


export default Nweet;
