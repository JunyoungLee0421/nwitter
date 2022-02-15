import React, {useEffect, useState} from 'react';
import AppRouter from 'components/Router';
import {authService} from "fBase";
import { updateProfile } from "firebase/auth";

//유저 로그인유무가 제일 위 (app.js) 에 있어야하고
//그 후로 app.js => router.js로 
// router.js => 스크린(home.js, profile.js, nweet.js 등) 으로 보냄
function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user) {
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid:user.uid,
          updateProfile: (args) => updateProfile(user, { displayName: user.displayName }),
        });
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  //refresh user
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid:user.uid,
      updateProfile: (args) => updateProfile(user, { displayName: user.displayName }),
    });
  }

  return (
  <>
    {init ? 
    (
      <AppRouter isLoggedIn={isLoggedIn} userObj = {userObj} refreshUser={refreshUser}/> 
    ) : ( 
      "Initializing..." 
      )}
    <footer className="footer">
      &copy; {new Date().getFullYear()} Nwitter
    </footer>
  </>
  );
}

export default App;
