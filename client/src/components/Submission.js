import React, {useState, useEffect} from 'react'

function Submission({user}){

    const [errors, setErrors] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const [currentPlaylist, setCurrentPlaylist] = useState(
        {id: 0, songs: [], theme: "Testing."}
        )
    const [currentSubmission, setCurrentSubmission] = useState({name: "", url: ""})

    useEffect(()=>{
        fetch('/submission')
        .then(res=>{
            if(res.ok){res.json()
        .then(data=>{
            if(data){
                setSubmitted(true)
                setCurrentSubmission(data)
            }})
        }})
    },[])

    useEffect(()=>{
        fetch('/current')
        .then(res=>res.json())
        .then(data=>setCurrentPlaylist(data))
    },[])

    function handleDelete(){
        fetch(`/songs/${currentSubmission.id}`,{
            method: "DELETE",
            headers:{"Content-Type":"application/json"}
        })
        .then(setCurrentSubmission(false))
        .then(setSubmitted(false))
    }

    function handleChangeName(e){
        console.log(e.target.value)
        setCurrentSubmission({...currentSubmission, name: e.target.value})
    }

    function handleChangeUrl(e){
        console.log(e.target.value)
        setCurrentSubmission({...currentSubmission, url: e.target.value})
    }

    function handleSubmit(e){
        e.preventDefault()
        fetch('/songs',{
            method: "POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(currentSubmission)
        }).then(res=>{
            if(res.ok){
                res.json().then(data=>{
                    setErrors("")
                    setCurrentSubmission(data)
                    setSubmitted(true)})
            }else{
                setErrors("Something went wrong")
            }
        })
    }

    return(
        <>
        {user?
        <div className="submission-container">
            <div className="errors">{errors}</div>
        {submitted?
        <div>
        <div>Your entry has been submitted!</div>
        <button className="delete-submission" onClick={handleDelete}>Delete Submission</button>
        </div>:
        <div className="submission-header">
        <p>Current Theme:</p>
        <h2>{currentPlaylist.theme}</h2>
        <form className="submission-form" onSubmit={handleSubmit}>
            <div className="submission-elements">
            <label >Song Name: </label>
            <input type="text" id="name" name="name" value={currentSubmission.name} onChange={handleChangeName}/>
            <br />
            <br />
            <label >Soundcloud Link: </label>
            <input type="text" id="url" name="url" value={currentSubmission.url} onChange={handleChangeUrl}/>
            </div>
            <br />
            <button className="submit-button">Submit</button>
        </form></div>}
        </div>:
        <div className="login-prompt">Log in or Sign Up to enter!</div>
        }</>
    )
}

export default Submission