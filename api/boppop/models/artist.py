from django.db import models
from django.contrib.auth.models import AbstractUser

class Artist(AbstractUser):
    name = models.CharField(max_length=200)
    bio = models.CharField(max_length=2000, null=True, blank=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    def __str__(self):
        return self.name