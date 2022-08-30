class PlaylistSerializer < ActiveModel::Serializer
  attributes :id, :number, :theme, :winner, :video, :url, :current, :previous, :contest, :pending

  has_many :songs
  has_many :users, through: :songs
  has_many :comments
  has_many :votes, through: :songs
end
