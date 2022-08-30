import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

function Winner({user}){

    const navigate = useNavigate()

    const [theme, setTheme] = useState("")

    function handleChange(e){
        setTheme(e.target.value)
    }

    function handleSubmit(e){
        e.preventDefault()
        fetch('/playlists',{
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({theme: theme})
        })
        .then(window.location.reload())
    }

    return(<div className="winner">
        <h1>Congratulations, {user.artist_name}!  You reign VICTORIOUS!!</h1>
        <form onSubmit={handleSubmit}>
            <label>What's next?</label>
            <input type="text" value={theme} onChange={handleChange}></input>
            <button type="submit">Submit</button>
        </form>
    </div>)
}

export default Winner