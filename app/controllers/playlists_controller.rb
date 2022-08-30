class PlaylistsController < ApplicationController
  before_action :set_playlist, only: %i[ show update destroy ]

  # GET /playlists
  def index
    @playlists = Playlist.all.order(number: :desc)

    render json: @playlists
  end

  # GET /playlists/1
  def show
    render json: @playlist
  end

  #GET /winner
  def winner
    if Playlist.current_playlist.winner
      render json: {id: Playlist.current_playlist.winner}
    else
      render json: {id: 0}
    end
  end

  #GET /current
  def current
    # playlist = Playlist.find_by current: true
    render json: Playlist.current_playlist
  end

  #GET /contest
  def contest
    playlist = Playlist.find_by contest: true
    if(playlist)
      render json: playlist
    else
      render json: false
    end
  end

  #GET /previous
  def previous
    playlist = Playlist.find_by previous: true
    render json: playlist
  end

  # POST /playlists
  def create
    if Playlist.current_playlist.winner === session[:user_id]
      Playlist.previous_playlist.update(previous: false)
      Playlist.current_playlist.update(current: false, contest: false, previous: true)
      @playlist = Playlist.new(theme: playlist_params[:theme], current: true, previous: false, pending: false, contest: false, winner: nil, number: (Playlist.previous_playlist.number + 1))
      if @playlist.save
        render json: @playlist, status: :created
      else
        render json: @playlist.errors, status: :unprocessable_entity
      end
    end
  end

  # PATCH/PUT /playlists/1
  def update
    if @playlist.update(playlist_params)
      render json: @playlist
    else
      render json: @playlist.errors, status: :unprocessable_entity
    end
  end

  # DELETE /playlists/1
  def destroy
    @playlist.destroy
  end

  private

    def authorize
      return render json: { error: "Not authorized" }, status: :unauthorized unless session.include? :user_id
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_playlist
      @playlist = Playlist.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def playlist_params
      params.permit(:theme, :number, :winner, :video, :url, :contest, :previous, :current, :pending)
    end
end
