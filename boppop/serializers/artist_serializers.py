from rest_framework import serializers
from boppop.models.artist import Artist

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = ['id', 'username', 'name', 'bio', 'profile_pic']