require "test_helper"

class VotesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @vote = votes(:one)
  end

  test "should get index" do
    get votes_url, as: :json
    assert_response :success
  end

  test "should create vote" do
    assert_difference("Vote.count") do
      post votes_url, params: { vote: { comment: @vote.comment, contestant: @vote.contestant, song_id: @vote.song_id, user_id: @vote.user_id } }, as: :json
    end

    assert_response :created
  end

  test "should show vote" do
    get vote_url(@vote), as: :json
    assert_response :success
  end

  test "should update vote" do
    patch vote_url(@vote), params: { vote: { comment: @vote.comment, contestant: @vote.contestant, song_id: @vote.song_id, user_id: @vote.user_id } }, as: :json
    assert_response :success
  end

  test "should destroy vote" do
    assert_difference("Vote.count", -1) do
      delete vote_url(@vote), as: :json
    end

    assert_response :no_content
  end
end
