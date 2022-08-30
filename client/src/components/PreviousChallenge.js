import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import Playlist from './Playlist'
import CommentContainer from './CommentContainer'

function PreviousChallenge(){

    const [playlist, setPlaylist] = useState()

    useEffect(()=>{
        fetch('/previous')
        .then(res=>res.json())
        .then(data=>{
            setPlaylist(data)})
    },[])

    return(<div className="challenge-container">
        {playlist?
        <>
        <div className="challenge-title">
        <h2 className="challenge-header">Last Week's Challenge:</h2>
        <h1 className="challenge-theme">{playlist.theme}</h1></div>
        <Playlist playlist={playlist} />
        {(playlist.comments.length > 0)?
        <CommentContainer playlist={playlist}/>:
        <></>}
        </>:
        <div>loading...</div>}
    </div>)
}

export default PreviousChallenge