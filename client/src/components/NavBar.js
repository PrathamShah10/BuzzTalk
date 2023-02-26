import React, { useState,useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../App'
import { useNavigate } from "react-router-dom"
import Modal from './screens/Modal'
const NavBar = () => {
  const [showModal,setShowModal]=useState(false);
  const Navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext)
  const renderList = () => {
    if (state) {
      return [
        <li key="1"><i className="material-icons" style={{cursor:'pointer'}} onClick={()=>setShowModal(true)}>search</i></li>,
        <li key="2"><Link to="/profile" className="custom">Profile</Link></li>,
        <li key="3"><Link to="/createpost" className="custom">Create Post</Link></li>,
        <li key="4"><Link to="/followingposts" className="custom">Following Post</Link></li>,
        <li key="5"><Link to="/chat" className="custom">Chat</Link></li>,
        <li key="6">
          <button className="btn waves-effect waves-light #64b5f6 red lighten-2"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" })
              Navigate('/signin')
            }}
          >
            Logout
          </button>
        </li>

      ]
    }
    else {
      return [
        <li key="7" ><Link to="/signin" className="custom">Signin</Link></li>,
        <li key="8" ><Link to="/signup" className="custom">Signup</Link></li>
      ]
    }
  }
  return (
    <div className="navbar-fixed">
      <nav>
        <div className="nav-wrapper black">
          <Link to={(state) ? "/" : "/signin"} className="brand-logo" left="true">BuzzTalk</Link>
          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
        </div>

        {
          showModal && (
            <Modal
            onClose={()=>setShowModal(false)}
            />
          )
        }
      </nav>
    </div>

  )
}

export default NavBar