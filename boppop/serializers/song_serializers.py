from rest_framework import serializers
from models import Song

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['id', 'title', 'soundcloud_url', 'playlist_id', 'votes']