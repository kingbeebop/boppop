from django.db import models

class Vote(models.Model):
    user = models.ForeignKey('Artist', on_delete=models.CASCADE)
    song = models.ForeignKey('Song', on_delete=models.CASCADE)
    playlist = models.ForeignKey('Playlist', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['artist', 'playlist']

    def __str__(self):
        return f"{self.user.username} voted for {self.song.title} in {self.playlist.name}"