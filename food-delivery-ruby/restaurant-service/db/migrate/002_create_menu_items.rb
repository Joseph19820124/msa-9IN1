class CreateMenuItems < ActiveRecord::Migration[7.0]
  def up
    create_table :menu_items do |t|
      t.integer :restaurant_id, null: false
      t.string :name, null: false
      t.text :description
      t.decimal :price, precision: 10, scale: 2, null: false
      t.string :category
      t.boolean :available, default: true
      t.timestamps
    end

    add_index :menu_items, :restaurant_id
    add_index :menu_items, :category
    add_index :menu_items, :available
    add_foreign_key :menu_items, :restaurants
  end

  def down
    drop_table :menu_items
  end
end