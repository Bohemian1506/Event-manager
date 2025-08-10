class CreateRounds < ActiveRecord::Migration[8.0]
  def change
    create_table :rounds do |t|
      t.references :event, null: false, foreign_key: true
      t.string :name
      t.integer :order
      t.string :venue
      t.time :start_time
      t.integer :fee

      t.timestamps
    end
  end
end
