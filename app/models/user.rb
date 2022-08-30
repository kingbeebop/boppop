class User < ApplicationRecord
    has_secure_password

    after_commit :add_default_profile_pic, on: [:create, :update]



    validates :username, presence: true, uniqueness: true, format: { with: /\A[a-zA-Z0-9]+\Z/ }
    validates :email, presence: true, uniqueness: true
    # validates :url, uniqueness: true, format: { with: /\A[a-zA-Z0-9]+\Z/ }
    # validates :url, url: true

    has_many :songs
    has_many :playlists, through: :songs
    has_many :comments
    has_many :links
    has_many :votes
    has_one_attached :profile_pic

    # def profile_image_url
    #     profile_pic.url
    # end
    def profile_pic_url
        Rails.application.routes.url_helpers.url_for(profile_pic) if profile_pic.attached?
    end

    def add_default_profile_pic
        unless profile_pic.attached?
          self.profile_pic.attach(io: File.open("#{Rails.root}/public/Default-Profile-Pic.png"), filename: 'Default-Profile-Pic.png', content_type: 'image/png')
        end
    end
      
end
