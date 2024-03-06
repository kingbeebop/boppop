from boppop.models import Playlist
from boppop.serializers import PlaylistSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from rest_framework.pagination import PageNumberPagination


#/playlists/
@api_view(["GET", "POST"])
def playlist_list(request):
    # Pagination
    paginator = PageNumberPagination()
    paginator.page_size = 10  # Set the number of items per page

    if request.method == "GET":
        playlists = Playlist.objects.all()

        # Searching by name
        name_query = request.GET.get('name', None)
        if name_query:
            playlists = playlists.filter(name__icontains=name_query)

        result_page = paginator.paginate_queryset(playlists, request)
        serializer = PlaylistSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

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
    try:
        playlist = Playlist.objects.get(active=True)
        serializer = PlaylistSerializer(playlist)
        return Response(serializer.data)
    except Playlist.DoesNotExist:
        response_data = {
            'status': 'no_active_playlist',
            'message': 'No active playlist found.',
        }
        return JsonResponse(response_data)