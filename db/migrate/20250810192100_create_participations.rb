class CreateParticipations < ActiveRecord::Migration[8.0]
  def change
    create_table :participations do |t|
      t.references :participant, null: false, foreign_key: true
      t.references :round, null: false, foreign_key: true
      t.boolean :is_joining
      t.boolean :is_paid

      t.timestamps
    end
  end
end
