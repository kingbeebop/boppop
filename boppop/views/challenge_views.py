from ..models import Playlist, Song
from ..serializers import SongSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.decorators import login_required

@api_view(["GET"])
def get_challenge(request):
    try:
        current_playlist = Playlist.objects.get(active=True)
        data = {
            "contest": current_playlist.contest,
            "playlist_id": current_playlist.id,
            "winner": current_playlist.winner,
            "theme": current_playlist.theme,
            "number": current_playlist.number,
        }
        return Response(data, status=status.HTTP_200_OK)
    except Playlist.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

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
        return Response({'status': status.HTTP_204_NO_CONTENT, 'message': 'No submission found for the current playlist'}, status=status.HTTP_404_NOT_FOUND)