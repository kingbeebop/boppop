from django.db import models
from models import Playlist, Artist

class Song(models.Model):
    title = models.CharField(max_length=200)
    url = models.CharField(max_length=200, default="Enter API Key Here")
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    votes = models.IntegerField(default=0)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)

    def __str__(self):
        return self.title