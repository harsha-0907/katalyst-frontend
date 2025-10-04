import { useEffect } from 'react'
import Navbar from "./Navbar";
import MainPage from "./MainPage";
import LogInStore from "./AuthStore";

function App() {
  const setLogin = LogInStore(state => state.setIsLoggedIn);
  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      setLogin(true);
    }
  }, []);
  return (
    <>
    
      <Navbar/>
      <MainPage />
    </>
  );
}

export default App
