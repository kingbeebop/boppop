import React from 'react'

function SongCard({song, onSelect, currentPlayingId, winner}){

    function handleClick(){
        onSelect(song)
    }

    return(
        <div className={(currentPlayingId===song.id)?"active-song":((winner===song.user_id)?"winning-song":"inactive-song")} onClick={handleClick}>
        <div>{song.name} by {song.user.artist_name}</div>
    </div>)
}

export default SongCard