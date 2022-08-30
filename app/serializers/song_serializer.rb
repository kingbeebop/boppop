class SongSerializer < ActiveModel::Serializer
  attributes :id, :name, :url, :late, :user

  belongs_to :user
  belongs_to :playlist
end
