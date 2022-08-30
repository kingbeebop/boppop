require "test_helper"

class PlaylistsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @playlist = playlists(:one)
  end

  test "should get index" do
    get playlists_url, as: :json
    assert_response :success
  end

  test "should create playlist" do
    assert_difference("Playlist.count") do
      post playlists_url, params: { playlist: { contest: @playlist.contest, pic: @playlist.pic, soundcloud_url: @playlist.soundcloud_url, theme: @playlist.theme, video: @playlist.video, winner: @playlist.winner } }, as: :json
    end

    assert_response :created
  end

  test "should show playlist" do
    get playlist_url(@playlist), as: :json
    assert_response :success
  end

  test "should update playlist" do
    patch playlist_url(@playlist), params: { playlist: { contest: @playlist.contest, pic: @playlist.pic, soundcloud_url: @playlist.soundcloud_url, theme: @playlist.theme, video: @playlist.video, winner: @playlist.winner } }, as: :json
    assert_response :success
  end

  test "should destroy playlist" do
    assert_difference("Playlist.count", -1) do
      delete playlist_url(@playlist), as: :json
    end

    assert_response :no_content
  end
end
