import React from 'react'
import { useAuth } from "./AuthContext";
function New() {
    const { authToken, userId, isLoggedIn, login, logout } = useAuth();
  return (
    <div>
         <button onClick={logout}>Logout</button>
     <h2>Login Done</h2>
    </div>
   
  )
}

export default New
