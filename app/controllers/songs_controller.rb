class SongsController < ApplicationController
  before_action :set_song, only: %i[ show update destroy ]

  # GET /songs
  def index
    @songs = Song.all

    render json: @songs
  end

  # GET /songs/1
  def show
    render json: @song, include: :user
  end

  # POST /songs
  def create
    
    @song = Song.new(name: song_params[:name], url: song_params[:url], user_id: session[:user_id], playlist: Playlist.find_by(current: true), late: false)

    if @song.save
      render json: @song, status: :created
    else
      render json: @song.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /songs/1
  def update
    if @song.update(song_params)
      render json: @song
    else
      render json: @song.errors, status: :unprocessable_entity
    end
  end

  # DELETE /songs/1
  def destroy
    @song.destroy
  end

  # GET /submission
  def submission
    @song = Song.find_by(user_id: session[:user_id], playlist_id: Playlist.current_playlist.id)
    if @song
      render json: @song
    else
      render json: false
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_song
      @song = Song.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def song_params
      params.permit(:name, :url, :late, :playlist_id, :user_id)
    end
end
