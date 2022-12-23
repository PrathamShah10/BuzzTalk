import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App';
const Profile = () => {
  const [mypic, setMyPic] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(undefined);
  useEffect(() => {
    fetch('/mypost', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then((result) => {
        setMyPic(result)
      })
  }, [])

  useEffect(() => {
    if (image) {
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
          fetch('/updatepic', {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
              pic: data.url
            })
          }).then(res => res.json())
            .then(result => {
              localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
              dispatch({ type: "UPDATEPIC", payload: result.pic })
              //window.location.reload()
            })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [image])
  const uploadpic = (file) => {
    setImage(file)
    //we used useEffect of [image] rather than copying that useEffect code here because -> we need to append image
    //in cloudinary only when setImage operation is done
  }

  return (
    <div style={{ maxWidth: "750px", margin: "0px auto" }}>
      <div style={
        {
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
          border: "1px solid black"
        }
      }>
        <div>
          <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            src={state ? state.pic : "loading.."} alt="" />

          <div className="file-field input-field">
            <div className="btn #64b5f6 black darken-1">
              <span>Update Picture</span>
              <input type="file"
                onChange={(e) => uploadpic(e.target.files[0])
                }
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>

        </div>
        <div>
          <h4>{(state) ? state.name : "loading"}</h4>
          <div style={
            {
              display: "flex",
              justifyContent: "space-between",
              width: "108%"
            }
          }>
            <h6>{mypic.length} posts </h6>
            <h6>{state ? state.followers.length: "loading"} followers</h6>
            <h6>{state ? state.following.length : "loading"} following</h6>
          </div>
        </div>
      </div>
      <div className="gallery">

        {
          mypic.map(item => {
            return (
              <img className="item" src={item.photo} alt="" />
            )
          })
        }
      </div>
    </div>
  )
}

export default Profile