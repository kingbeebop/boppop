import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import Playlist from './Playlist'
import CommentContainer from './CommentContainer'

function Challenge(){

    const params = useParams()
    const [playlist, setPlaylist] = useState(null)

    useEffect(()=>{
        fetch(`/playlists/${params.id}`)
        .then(res=>res.json())
        .then(data=>{console.log(data)
            setPlaylist(data)})
    },[])

    return(<div className="challenge-container">
        {playlist?
        <div>
        <h1 className="challenge-title">Week #{playlist.number}: {playlist.theme}</h1>
        <Playlist playlist={playlist} />
        {(playlist.comments.length > 0)?
        <CommentContainer playlist={playlist}/>:
        <></>}
        </div>:
        <div>loading...</div>}
    </div>)
}

export default Challenge