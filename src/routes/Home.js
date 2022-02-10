import Nweet from "components/Nweet";
import { dbService } from "fBase";
import { addDoc, collection, doc, getDocs, query, onSnapshot, orderBy } from "firebase/firestore";
import React, {useEffect, useState}  from "react";

const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");
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

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const docRef = await addDoc(collection(dbService, "nweets"), {
                text: nweet,
                createdAt: Date.now(),
                createrId: userObj.uid,
            }); 
            console.log("document written with Id : ", docRef.id);
        } catch(error) {
            console.log("error adding docuemnt : ", error);
        }

        setNweet("");
    };

    const onChange = (event) => {
        const {target:{value},} = event;
        setNweet(value);
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value = {nweet} onChange = {onChange} type = "text" placeholder="Waht's on your mind?" maxLength={120} />
                <input type = "submit" value = "Nweet" />
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
