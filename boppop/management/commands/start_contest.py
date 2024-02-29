from django.core.management.base import BaseCommand
from boppop.models import Playlist

class Command(BaseCommand):
    help = 'Starts a contest by setting the active playlist to contest mode.'

    def handle(self, *args, **options):
        try:
            # Get the active playlist
            active_playlist = Playlist.objects.get(active=True)

            # Set contest to True
            active_playlist.contest = True
            active_playlist.save()

            self.stdout.write(self.style.SUCCESS('Contest started successfully.'))

        except Playlist.DoesNotExist:
            self.stdout.write(self.style.ERROR('No active playlist found.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'An error occurred: {str(e)}'))
