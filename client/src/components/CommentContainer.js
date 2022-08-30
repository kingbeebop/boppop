import React, {useState, useEffect} from 'react'
import Comment from './Comment'

function CommentContainer({playlist}){


    return(<div className="comment-container">
        {playlist.comments.map(comment=><Comment key={comment.id} comment={comment} />)}
    </div>)
}

export default CommentContainer