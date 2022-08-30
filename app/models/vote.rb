class Vote < ApplicationRecord

    belongs_to :user
    belongs_to :song
    belongs_to :playlist
    
end
