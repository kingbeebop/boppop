# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
puts "Seeding database..."

u1 = User.create(username: "test", artist_name: "the Great Bingbong", email: "test@test.com", password: "test", bio: "testing...", url: "bingbong")
u2 = User.create(username: "1234", artist_name: "floopy doopy", email: "1234@test.com", password: "1234", bio: "1234", url: "test")
u3 = User.create(username: "newtest", artist_name: "Blizblorp McDoogleson", email: "defin@dorg.net", password: "password", bio: "testing", url: "okay")
u4 = User.create(username: "dog", artist_name: "Slashrrr", email: "dorpn@dorg.net", password: "password", bio: "testing", url: "astring")
u5 = User.create(username: "cat", artist_name: "Dog", email: "dezzzzzfin@dorg.net", password: "password", bio: "testing", url: "afterward")
u6 = User.create(username: "whistle", artist_name: "Bljfsoooooo", email: "defffffin@dorg.net", password: "password", bio: "testing", url: "whoopwhoop")

Playlist.create(theme: "testing previous", number: 1, winner: User.ids.first, video: "...", url: "...", current: false, previous: true, contest: false)
Playlist.create(theme: "testing current", number: 2, winner: nil, video: "...", url: "...", current: true, previous: false, contest: false)

Song.create(name: "Farewell", url: "https://soundcloud.com/brendan-ward-788651503/farewell", late: false, playlist_id: Playlist.ids.first, user_id: u1.id)
Song.create(name: "Testing", url: "https://soundcloud.com/bingofbong/red-eye", late: false, playlist_id: Playlist.ids.first, user_id: u2.id)
Song.create(name: "testing previous", url: "https://soundcloud.com/gromeruli/ooze", late: false, playlist_id: Playlist.ids.last, user_id: u3.id)
Song.create(name: "2nd previous", url: "https://soundcloud.com/gromeruli/h0w2r3s3t", late: false, playlist_id: Playlist.ids.last, user_id: u2.id)
Song.create(name: "Take a Walk", url: "https://soundcloud.com/trent-mcalister-604683423/take-a-walk", late: false, playlist_id: Playlist.ids.last, user_id: u1.id)
Song.create(name: "Trans", url: "https://soundcloud.com/trent-mcalister-604683423/trans", late: false, playlist_id: Playlist.ids.last, user_id: u4.id)
Song.create(name: "B.E.E.", url: "https://soundcloud.com/trent-mcalister-604683423/bee", late: false, playlist_id: Playlist.ids.last, user_id: u5.id)
Song.create(name: "I'm Just!", url: "https://soundcloud.com/trent-mcalister-604683423/im-just", late: false, playlist_id: Playlist.ids.last, user_id: u6.id)
Song.create(name: "Hell Aint So Bad Once You Get Used To It", url: "https://soundcloud.com/trent-mcalister-604683423/hell-aint-so-bad-once-you-get-used-to-it", late: false, playlist_id: Playlist.ids.first, user_id: u3.id)

Comment.create(content: "testing out comments", user_id: User.ids.sample, playlist_id: Playlist.ids.first)
Comment.create(content: "test 1 2 3 4 Wall Street Webcasting, New York, NY — Webcast Technician
JANUARY 2018 - PRESENT
Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh.
IPOS, New York, NY — Programmer and Technical Specialist
MAY 2013 - MAY 2017
Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh.
EDUCATION
Flatiron School, New York, NY — Fullstack Engineering
MAY 2022 - AUGUST 2022
Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore.
New York University, New York, NY — Computer Science
SEPTEMBER 2008 - MAY 2013
Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam.
", user_id: User.ids.sample, playlist_id: Playlist.ids.first)