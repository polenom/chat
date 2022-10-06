import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";

const Profiles = (props) => {


    return (
        <NavLink to={`/chat/${props.url}/`} >
            <li className="contact" >
                <div className="wrap">
                    <span className="contact-status online"></span>
                    <img src="http://emilcarlsson.se/assets/louislitt.png" alt="" />
                    <div className="meta">
                        <p className="name">Louis Litt</p>
                        <p className="preview">You just got LITT up, Mike.</p>
                    </div>
                </div>
            </li>
        </NavLink>
        
    )
}

export default Profiles