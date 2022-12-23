import React, { useState, useEffect, useContext } from 'react'
import '../../App.css'
import { UserContext } from '../../App.js'
import { Link } from 'react-router-dom'
const Home = () => {
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);
const [skip,setSkip]=useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 2;
  const [firstIndex, setFirstIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(2);
  const totalPages = Math.ceil(data.length / postsPerPage);


  const prevPage = () => {
    if (currentPage === 1) return;
    setCurrentPage(currentPage - 1);
    setLastIndex(Math.min(currentPage * postsPerPage, data.length));
    setFirstIndex(currentPage * postsPerPage - postsPerPage);
  }


  const nextPage = () => {
    if (currentPage === totalPages) return;
    setCurrentPage(currentPage + 1);
  }


  useEffect(() => {
    if(skip) {
      setSkip(false);
      return;
    }
    setLastIndex(Math.min(currentPage * postsPerPage, data.length));
    setFirstIndex(currentPage * postsPerPage - postsPerPage);
  }, [currentPage])

  useEffect(() => {
    fetch('/allpost', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then((result) => {
        setData(result)
      })
  }, [])
  const likepost = (id) => {
    fetch('/like', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    })
      .then(res => res.json())
      .then((result) => {

        const newData = data.map((item) => {
          if (result._id === item._id) {
            return result;
          }
          else {
            return item;
          }
        })
        setData(newData);
      })
  }
  const unlikepost = (id) => {
    fetch('/unlike', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    })
      .then(res => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (result._id === item._id) {
            return result;
          }
          else {
            return item;
          }
        })
        setData(newData);
      })
  }
  const makeComment = (text, postId) => {
    fetch('/comment', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId,
        text
      })
    }).then(res => res.json())
      .then(result => {
        const newData = data.map(item => {
          if (item._id == result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
      }).catch(err => {
        console.log(err)
      })
  }
  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then(result => {
        const newData = data.filter(item => {
          return item._id !== result._id
        })
        setData(newData)
      })
  }
  return (
    <div className="home" >
      {
        data
        ?
        data.slice(firstIndex, lastIndex).map(item => {
          return (
            <div className="card home-card black" key={item._id}>
              <h5>
                {
                  (item.postedBy._id !== state._id)
                    ?
                    <Link to={"/profile/" + item.postedBy._id}> <span style={{ color: 'white',padding:'5px' }}>{item.postedBy.name}</span> </Link>
                    :
                    <Link to="/profile/"> <span style={{ color: 'white',padding:'5px' }}> {item.postedBy.name}</span> </Link>
                }
                {
                  (item.postedBy._id === state._id) ?
                    <i className="material-icons" style={{ float: "right", color: "white", padding: '10px', cursor: 'pointer' }}
                      onClick={() => deletePost(item._id)}>
                      delete
                    </i>
                    :
                    <span></span>
                }
              </h5>
              <div className="card-image">
                <img src={item.photo} alt="" />
              </div>
              <div className="card-content">
                <i className="material-icons" style={{ color: "Red" }}>favorite</i>
                {
                  (item.likes.includes(state._id))
                    ?
                    <i className="material-icons"
                      onClick={() => unlikepost(item._id)}
                      style={{ color: "white" }}
                    >thumb_down</i>
                    :
                    <i className="material-icons"
                      onClick={() => likepost(item._id)}
                      style={{ color: "white" }}
                    >thumb_up</i>
                }
                <h6 style={{ color: "white" }}>{item.likes.length}</h6>
                <h6 style={{ color: "white" }}>{item.title}</h6>
                <h6 style={{ color: "white" }}>{item.body}</h6>
                {

                  item.comments.map((record, index) => {
                    return (
                      <>
                        <h6 style={{ color: "white" }} key={record._id}><span id="toBold">{record.postedBy.name + ": "}</span> {record.text}</h6>
                      </>
                    )
                  })

                }
                <form onSubmit={(e) => {
                  e.preventDefault()
                  makeComment(e.target[0].value, item._id)
                }}>
                  <input type="text" style={{ color: "white" }} placeholder="add a comment" />
                </form>
              </div>
            </div>
          )
        })
        :
        <h2>loading...</h2>
      }
      <div className='pagination'>
        <button className="btn waves-effect waves-light #64b5f6 black"
          onClick={() => prevPage()}
        >
          Prev
        </button>
        <span>&ensp;<b>{currentPage}</b>&ensp;</span>
        <button className="btn waves-effect waves-light #64b5f6 black"
          onClick={() => nextPage()}
        >
          Next
        </button>
      </div>

    </div >
  )
}

export default Home
