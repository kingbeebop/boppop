class CreateLinks < ActiveRecord::Migration[7.0]
  def change
    create_table :links do |t|
      t.string :name
      t.string :url
      t.integer :user_id

      t.timestamps
    end
  end
end
