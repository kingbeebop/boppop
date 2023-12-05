from rest_framework import serializers
from boppop.models.playlist import Playlist

class PlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields = ['id', 'theme', 'date']
