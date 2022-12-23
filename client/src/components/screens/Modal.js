import { useEffect } from 'react';
import { Link } from 'react-router-dom'
import React, { useState } from 'react'

const Modal = (props) => {
    const [value, setValue] = useState("");
    const [renderingList, setRenderList] = useState("");
    useEffect(() => {
        fetch(`/search/${value}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then((res) => {
                if (res.status !== 200) {
                    return []
                }
                return res.json()
            })
            .then((result) => {
                setRenderList(result);
            })
    }, [value])
    return (
        <div className="modal" onClick={() => {
            if (props.onClose) props.onClose()
        }}>
            <div className="modal_content" onClick={(e) => e.stopPropagation()} style={{ color: 'black' }}>
                <h5 style={{ padding: '15px' }}>Search for users</h5>
                <span style={{ display: 'inline-block', position: 'relative', bottom: '88px', left: '1030px', cursor: 'pointer' }}>
                    <i class="material-icons" onClick={() => props.onClose()}>cancel</i>
                </span>
                <input type="text" style={{ position: 'relative', width: '60%', left: '15px' }} onChange={(e) => {
                    setValue(e.target.value);
                }} />
                <ul className="collection">
                    {
                        renderingList?.length !== 0
                            ?
                            renderingList.map((item) => {
                                return (
                                    <Link to={"/profile/" + item._id} onClick={() => props.onClose()} key={item._id}> <li className='collection-item'> {item.name} </li> </Link>
                                )
                            })
                            :
                            <li style={{ padding: '10px' }}>No user exsist!</li>
                    }
                </ul>
            </div>
        </div>
    )
}

export default Modal