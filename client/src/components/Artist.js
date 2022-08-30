import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import Playlist from './Playlist'
import Profile from './Profile'

function Artist({user}){

    const params = useParams()
    const [artist, setArtist] = useState(null)
    const [playlist, setPlaylist] = useState(null)

    useEffect(()=>{
        fetch(`/artist/${params.url}`)
        .then(res=>res.json())
        .then(data=>setArtist(data))
    },[])

    useEffect(()=>{
        if(artist){
        fetch(`/discography/${artist.id}`)
        .then(res=>res.json())
        .then(data=>setPlaylist({theme: `Bopography`, songs: data}))}
    },[artist])

    return(<div className="artist-container">
        {artist?
        <>
        <div className="artist-title">{artist.artist_name}</div>
        {playlist?
        <Playlist playlist={playlist} bopography={true}/>:
        <div>loading...</div>}
        <Profile artist={artist} user={user}/>
        </>:
        <div>Loading...</div>}

    </div>)
}

export default Artist