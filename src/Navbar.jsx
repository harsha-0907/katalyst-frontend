
import {useState} from "react";
import LogInStore from "./AuthStore";
import axios from "axios";

const navStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    background: "#add8e6",  // light blue color
    padding: "10px 20px",
    boxSizing: "border-box",
    borderBottom: "1px solid #ccc",
    zIndex: 1000,
  };
  
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };
  
  const tdLeft = {
    textAlign: "left",
    fontWeight: "bold",
    fontSize: "1.2em",
    verticalAlign: "middle",
  };
  
  const tdRight = {
    textAlign: "right",
    verticalAlign: "middle",
  };

  function Navbar() {
    const isLoggedIn = LogInStore(state => state.isLoggedIn);
    const setLogin = LogInStore(state => state.setIsLoggedIn);
    const setLogout = LogInStore(state => state.setIsLoggedOut);

    const authUrl = "https://katalyst-backend-zlx6.onrender.com/auth/login";
    const login = async () => {
        const [loading, setLoading] = userState(false);
        const response = await axios.get(authUrl);
        const responseData = response.data;
        console.log(responseData);
      
        if (responseData.statusCode === 200) {
          const loginUrl = responseData.url;
          const uId = responseData.uId;
          console.log("uId:", uId);
      
          const loginWindow = window.open(loginUrl, "Authentication for Composio", "width=500,height=600");
      
          const pollTimer = window.setInterval(async () => {
            if (loginWindow?.closed) {
              window.clearInterval(pollTimer);
              console.log("Login window closed, fetching credentials...");
      
              try {
                const authResponse = await axios.post(
                  `https://katalyst-backend-zlx6.onrender.com/auth/creds?uId=${uId}`
                );
      
                const authData = authResponse.data;
                console.log("Auth Data:", authData);
      
                if (authData.statusCode === 200) {
                  const token = authData.token;
                  localStorage.setItem("Authorization", token);
                  setLogin(); // Or setLogin(true);
                } else {
                  alert("Authentication failed. Please try again.");
                }
              } catch (err) {
                console.error("Error fetching credentials:", err);
                alert("Failed to fetch credentials.");
              }
            }
          }, 500); // Check every 500ms
        } else {
          console.log("Failed to get login URL:", responseData);
          alert("Unable to generate authentication URL");
        }
      };
      
    const logout = () => {
        try{
            localStorage.removeItem("Authorization");
            setLogout();
        } catch (error){
            console.log(error);
        }
    }
    return (
      <nav style={navStyle}>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={tdLeft}>Calendar</td>
              <td style={tdRight}>
                {
                    !isLoggedIn ? (<button onClick={login}>Login</button>) : 
                        (<button onClick={logout}>Logout</button>)
                }
              </td>
            </tr>
          </tbody>
        </table>
      </nav>
    );
  }
  
  export default Navbar;
  