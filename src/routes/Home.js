import Nweet from "components/Nweet";
import { dbService, storageService } from "fBase";
import { addDoc, collection, doc, getDocs, query, onSnapshot, orderBy } from "firebase/firestore";
import React, {useEffect, useState}  from "react";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    /* old way 
    const getNweets = async() => {
        const dbnweets = await getDocs(collection(dbService, "nweets"));
        dbnweets.forEach(document => {
            const nweetObject = {
                ...document.data(),
                id: document.id,
            }
            setNweets((prev) => [nweetObject, ...prev]);
        });
    };
    */
    //new way => it doens'nt rerender (render only once)
    useEffect(() => {
        const q = query(collection(dbService, "nweets"), orderBy("createdAt", "desc"));
        //데이터베이스에 변화가 있을때마다 호출됨
        onSnapshot(q, (snapshot) => {
            const nweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray);
        })
    }, []);

    const onSubmit = async (event) => {
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
        <div>
            <form onSubmit={onSubmit}>
                <input value = {nweet} onChange = {onChange} type = "text" placeholder="Waht's on your mind?" maxLength={120} />
                <input type ="file" accpet = "image/*" onChange={onFileChange}/>
                <input type = "submit" value = "Nweet" />
                {
                    attachment &&
                    <div>
                        <img src = {attachment} width = "50px" height = "50px" alt = "No image Found"/>
                        <button onClick = {onClearAttachment}>Clear</button>
                    </div>
                   
                }
            </form>
            <div>
                {nweets.map((nweet) => (
                    <Nweet key = {nweet.id} nweetObj = {nweet} isOwner = {nweet.createrId === userObj.uid}/>
                ))}
            </div>
        </div>
        );
    };

export default Home;
