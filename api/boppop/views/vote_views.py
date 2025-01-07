from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ..models import Vote, Playlist, Song
from ..serializers import VoteSerializer, SongSerializer  # Import SongSerializer if needed

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_vote(request):
    user = request.user

    # Check if there is an active playlist with a contest
    try:
        active_playlist = Playlist.objects.get(active=True, contest=True)
    except Playlist.DoesNotExist:
        return Response({'error': 'No active playlist with a contest found.'}, status=status.HTTP_404_NOT_FOUND)

    # Extract the submitted song from the request data
    song_id = request.data.get('song_id')
    if not song_id:
        return Response({'error': 'Song ID is required in the request data.'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if a vote object already exists for the current playlist and artist
    vote, created = Vote.objects.get_or_create(artist=user.artist_profile, playlist=active_playlist)

    # Update the song field if there's already a vote object
    if not created:
        # Check if the submitted song ID exists
        try:
            song = Song.objects.get(pk=song_id)
        except Song.DoesNotExist:
            return Response({'error': 'The specified song does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        vote.song = song

    # Validate the Vote object
    serializer = VoteSerializer(vote)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
