from boppop.models import Artist
from boppop.serializers import ArtistSerializer
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'artist_name': user.artist.name if hasattr(user, 'artist') else None,
        'bio': user.artist.bio if hasattr(user, 'artist') else None,
        'profile_pic': user.artist.profile_pic.url if hasattr(user, 'artist') and user.artist.profile_pic else None,
    }
    return Response(user_data)

#/artists/
@api_view(["GET", "POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def artist_list(request):
    if request.method == "GET":
        # Get query parameters for pagination and search
        page = request.GET.get("page", 1)
        search_query = request.GET.get("search", "")

        # Filter artists based on search query
        artists = Artist.objects.filter(Q(name__icontains=search_query))

        # Use Django REST framework's PageNumberPagination
        paginator = PageNumberPagination()
        paginator.page_size = 10  # Set the desired page size
        paginated_artists = paginator.paginate_queryset(artists, request)

        # Serialize the paginated artists
        serializer = ArtistSerializer(paginated_artists, many=True)

        # Return paginated response
        return paginator.get_paginated_response(serializer.data)

    elif request.method == "POST":
        serializer = ArtistSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({'status': status.HTTP_400_BAD_REQUEST, 'error': serializer.errors})
        
#/artists/id
@api_view(["GET", "PUT", "DELETE"])
@authentication_classes([])
@permission_classes([AllowAny])
def artist_detail(request, id):

    try:
        artist = Artist.objects.get(pk=id)
    except Artist.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = ArtistSerializer(artist)
        return Response(serializer.data)

    elif request.method == "PUT":

        serializer = ArtistSerializer(artist, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        artist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)