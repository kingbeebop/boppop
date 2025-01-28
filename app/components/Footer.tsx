import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Playhead from './Playhead';

const Footer: React.FC = () => {
  const selectedSongId = useSelector((state: RootState) => state.songs.selectedSongId);
  const selectedSong = useSelector((state: RootState) => 
    selectedSongId ? state.songs.byId[selectedSongId] : null
  );

  if (!selectedSong) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', bottom: 0, width: '100%', height: '166px', backgroundColor: '#1a202c', zIndex: 50 }} className="flex justify-center items-center">
      <Playhead song={selectedSong} autoplay={true} />
    </div>
  );
};

export default Footer;