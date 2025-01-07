from django.db import models

class Playlist(models.Model):
    number = models.IntegerField(default=0)
    theme = models.CharField(max_length=200, null=True, blank=True)
    date = models.DateField()
    active = models.BooleanField(default=True)
    contest = models.BooleanField(default=False)
    winner = models.ForeignKey('Song', on_delete=models.SET_NULL, null=True, blank=True, related_name='+')

    def __str__(self):
        return f"Bop Pop {self.number} - \"{self.theme}\""
