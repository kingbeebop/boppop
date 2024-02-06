from boppop.models import Song
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

    if request.method == "POST":
        serializer = SongSerializer(data=request.data)

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
