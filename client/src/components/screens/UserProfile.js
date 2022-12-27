import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';
const UserProfile = () => {
    const [mypic, setMyPic] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const [userProfile, setUserProfile] = useState(null);
    var check=true;
    const { userid } = useParams();
    check= state ? state.following.includes(userid):true;
    const [followed, setfollowed] = useState(check)
    
    useEffect(() => {
        fetch('/profile/' + userid, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then((result) => {
                setUserProfile(result)
            })
            .catch(err => console.log(err))
    }, [])

    const follow = () => {
        fetch('/follow', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                userid
            })
        })
            .then(res => res.json())
            .then((result) => {
                dispatch({ type: "UPDATE", payload: { following: result.following, followers: result.followers } })
                localStorage.setItem("user", JSON.stringify(result))
                setUserProfile((prevstate) => {
                    return {
                        ...prevstate,
                        user: {
                            ...prevstate.user,
                            followers: [...prevstate.user.following, result._id]
                        }
                    }

                })
                setfollowed(true)
            })
    }

    const unfollow = () => {
        fetch('/unfollow', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                userid
            })
        })
            .then(res => res.json())
            .then((result) => {
                dispatch({ type: "UPDATE", payload: { following: result.following, followers: result.followers } })
                localStorage.setItem("user", JSON.stringify(result))
                setUserProfile((prevstate) => {
                    const newfollowers=prevstate.user.followers.filter(item=>item!==result._id)
                    return {
                        ...prevstate,
                        user: {
                            ...prevstate.user,
                            followers: newfollowers
                        }
                    }
                })
                setfollowed(false)
            })
    }
    return (
        <>
            {

                userProfile
                    ?
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
                                    src={userProfile.user.pic} alt="" />
                            </div>
                            <div>
                                <h4>{userProfile.user.name}</h4>
                                <h5>{userProfile.user.email}</h5>
                                <div style={
                                    {
                                        display: "flex",
                                        justifyContent: "space-between",
                                        width: "108%"
                                    }
                                }>
                                    
                                    <h6>{userProfile.posts.length} posts</h6>
                                    <h6>{userProfile.user.followers.length} followers</h6>
                                    <h6>{userProfile.user.following.length} following</h6>
                                    {
                                        (followed)
                                            ?
                                            <button className="btn waves-effect waves-light #64b5f6 black lighten-2"
                                                onClick={() => unfollow()}
                                            >Unfollow
                                            </button>
                                            :
                                            <button className="btn waves-effect waves-light #64b5f6 black lighten-2"
                                                onClick={() => follow()}
                                            >Follow
                                            </button>
                                    }

                                </div>
                            </div>
                        </div>
                        <div className="gallery">
                            {
                                userProfile.posts.map(item => {
                                    return (
                                        <img className="item" src={item.photo} alt="" />
                                    )
                                })
                            }
                        </div>
                    </div>
                    :
                    <h2>loading...</h2>
            }
        </>
    )
}

export default UserProfile