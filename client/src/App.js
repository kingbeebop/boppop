import {useEffect, useState} from 'react'
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import './App.css';
import Login from './components/Login'
import SignUp from './components/SignUp'
import Archive from './components/Archive'
import Directory from './components/Directory'
import Banner from './components/Banner'
import Bubble from './components/Bubble'
import Nav from './components/Nav'
import Challenge from './components/Challenge'
import PreviousChallenge from './components/PreviousChallenge'
import Contest from './components/Contest'
import Artist from './components/Artist'
import About from './components/About'
import Contact from './components/Contact'
import Submission from './components/Submission'
import Winner from './components/Winner'
import React from 'react'

function App() {

  const [user, setUser] = useState(null);
  // const [currentPlaylist, setCurrentPlaylist] = useState({songs: []})
  const [winner, setWinner] = useState({id: 0})
  const [contestPlaylist, setContestPlaylist] = useState(false)

  const navigate = useNavigate()

  useEffect(()=>{
    fetch("/winner")
    .then(res=>res.json())
    .then(data=>{
      setWinner(data)})
  },[])

  useEffect(()=>{
    fetch("/contest")
    .then(res=>res.json())
    .then(data=>{
      if(data){
        setContestPlaylist(data)
      }else{
        console.log("no current contest")
      }
    })
  },[])

  useEffect(() => {
    fetch("/me").then((response) => {
      if (response.ok) {
        response.json().then((user) => setUser(user));
      }
    });
  }, []);

  function handleSignup(newUser){
    console.log(newUser)
    fetch('/users', {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(newUser)
    }).then(res=>{
      if(res.ok){
        res.json().then(data=>{
          setUser(data)
          navigate("/")})
      }
    })
  }

  function handleLogout(){
    fetch("/logout", {
      method: "DELETE",
    }).then(() => setUser(null));
  }

  

  
    return(
      // <Test />)
      <div className="app" >
        <div className="container">
        <Banner />
        <Bubble user={user} />
        <Nav user={user} onLogin={setUser} onLogout={handleLogout} />
        <div className="content-container">
        <Routes>
          <Route path="/" element={
          (user?(winner.id === user.id):false)?
          <Winner user={user}/>:
          contestPlaylist?
          <Contest playlist={contestPlaylist} user={user}/>:
          <PreviousChallenge /> }/>
          <Route path={`/week/:id`} element={<Challenge user={user}/>} />
          <Route path="/archive" element={<Archive user={user} />}/>
          <Route path="/artists" element={<Directory user={user} />}/>
          <Route path="/submit" element={<Submission user={user}/>}/>
          <Route path="/contact" element={<Contact user={user} />}/>
          <Route path="/about" element={<About user={user} />}/>
          <Route path={`/u/:url`} element={<Artist user={user} />}/>
          <Route path="/login" element={<Login user={user} onLogin={setUser} onLogout={handleLogout} />}/>
          <Route path="/signup" element={<SignUp user={user} onNewUser={handleSignup} />}/>
      </Routes>
      </div>
      <div className="right-border"></div>
      </div>
    </div>)
}

export default App;
