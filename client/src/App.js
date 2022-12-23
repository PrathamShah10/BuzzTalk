import React, { useEffect, createContext, useReducer, useContext } from 'react';
import NavBar from './components/NavBar'
import './App.css'
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import Signin from './components/screens/Signin'
import Signup from './components/screens/Signup'
import UserProfile from './components/screens/UserProfile'
import CreatePost from './components/screens/CreatePost';
import FollowingUser from './components/screens/FollowingUser'
import Reset from './components/screens/Reset'
import NewPassword from './components/screens/NewPassword';
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { reducer, initialState } from './reducers/UserReducer'
export const UserContext = createContext();

const Routing = () => {
  const Navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log(user)
    if (user) {
      dispatch({ type: "USER", payload: user })
    }
    else {
      if (!window.location.pathname.startsWith('/reset')) {
        Navigate('/signin')
      }
    }
  }, [])
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route path="/signup" element={<Signup />} />
      <Route path='/createpost' element={<CreatePost />}></Route>
      <Route path='/followingposts' element={<FollowingUser />}></Route>
      <Route path="/profile/:userid" element={<UserProfile />} />
      <Route exact path="/reset" element={<Reset />} />
      <Route path="/reset/:token" element={<NewPassword />} />
    </Routes>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />

      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
