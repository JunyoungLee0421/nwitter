import Nweet from "components/Nweet";
import { dbService, storageService } from "fBase";
import { addDoc, collection, doc, getDocs, query, onSnapshot, orderBy } from "firebase/firestore";
import React, {useEffect, useState}  from "react";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import NweetFactory from "components/NweetFactory";

const Home = ({userObj}) => {
    const [nweets, setNweets] = useState([]);
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

    return (
        <div className="container">
            <NweetFactory userObj={userObj}/>
            <div style={{ marginTop: 30 }}>
                {nweets.map((nweet) => (
                    <Nweet key = {nweet.id} nweetObj = {nweet} isOwner = {nweet.createrId === userObj.uid}/>
                ))}
            </div>
        </div>
        );
    };

export default Home;
