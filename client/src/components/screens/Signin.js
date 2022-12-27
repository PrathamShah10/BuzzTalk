import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css';
import { UserContext } from '../../App';
const Signin = () => {
  const { state, dispatch } = useContext(UserContext)
  const navigate = useNavigate()
  // const [name,setName]=useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const PostData = () => {
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      M.toast({ html: "invalid email", classes: "#c62828 red darken-3" })
      return
    }
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })
      .then(res => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" })
        }
        else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          console.log(state?.name);
          M.toast({ html: "signed in sucessfully", classes: "#43a047 green darken-1" })
          navigate('/');
        }
      }).catch(err => console.log(err))
  }
  const changetype = () => {
    if (showPassword) {
      let x = document.getElementById('password');
      x.type = 'text'
      setShowPassword(false)
    }
    else {
      let x = document.getElementById('password');
      x.type = 'password'
      setShowPassword(true)
    }
  }
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>BuzzTalk</h2>
        <div className="login-block">
          <input type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="username"
          />
          <input type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
          />
          <span className='spanv'><i className="material-icons" onClick={() => changetype()}>remove_red_eye</i></span>
        </div>

        <button className="btn waves-effect waves-light #64b5f6 dark blue"
          onClick={() => PostData()}
        >
          Login
        </button>
        <div>
          <Link to="/signup">New User?</Link>
        </div>
        <h6><Link to="/reset">Forgot Password?</Link></h6>
      </div>
    </div>


  )
}

export default Signin