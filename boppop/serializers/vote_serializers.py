from rest_framework import serializers
from ..models import Vote

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'artist', 'song', 'playlist']
        read_only_fields = ['id']
