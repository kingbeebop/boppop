import React from 'react'
import Login from './Login'
import { useNavigate } from "react-router-dom";

function Nav({user, onLogin, onLogout}){

    const navigate = useNavigate();

    function handleHome(){
        navigate("/")
    }

    function  handleProfile(){
        navigate(`/u/${user.url}`)
    }

    function handleAbout(){
        navigate("/about")
    }

    function handleSubmission(){
        navigate("/submit")
    }

    function handleArchive(){
        navigate("/archive")
    }

    function handleArtists(){
        navigate("/artists")
    }

    function handleContact(){
        navigate("/contact")
    }

    return(
        <div className="nav-bar">
            {(user===null)?
            <>
            <Login  user={user} onLogin={onLogin} onLogout={onLogout} />
            <br /></>:
            <></>}
            
            <button className="nav-button" onClick={handleHome}>Home</button>
            <br />
            {user?
            <>
            <button className="nav-button" onClick={handleProfile}>Profile</button>
            <br /></>:
            <></>}

            <button className="nav-button" onClick={handleAbout}>About</button>
            <br />
            <button className="nav-button" onClick={handleSubmission}>Submit</button>
            <br />
            <button className="nav-button" onClick={handleArchive}>Archive</button>
            <br />
            <button className="nav-button" onClick={handleArtists}>Artists</button>
            <br />
            <button className="nav-button" onClick={handleContact}>Contact</button>
            <br />
            {(user===null)?
            <></>:
            <Login  user={user} onLogin={onLogin} onLogout={onLogout} />}
        </div>
    )
}

export default Nav