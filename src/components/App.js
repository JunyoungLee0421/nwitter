import React, {useEffect, useState} from 'react';
import AppRouter from 'components/Router';
import {authService} from "fBase";

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
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
  <>
    {init ? 
    (
      <AppRouter isLoggedIn={isLoggedIn} userObj = {userObj} /> 
    ) : ( 
      "Initializing..." 
      )}
    <footer>
      &copy; {new Date().getFullYear()} Nwitter
    </footer>
  </>
  );
}

export default App;
