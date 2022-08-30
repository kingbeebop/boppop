import {useState, useEffect} from 'react'
import ArtistCard from './ArtistCard'
import React from 'react'

function Directory(){

    const [artists, setArtists] = useState([])
    const [filteredArtists, setFilteredArtists] = useState([])
    const [search, setSearch] = useState("")

    useEffect(()=>{
        fetch('/artists')
        .then(res=>res.json())
        .then(data=>setArtists(data))
    },[])

    useEffect(()=>{
        setFilteredArtists(artists)
    },[artists])

    useEffect(()=>{
        setFilteredArtists(artists.filter(artist=>artist.artist_name.toUpperCase().includes(search.toUpperCase())))
    })

    function onSearch(e){
        setSearch(e.target.value)
    }


    return(
        <div className="artist-directory">
            <div className="search-box">
            <label className="search-label">Search: </label>
            <input className="search-input" onChange={onSearch}></input>
        </div>
        <br />
            {filteredArtists.map(artist=><ArtistCard key={artist.id} artist={artist}/>)}
        </div>)
}

export default Directory