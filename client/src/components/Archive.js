import React from 'react'
import {useState, useEffect} from 'react'
import ChallengeCard from './ChallengeCard'

function Archive(){

    const [playlists, setPlaylists] = useState([])
    const [filteredPlaylists, setFilteredPlaylists] = useState([])
    const [search, setSearch] = useState("")

    useEffect(()=>{
        fetch('/playlists')
        .then(res=>res.json())
        .then(data=>setPlaylists(data))
    },[])

    useEffect(()=>{
        setFilteredPlaylists(playlists)
    },[playlists])

    useEffect(()=>{
        setFilteredPlaylists(playlists.filter(playlist=>playlist.theme.toUpperCase().includes(search.toUpperCase())))
    })

    function onSearch(e){
        setSearch(e.target.value)
    }



    return(
    <div className="archive">
        <div className="search-box">
            <label className="search-label">Search: </label>
            <input className="search-input" onChange={onSearch}></input>
        </div>
        <br />
        {filteredPlaylists.map(playlist=><ChallengeCard key={playlist.id} playlist={playlist}/>)}
    </div>)
}

export default Archive