from rest_framework import serializers
from boppop.models import Playlist, Song

class PlaylistSerializer(serializers.ModelSerializer):
    songs = serializers.SerializerMethodField()

    def get_songs(self, obj):
        # Get the list of songs for the current playlist and serialize them
        songs = Song.objects.filter(playlist=obj)
        serializer = SimpleSongSerializer(songs, many=True)
        return serializer.data

    class Meta:
        model = Playlist
        fields = ['id', 'number', 'theme', 'date', 'contest', 'active', 'songs']

class SimpleSongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['id', 'title', 'url', 'artist']