import React from 'react'

function Playhead({song, autoplay = true}){

    return(
        <div className="playhead">
<iframe title={song.id} width="100%" height="166" scrolling="no" frameBorder="no" allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=${song.url}&amp;{ auto_play=${autoplay} }`}>
        </iframe>
        </div>
    )
}

export default Playhead