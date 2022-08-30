import React, {useState, useEffect} from 'react'
import Playhead from './Playhead'
import SongCard from './SongCard'


function Contest({playlist, user}){

    const [currentSong, setCurrentSong] = useState(playlist.songs[0])
    const [comment, setComment] = useState("")
    const [vote, setVote] = useState(playlist.songs[0])

    useEffect(()=>{
        fetch('/currentvote')
        .then(res=>res.json())
        .then(data=>{
            if(data){
                setVote(data.song)}})
    },[])

    useEffect(()=>{
        fetch('/currentcomment')
        .then(res=>res.json())
        .then(data=>{if(data){setComment(data.content)}})
    },[])

    function handleSelect(song){
        setCurrentSong(song)
    }

    function updateComment(e){
        setComment(e.target.value)
    }

    function handleChooseSong(song){
        setVote(song)
    }

    function handleSubmit(e){
        e.preventDefault()
        submitVote()
        submitComment()
    }

    function submitVote(){
        fetch('/currentvote')
        .then(res=>res.json())
        .then(data => {if(data){
            fetch(`/votes/${data.id}`, {
                method: "PATCH",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({song_id: vote.id})
            })
        }else{
            fetch('/votes', {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({song_id: vote.id})
            })
            .then(res=>res.json())
            .then(data=>setVote(data))
        }})

    }

    function submitComment(){
        if(comment !== ""){
            fetch('/currentcomment')
            .then(res=>res.json())
            .then(data=>{
                if(data){
                fetch(`/comments/${data.id}`, {
                    method: "PATCH",
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify({content: comment})
                })
                .then(res=>res.json())
                .then(data=>setComment(data.content))
            }else{
                fetch('/comments', {
                    method: "POST",
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify({content: comment})
                })
                .then(res=>res.json())
                .then(data=>setComment(data.content))
            }})
        }
    }

    return(<div className="contest-container">
        <div className="challenge-title">
            <h1 className="challenge-theme" >Vote or Die!</h1>
            <h2 className="challenge-header" >Theme: {playlist.theme}</h2>
        </div>
        <div className='playlist-container'>
             {currentSong?
            <Playhead song={currentSong} autoplay={false}/>:
            <div>Loading...</div>}

          <form className="vote-form" onSubmit={handleSubmit}>
            {playlist.songs.map(song=>
                <div key={song.id} className={(vote.id === song.id)?"selected-vote-card":"vote-card"}>

                <input type="radio"
                name="vote-song"
                value={song}
                onChange={() => handleChooseSong(song)}/>

                <SongCard
                onSelect = {handleSelect}
                song={song}/>

                </div>)}
                {user?
                <>
                <label className="feedback-label">Leave feedback:</label>
                <br />
                <textarea className="feedback-box" rows="20" cols="100" type="text" name="vote-comment" onChange={updateComment} value={comment}></textarea>
                <br />
                <button className="vote-button" type="submit">{vote?"Update":"Submit"}</button>
                </>:
                <></>}
            </form>  

        </div>
        
    </div>)
}

export default Contest