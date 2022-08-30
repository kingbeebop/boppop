import React, {useState} from 'react'

function Profile({artist, user}){

    const [edit, setEdit] = useState(false)
    const [profile, setProfile] = useState(artist)
    const [newLink, setNewLink] = useState({name: "", url: ""})
    const [links, setLinks] = useState(artist.links)
    const [newProfilePic, setNewProfilePic] = useState(null)
    
    function handleSave(){
        fetch(`/users/${user.id}`,{
            method: 'PATCH',
            headers: {'Content-Type':"application/json"},
            body: JSON.stringify(profile)
        })
        .then(res=>res.json())
        .then(data=>{
            setProfile(data)
            setEdit(false)})
    }

    function handleChange(e){
        setProfile({...profile, [e.target.name]: e.target.value})
    }

    function submitProfilePic(e){
        e.preventDefault()

        const data = new FormData()
        
        data.append("profile_pic", e.target.files[0])

        fetch(`/users/${user.id}`, {
            method: 'PATCH',
            body: data
        }).then(res=>res.json())
        .then(res=>{
            console.log(res)
            setProfile(res)})
    }

    function handleNewLink(e){
        setNewLink({...newLink, [e.target.name]: e.target.value})
    }

    function submitNewLink(e){
        e.preventDefault()
        if(newLink.url !== ""){
            fetch('/links',{
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(newLink)
            }).then(res=>res.json())
            .then(data=>setLinks([...links, data]))
        }
    }

    function handleRemoveLink(badLink){
        fetch(`/links/${badLink.id}`,{
            method: "DELETE",
            headers: {"Content-Type":"application/json"}
        })
        .then(setLinks(links.filter(link=>{return link.id !== badLink.id})))
    }

    return(
    <div className="profile-container">
        {(user?(artist.id === user.id):false)?
        edit?
        <button className="edit-button" onClick={handleSave}>Save Changes</button>:
        <button className="edit-button" onClick={()=>setEdit(true)}>Edit Profile</button>
        :<div className="profile-header"></div>}
        {edit?
        <form className="profile-form">
            <label>Artist Name: </label>
            <input type="text" name="artist_name" value={profile.artist_name} onChange={handleChange}></input>
            <br />
            <img className="profile-pic" src={profile.profile_pic_url}/>
            <label>Profile Pic: </label>
            <input onChange={submitProfilePic} type="file"></input>
            <br />
            <label>Profile url: </label>
            <input type="text" name="url" value={profile.url} onChange={handleChange}></input>
            <br />
            <label>Links:</label>
            {artist.links.map(link=><div><p>{link.name} : {link.url}</p><button onClick={()=>handleRemoveLink(link)}>Delete</button></div>)}
            <div><p>Add new link:</p>
            <label>Name:</label>
            <input type="text" name="name" onChange={handleNewLink} value={newLink.name}></input>
            <br />
            <label>Url:</label>
            <input type="text" name="url" onChange={handleNewLink} value={newLink.url}></input>
            <button onClick={submitNewLink}>Add</button>
            </div>
            <br />
            <label className="update-bio-label">Bio: </label>
            <br />
            <textarea className="update-bio" type="text" name="bio" value={profile.bio} onChange={handleChange}></textarea>
            
        </form>:
        <div>
            <img className="profile-pic" src={profile.profile_pic_url}/>
            <div className="profile-links">{links.map(link=><div className="profile-link">{<a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a>}</div>)}</div>
            <div className="profile-bio">{profile.bio}</div>
        </div>}

    </div>)
}

export default Profile