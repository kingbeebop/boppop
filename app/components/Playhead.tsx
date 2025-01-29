import React from 'react';
import { Song } from '../types';

interface PlayheadProps {
  song: Song;
}

const Playhead: React.FC<PlayheadProps> = ({ song }) => {
  return (
    <div className="playhead">
      <iframe
        title={song.title}
        width="100%"
        height="166"
        allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=${song.url}&amp;auto_play=true`}
      ></iframe>
    </div>
  );
};

export default Playhead;