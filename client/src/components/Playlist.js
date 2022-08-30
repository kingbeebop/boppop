import SongCard from './SongCard'
import Playhead from './Playhead'
import React, {useState, useEffect} from 'react'

function Playlist({playlist, bopography}){

    const [songs, setSongs] = useState(playlist.songs)
    const [currentSong, setCurrentSong] = useState(playlist.songs[0])
    const [autoplay, setAutoplay] = useState(true)

    useEffect(()=>{

        setSongs(playlist.songs)
        setCurrentSong(playlist.songs[0])
    },[])


    function handleSelect(song){
        setAutoplay(true)
        setCurrentSong(song)
    }

    // const playheadGenerator = ({currentSong?
    //     <Playhead song={currentSong} autoplay={false}/>
    //     :
    //     <div>Loading...</div>})

    return (
        <div className={bopography?'artist-playlist':'playlist-container'}>

            {currentSong?
            <Playhead song={currentSong} autoplay={autoplay}/>
            :
            <div>No songs</div>}
            
            {songs.map(song=><SongCard
                // id={(song.id === currentSong.id)?"playing":"not-playing"}
                key={song.id}
                onSelect = {handleSelect}
                currentPlayingId = {currentSong.id}
                song={song}
                winner={playlist.winner}/>)}

        </div>
    )
}

export default Playlist
