import React from 'react'
import {useNavigate} from 'react-router-dom'

function ArtistCard({artist}){

    const navigate = useNavigate()

    function handleRedirect(){
        navigate(`/u/${artist.url}`)
    }

    return(
        <div className="artist-card" onClick={handleRedirect}><p>{artist.artist_name}</p></div>
    )
}

export default ArtistCard