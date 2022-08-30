import React from 'react'
import {useNavigate} from 'react-router-dom'

function ChallengeCard({playlist}){

    const navigate = useNavigate()

    console.log(playlist)

    function handleRedirect(){
        navigate(`/week/${playlist.number}`)
    }

    return(
        <div className="challenge-card" onClick={handleRedirect}>{"Bop Pop " + playlist.number + " - " + playlist.theme}</div>
    )
}

export default ChallengeCard