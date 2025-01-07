from django.core.management.base import BaseCommand
from boppop.models import Playlist, Vote, Song
from random import shuffle

class Command(BaseCommand):
    help = 'Ends a contest by determining the winner based on votes.'

    def handle(self, *args, **options):
        try:
            # Get the playlist in contest mode
            contest_playlist = Playlist.objects.get(contest=True)
            
            # Create a hashmap of Song objects with their vote count
            song_vote_count = {}
            for song in contest_playlist.songs.all():
                # Initialize vote count
                vote_count = Vote.objects.filter(song=song).count()

                # If Vote.artist exists among Song.artists, double the vote count
                for vote in Vote.objects.filter(song=song):
                    if vote.artist in song.artists.all():
                        vote_count += 1

                song_vote_count[song] = vote_count

            # Find the song(s) with the most votes
            max_votes = max(song_vote_count.values())
            tied_songs = [song for song, votes in song_vote_count.items() if votes == max_votes]
            shuffle(tied_songs)
            winning_song = tied_songs[0]

            # Set the playlist winner
            contest_playlist.winner = winning_song

            # Update the winning song
            winning_song.is_winner = True
            winning_song.save()

            # Update the playlist
            contest_playlist.active = False
            contest_playlist.contest = False
            contest_playlist.save()

            self.stdout.write(self.style.SUCCESS(f'Contest ended successfully. Winner: {winning_song.title}'))

        except Playlist.DoesNotExist:
            self.stdout.write(self.style.ERROR('No playlist in contest mode found.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'An error occurred: {str(e)}'))