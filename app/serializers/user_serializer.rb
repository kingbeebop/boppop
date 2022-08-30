class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :artist_name, :email, :password_digest, :bio, :url, :profile_pic_url

  has_many :songs
  has_many :playlists, through: :songs
  has_many :comments
  has_many :links
end
