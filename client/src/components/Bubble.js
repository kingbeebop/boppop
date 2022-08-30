import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Countdown from './Countdown'

function Bubble(){

    const navigate = useNavigate()

    let message = " "

    const [currentPlaylist, setCurrentPlaylist] = useState()


    useEffect(()=>{
        fetch('/current')
        .then(res=>res.json())
        .then(data=>setCurrentPlaylist(data))
    },[])

    

    function handleClick(){
        if(currentPlaylist.contest){
            navigate('/')
        }else{
            navigate(`/submit`)
        }    
    }
    return(
        <div className="bubble" onClick={handleClick}>
            <div>
            <div className="bubble-message">{message}</div>
            <br />
            <Countdown />
            </div>
            </div>
    )
}

export default Bubble