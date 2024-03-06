from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Artist, Playlist, Song, Vote, Review

class ArtistAdmin(UserAdmin):
    # Define the fields you want to display in the list view
    list_display = ('username', 'email', 'name', 'is_staff', 'bio')


admin.site.register(Artist, ArtistAdmin)
admin.site.register(Playlist)
admin.site.register(Song)
admin.site.register(Vote)
admin.site.register(Review)