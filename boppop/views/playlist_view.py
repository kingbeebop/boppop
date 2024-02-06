from boppop.models import Playlist
from boppop.serializers import PlaylistSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


#/playlists/
@api_view(["GET", "POST"])
def playlist_list(request):
    if request.method == "GET":
        playlists = Playlist.objects.all()
        serializer = PlaylistSerializer(playlists, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = PlaylistSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        else:
            return Response({'status': status.HTTP_400_BAD_REQUEST, 'error': serializer.errors})
        
#/playlists/id
@api_view(["GET", "PUT", "DELETE"])
def playlist_detail(request, id):

    try:
        playlist = Playlist.objects.get(pk=id)
    except Playlist.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = PlaylistSerializer(playlist)
        return Response(serializer)

    elif request.method == "PUT":

        serializer = PlaylistSerializer(playlist, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        playlist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
#/playlists/current
@api_view(["GET"])
def current_playlist(request):
    playlist = Playlist.objects.all().last()
    serializer = PlaylistSerializer(playlist)
    return Response(serializer)