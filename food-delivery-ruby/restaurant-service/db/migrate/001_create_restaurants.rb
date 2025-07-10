class CreateRestaurants < ActiveRecord::Migration[7.0]
  def up
    create_table :restaurants do |t|
      t.string :name, null: false
      t.text :address, null: false
      t.string :phone
      t.string :cuisine_type
      t.decimal :rating, precision: 3, scale: 2, default: 0.0
      t.timestamps
    end

    add_index :restaurants, :name
    add_index :restaurants, :cuisine_type
  end

  def down
    drop_table :restaurants
  end
end