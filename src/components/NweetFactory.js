import React, {useEffect, useState}  from "react";
import { dbService, storageService } from "fBase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, doc, getDocs, query, onSnapshot, orderBy } from "firebase/firestore";
//styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({userObj}) => {
    //originally from home.js
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit = async (event) => {
        if (nweet === "") {
            return;
        }
        event.preventDefault();
        let attachmentUrl = "";
        if(attachment !== "") {
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url");
            attachmentUrl = (await getDownloadURL(response.ref));
        }
        const nweetPosting = {
            text: nweet,
            createdAt: Date.now(),
            createrId: userObj.uid,
            attachmentUrl
        };
        
        try {
            const docRef = await addDoc(collection(dbService, "nweets"), nweetPosting); 
            console.log("document written with Id : ", docRef.id);
        } catch(error) {
            console.log("error adding docuemnt : ", error);
        }
        setNweet(""); 
        setAttachment("");
    };

    //변화가 일어났을때
    const onChange = (event) => {
        const {target:{value},} = event;
        setNweet(value);
    };

    //file upload에 변화가 생겼을 때
    const onFileChange = (event) => {
        //1. Get the file
        const {
            target: {files},
        } = event;
        const theFile = files[0];

        //file reader API
        //2. Create a reader
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: {result},} = finishedEvent;
                setAttachment(result);
        };
        //3. Read the file with read as data url
        reader.readAsDataURL(theFile);

    };

    //업로드한사진 지우기
    const onClearAttachment = () => setAttachment("");

    return (
        //originally from home.js
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                className="factoryInput__input"
                value={nweet}
                onChange={onChange}
                type="text"
                placeholder="What's on your mind?"
                maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input
            id="attach-file"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{
            opacity: 0,
            }}
            />
            {attachment && (
            <div className="factoryForm__attachment">
                <img
                src={attachment}
                style={{
                    backgroundImage: attachment,
                }}
                />
                <div className="factoryForm__clear" onClick={onClearAttachment}>
                    <span>Remove</span>
                    <FontAwesomeIcon icon={faTimes} />
                </div>
            </div>
            )}
        </form>
    )
}

export default NweetFactory;