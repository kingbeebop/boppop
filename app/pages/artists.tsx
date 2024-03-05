import ArtistList from '../components/ArtistList';
import { fetchArtists } from '../utils/api';

const ArtistsPage: React.FC = ({ artists }) => {
  return <ArtistList artists={artists} />;
};

export async function getServerSideProps() {
  try {
    const artists = await fetchArtists();
    return { props: { artists } };
  } catch (error) {
    console.error('Error fetching artists:', error);
    return { props: { artists: [] } };
  }
}

export default ArtistsPage;