class VoteSerializer < ActiveModel::Serializer
  attributes :id, :user, :song, :playlist, :contestant

  belongs_to :user
  belongs_to :song
  has_one :playlist
end
