# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever
set :environment, "development"

every :tuesday, at: '8:00 pm' do
    ###initial creation of playlist, updating to contest mode, initiate grace period
    #set current playlist to contest = true
    #push voting to main page
    #push zoom chat link???
    runner "Playlist.mercy"
end

every :tuesday, at: '8:30 pm' do
    ###end grace period
    #set incoming late = true
    #turn off submissions (only works if current = true)
    runner "Playlist.start_contest"
end

every :wednesday, at: '4:00 pm' do
     ###tally votes, create next playlist, update playlists
     #for each song in playlist, compare votes (double vote for entrants)
     #if tie, break tie (randomizer?)
     #create new unthemed playlist, pending =  true
     #push winner announcement to main page (if pending, display waiting for theme message)
     #push set theme splash to winner
     #email winner to visit the site
     ###to do: create splash page that PATCHES pending playlist theme = state, pending = false, current = true
     runner "Playlist.end_contest"
end

# testing:
# every :wednesday, at: '12:19 pm' do
#     runner "Playlist.start_contest"
# end