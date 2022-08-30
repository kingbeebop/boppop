class Song < ApplicationRecord
    # validates :click_through_url, url: true


    belongs_to :user
    belongs_to :playlist
    has_many :votes

    validates :url, presence: true, uniqueness: true
    validates :user_id, presence: true, uniqueness: { scope: :playlist }
end
