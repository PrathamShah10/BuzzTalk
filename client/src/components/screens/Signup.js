import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css';
import '../../App.css'
const Signup = () => {
  const navigate = useNavigate()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(undefined);
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    if (url) {
      uploadFields()
    }
  }, [url])
  const uploadpic = () => {
    const data = new FormData();
    data.append("file", image)
    data.append("upload_preset", "socail_media-app")
    data.append("cloud_name", "bdg77jk4eui")
    fetch("https://api.cloudinary.com/v1_1/bdg77jk4eui/image/upload", {
      method: "post",
      body: data
    })
      .then(res => res.json())
      .then(data => {
        setUrl(data.url);
      })
      .catch(err => {
        console.log(err)
      })
  }
  const uploadFields = () => {
    if(!name || !email || !password) {
      M.toast({ html: "Enter all credentials", classes: "#c62828 red darken-3" })
      return
    }
    if(password.length < 8) {
      M.toast({ html: "Password should be atleast 8 characters", classes: "#c62828 red darken-3" })
      return
    }
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      M.toast({ html: "invalid email", classes: "#c62828 red darken-3" })
      return
    }
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password,
        pic: url
      })
    })
      .then(res => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" })
        }
        else {
          M.toast({ html: data.message, classes: "#43a047 green darken-1" })
          navigate('/signin');
        }
      }).catch(err => console.log(err))
  }
  const PostData = () => {
    if (image) {
      uploadpic()
    }
    else {
      uploadFields()
    }
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
        <input type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="login-block">
          <input type="text"
            placeholder="email"
            id='username'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input type="password"
            placeholder="password"
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className='spanv'><i className="material-icons" onClick={() => changetype()}>remove_red_eye</i></span>
        </div>
        <div className="file-field input-field">
          <div className="btn #64b5f6 blue darken-1">
            <span>Uplaod Profile Picture</span>
            <input type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>

        <button className="btn waves-effect waves-light #64b5f6 dark blue"
          onClick={() => PostData()}
        >
          Signup
        </button>
        <div>
          <Link to="/signin">Already a User?</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup 