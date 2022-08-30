class VotesController < ApplicationController
  before_action :set_vote, only: %i[ show update destroy ]
  # skip_before_action :authorize, only: [:currentvote]

  # GET /votes
  def index
    @votes = Vote.all

    render json: @votes
  end

  # GET /votes/1
  def show
    render json: @vote
  end

  # GET /currentvote
  def currentvote
    vote = Vote.find_by(playlist_id: Playlist.find_by(current: true).id, user_id: session[:user_id])
    render json: vote
  end

  # POST /votes
  def create
    @vote = Vote.new(song_id: params[:song_id], user_id: session[:user_id], playlist_id: Playlist.find_by(current: true).id, contestant: false)

    if @vote.save
      render json: @vote, status: :created
    else
      render json: @vote.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /votes/1
  def update
    if @vote.update(vote_params)
      render json: @vote
    else
      render json: @vote.errors, status: :unprocessable_entity
    end
  end

  # DELETE /votes/1
  def destroy
    @vote.destroy
  end

  private

  def authorize
    return render json: { error: "Not authorized" }, status: :unauthorized unless session.include? :user_id
  end

    # Use callbacks to share common setup or constraints between actions.
    def set_vote
      @vote = Vote.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def vote_params
      params.permit(:user_id, :song_id, :playlist_id, :contestant)
    end
end
