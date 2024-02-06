from boppop.models import Artist
from boppop.serializers import ArtistSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

#/artists/
@api_view(["GET", "POST"])
def artist_list(request):
    if request.method == "GET":
        artists = Artist.objects.all()
        serializer = ArtistSerializer(artists, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = ArtistSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        else:
            return Response({'status': status.HTTP_400_BAD_REQUEST, 'error': serializer.errors})
        
#/artists/id
@api_view(["GET", "PUT", "DELETE"])
def artist_detail(request, id):

    try:
        artist = Artist.objects.get(pk=id)
    except Artist.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = ArtistSerializer(artist)
        return Response(
            {"inbox_artist": serializer.data, "token": artist.client.token}
        )

    elif request.method == "PUT":

        serializer = ArtistSerializer(artist, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        artist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)