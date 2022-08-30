class CommentsController < ApplicationController
  before_action :set_comment, only: %i[ show update destroy ]
  # skip_before_action :authorize, only: [:currentcomment]

  # GET /comments
  def index
    @comments = Comment.all

    render json: @comments
  end

  # GET /comments/1
  def show
    render json: @comment
  end

  # GET /currentcomment
  def currentcomment
    comment = Comment.find_by(playlist_id: Playlist.find_by(current: true).id, user_id: session[:user_id])
    if comment
      render json: comment
    else
      render json: false
    end
  end

  # POST /comments
  def create
    @comment = Comment.new(content: comment_params[:content], user_id: session[:user_id], playlist_id: Playlist.find_by(current: true).id)

    if @comment.save
      render json: @comment, status: :created, location: @comment
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /comments/1
  def update
    if @comment.update(comment_params)
      render json: @comment
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  # DELETE /comments/1
  def destroy
    @comment.destroy
  end

  private

  def authorize
    return render json: { error: "Not authorized" }, status: :unauthorized unless session.include? :user_id
  end

    # Use callbacks to share common setup or constraints between actions.
  def set_comment
    @comment = Comment.find(params[:id])
  end

    # Only allow a list of trusted parameters through.
  def comment_params
    params.permit(:user_id, :playlist_id, :content)
  end
end
