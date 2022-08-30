class LinkSerializer < ActiveModel::Serializer
  attributes :id, :name, :url, :user_id
end
