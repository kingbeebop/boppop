import React, {useState, useEffect} from 'react'

function Comment({comment}){

    return(<div>
        <div className="comment-header">{comment.user.artist_name}</div>
        <div className="comment-body">{comment.content}</div>
    </div>)
}

export default Comment