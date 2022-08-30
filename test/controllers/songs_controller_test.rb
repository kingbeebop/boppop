require "test_helper"

class SongsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @song = songs(:one)
  end

  test "should get index" do
    get songs_url, as: :json
    assert_response :success
  end

  test "should create song" do
    assert_difference("Song.count") do
      post songs_url, params: { song: { late: @song.late, name: @song.name, playlist_id: @song.playlist_id, url: @song.url, user_id: @song.user_id } }, as: :json
    end

    assert_response :created
  end

  test "should show song" do
    get song_url(@song), as: :json
    assert_response :success
  end

  test "should update song" do
    patch song_url(@song), params: { song: { late: @song.late, name: @song.name, playlist_id: @song.playlist_id, url: @song.url, user_id: @song.user_id } }, as: :json
    assert_response :success
  end

  test "should destroy song" do
    assert_difference("Song.count", -1) do
      delete song_url(@song), as: :json
    end

    assert_response :no_content
  end
end
