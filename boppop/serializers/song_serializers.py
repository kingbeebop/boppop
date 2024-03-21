from rest_framework import serializers
from boppop.models.song import Song

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['id', 'title', 'url', 'artist', 'playlist']