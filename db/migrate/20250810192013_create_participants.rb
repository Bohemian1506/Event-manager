class CreateParticipants < ActiveRecord::Migration[8.0]
  def change
    create_table :participants do |t|
      t.references :event, null: false, foreign_key: true
      t.string :name
      t.string :email
      t.string :edit_token
      t.datetime :expires_at

      t.timestamps
    end
    add_index :participants, :edit_token
  end
end
