from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
import datetime
import re
from rest_framework.response import Response
from rest_framework import status
import requests
import json
import os
#from django.core.mail import send_mail
from dotenv import load_dotenv

load_dotenv()

class Artist(AbstractUser):
    bio = models.CharField(max_length=2000)
    profile_pic = models.CharField(max_length=255)

    def __str__(self):
        return self.username
    
class Playlist(models.Model):
    theme = models.CharField(max_length=200)
    date = models.DateField(default=datetime.datetime.now())

    def __str__(self):
        return self.theme
    
class Song(models.Model):
    name = models.CharField(max_length=200)
    soundcloud_url = models.CharField(max_length=200, default="Enter API Key Here")
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    votes = models.IntegerField(default=0)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)

    def __str__(self):
        return self.name