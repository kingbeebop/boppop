import os
import django
from django.utils import timezone

# Configure Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "boppop.settings")  # Replace "your_project.settings" with your actual settings module
django.setup()

# Import Playlist from boppop.models.playlist after Django setup
from boppop.models import Playlist, Song

# Create a new Playlist object for testing
def create_test_playlist():
    # Assuming the current date is desired for the new playlist
    current_date = timezone.now().date()

    # Create a new Playlist object with specific values
    new_playlist = Playlist.objects.create(
        number=1,
        theme='Test',
        date=current_date,
        active=True,
        contest=False,
    )

    # Access attributes of the new Playlist object
    print(new_playlist.number)  # Output: 1
    print(new_playlist.theme)   # Output: Test

    # Save the new Playlist object to the database (if necessary)
    new_playlist.save()

def delete_all_songs():
    songs = Song.objects.all()
    for song in songs:
        song.delete()

# Entry point to run the script
if __name__ == "__main__":
    # Call the function to create the test Playlist object
    delete_all_songs()
