class UsersController < ApplicationController
  before_action :set_user, only: [:update, :destroy]
  before_action :authorize, only: [:show]

  # GET /users
  def index
    @users = User.all.order(artist_name: :desc)

    render json: @users
  end

  # #GET /artist/1
  # def display
  #   user = User.find_by(id: params[:id])
  #   render json: user
  # end

  #GET /artist/url
  def display
    user = User.find_by(url: params[:url])
    render json: user
  end

  # GET /me
  def show
    user = User.find_by(id: session[:user_id])
    render json: user
  end

    # GET /discography/
  def discography
    playlist = Song.where(user_id: params[:id])
    render json: playlist
  end

  #GET profile pic url /profile_pic/:id
  def profile_pic
    user = User.find(params[:id])
    render json: user.with_attached_attachment
  end

  # GET /artist/:id/playlist
  # def playlist
  #   playlist = Song.find_by(user_id: this.id)
  #   render json: playlist
  # end

  # POST /users
  def create
    # default_profile_pic = "/public/Default-Profile-Pic.png"

    @user = User.new(user_params)
    @user.artist_name = user_params[:username]
    @user.url = user_params[:username]
    # @user.profile_pic.attach(io: File.open("#{Rails.root}/public/Default-Profile-Pic.png"), filename: 'Default-Profile-Pic.png', content_type: 'image/png')

    if @user.save
      render json: @user, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  def update
    if(params[:profile_pic])
      @user.profile_pic.attach(params[:profile_pic])
    end
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  def destroy
    @user.destroy
  end

  def start
    #curl "https://api.soundcloud.com/me" \
    # -H "accept: application/json; charset=utf-8" \
    # -H "Authorization: OAuth ACCESS_TOKEN"
    faraday.get()
  end

  private

    def authorize
      return render json: { error: "Not authorized" }, status: :unauthorized unless session.include? :user_id
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.permit(:username, :artist_name, :password, :password_confirmation, :bio, :email, :url, :profile_pic)
    end
end
