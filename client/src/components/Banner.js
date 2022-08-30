import React from 'react'
import {useNavigate} from 'react-router-dom'

function Banner(){

    const navigate = useNavigate()

    return(
        <div className="banner-container">
        <div onClick={()=>{navigate("/")}} className="banner">Bop Pop</div>
        <div className="banner-slogan">Write A Song Every Week... <i>OR ELSE!</i></div>
        </div>
    )
}

export default Banner