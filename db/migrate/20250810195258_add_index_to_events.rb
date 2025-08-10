class AddIndexToEvents < ActiveRecord::Migration[8.0]
  def change
    add_column :events, :share_token, :string
    add_index :events, :share_token
  end
end
