from django.db import models

class Vote(models.Model):
    artist = models.ForeignKey('Artist', on_delete=models.CASCADE)
    song = models.ForeignKey('Song', on_delete=models.CASCADE)
    playlist = models.ForeignKey('Playlist', on_delete=models.CASCADE)

    class Meta:
        unique_together = ['artist', 'playlist']

    def __str__(self):
        return f"{self.artist.username} voted for {self.song.title} in {self.playlist.name}"