class CreateComments < ActiveRecord::Migration[7.0]
  def change
    create_table :comments do |t|
      t.integer :user_id
      t.integer :playlist_id
      t.text :content

      t.timestamps
    end
  end
end
