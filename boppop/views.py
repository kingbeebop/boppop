from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import requests
from django.views.generic import RedirectView
from social_django.utils import load_backend, load_strategy
import os
from dotenv import load_dotenv

def index(request):
    return render(request, 'index.html')