from boppop.models import Song, Playlist, Artist
from boppop.serializers import SongSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.decorators import login_required

#/songs/
@api_view(["GET", "POST"])
def song_list(request):
    if request.method == "GET":
        songs = Song.objects.all()
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        # Check if the user is authenticated (logged in)
        if not request.user.is_authenticated:
            return Response({'status': status.HTTP_403_FORBIDDEN, 'error': 'Login required for this action'})
        else:
            artist = Artist.objects.get(pk=request.user.id)

        # Check for required parameters in the request data
        if 'url' not in request.data or 'title' not in request.data:
            return Response({'status': status.HTTP_400_BAD_REQUEST, 'error': 'Missing required parameters'})
        else:
            title = request.data['title']
            url = request.data['url']

        # Get the current week's playlist
        current_playlist = Playlist.objects.get(active=True)

        if not current_playlist:
            return Response(status=status.HTTP_204_NO_CONTENT)

        # Check if the artist has already submitted a song for the current playlist
        existing_song = Song.objects.filter(artist=artist, playlist=current_playlist).first()

        if existing_song:
            # Update existing song's title and url
            existing_song.title = title
            existing_song.url = url
            existing_song.save()
            serializer = SongSerializer(existing_song)
            return Response(serializer.data)
        else:
            # Create a new song object
            data = {'url': url, 'title': title, 'artist': artist.id, 'playlist': current_playlist.id}
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

@api_view(["GET"])
@login_required
def get_submission(request):
    # Check if the user is logged in
    if not request.user.is_authenticated:
        return Response({'status': status.HTTP_403_FORBIDDEN, 'error': 'Login required for this action'}, status=status.HTTP_403_FORBIDDEN)

    # Get the current active playlist
    try:
        current_playlist = Playlist.objects.get(active=True)
    except Playlist.DoesNotExist:
        return Response({'status': status.HTTP_404_NOT_FOUND, 'error': 'No active playlist found'}, status=status.HTTP_404_NOT_FOUND)

    # Check if the user has submitted a song for the current playlist
    try:
        submission = Song.objects.get(artist=request.user, playlist=current_playlist)
        serializer = SongSerializer(submission)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Song.DoesNotExist:
        return Response({'status': status.HTTP_404_NOT_FOUND, 'message': 'No submission found for the current playlist'}, status=status.HTTP_404_NOT_FOUND)