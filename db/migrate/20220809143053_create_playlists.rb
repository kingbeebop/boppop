class CreatePlaylists < ActiveRecord::Migration[7.0]
  def change
    create_table :playlists do |t|
      t.integer :number
      t.string :theme
      t.integer :winner
      t.string :video
      t.string :url
      t.boolean :current
      t.boolean :previous
      t.boolean :contest
      t.boolean :pending

      t.timestamps
    end
  end
end
