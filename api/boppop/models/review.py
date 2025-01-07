from django.db import models

class Review(models.Model):
    body = models.CharField(max_length=20000)
    playlist = models.ForeignKey('Playlist', on_delete=models.CASCADE)
    artist = models.ForeignKey('Artist', on_delete=models.CASCADE)

    class Meta:
        unique_together = ['artist', 'playlist']

    def __str__(self):
        return f"{self.user} review for {self.playlist}"