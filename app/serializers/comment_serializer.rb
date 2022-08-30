class CommentSerializer < ActiveModel::Serializer
  attributes :id, :user, :playlist, :content

  belongs_to :user
  belongs_to :playlist
end
