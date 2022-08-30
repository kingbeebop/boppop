class CreateVotes < ActiveRecord::Migration[7.0]
  def change
    create_table :votes do |t|
      t.integer :user_id
      t.integer :song_id
      t.integer :playlist_id
      t.boolean :contestant

      t.timestamps
    end
  end
end
