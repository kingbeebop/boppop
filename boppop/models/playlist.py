from django.db import models

class Playlist(models.Model):
    theme = models.CharField(max_length=200)
    date = models.DateField()

    def __str__(self):
        return self.theme