from boppop.models import Song, Playlist
from boppop.serializers import SongSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


#/songs/
@api_view(["GET", "POST"])
def song_list(request):
    if request.method == "GET":
        songs = Song.objects.all()
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        # Check for required parameters in the request data
        if 'url' not in request.data or 'title' not in request.data:
            return Response({'status': status.HTTP_400_BAD_REQUEST, 'error': 'Missing required parameters'})

        # Check if the logged-in user is an Artist
        if not hasattr(request.user, 'artist'):
            return Response({'status': status.HTTP_403_FORBIDDEN, 'error': 'Only artists can create songs'})

        # Get the current week's playlist
        current_playlist = Playlist.objects.order_by('-created_at').first()

        # Check if the artist has already submitted a song for the current playlist
        existing_song = Song.objects.filter(artist=request.user.artist, playlist=current_playlist).first()

        if existing_song:
            # Update existing song's title and url
            existing_song.title = request.data['title']
            existing_song.url = request.data['url']
            existing_song.save()
            serializer = SongSerializer(existing_song)
            return Response(serializer.data)
        else:
            # Create a new song object
            data = {'url': request.data['url'], 'title': request.data['title'], 'artist': request.user.artist.id, 'playlist': current_playlist.id}
            serializer = SongSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response({'status': status.HTTP_400_BAD_REQUEST, 'error': serializer.errors})
#/artists/id
@api_view(["GET", "PUT", "DELETE"])
def song_detail(request, id):

    try:
        song = Song.objects.get(pk=id)
    except Song.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = SongSerializer(song)
        return Response(
            {"inbox_artist": serializer.data, "token": song.client.token}
        )

    elif request.method == "PUT":

        serializer = SongSerializer(song, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        song.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
