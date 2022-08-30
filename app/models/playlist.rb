class Playlist < ApplicationRecord
    has_many :songs
    has_many :users, through: :songs
    has_many :votes
    has_many :comments

    def self.current_playlist
        playlist = self.find_by(current: true)
        return playlist
    end

    def self.previous_playlist
        playlist = self.find_by(previous: true)
        return playlist
    end

    def self.start_mercy
        current_playlist.update(pending: true)
    end

    def self.start_contest
        current_playlist.update(contest: true)
    end

    def self.end_contest
        results = []
        current_playlist.songs.each do |song|
            votes = 0
            song.votes.each do |vote|
                if vote.contestant === true
                    votes += 2
                else
                    votes += 1
                end
            end
            results << {song: song, votes: votes}
        end
        winner = results.max_by { |result| result[:votes] }[:song][:user_id]
        current_playlist.update(winner: winner)
    end

end
