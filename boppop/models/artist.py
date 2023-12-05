from django.db import models
from django.contrib.auth.models import AbstractUser

class Artist(AbstractUser):
    name = models.CharField(max_length=200)
    bio = models.CharField(max_length=2000)
    profile_pic = models.CharField(max_length=255)

    def __str__(self):
        return self.name