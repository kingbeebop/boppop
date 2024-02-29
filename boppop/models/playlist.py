from django.db import models

class Playlist(models.Model):
    theme = models.CharField(max_length=200, null=True, blank=True)
    date = models.DateField()
    contest = models.BooleanField()

    def __str__(self):
        return self.theme