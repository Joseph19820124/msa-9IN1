class CreateOrders < ActiveRecord::Migration[7.0]
  def up
    create_table :orders do |t|
      t.integer :customer_id, null: false
      t.integer :restaurant_id, null: false
      t.text :items, null: false
      t.decimal :total_amount, precision: 10, scale: 2, null: false
      t.string :status, default: 'pending'
      t.timestamps
    end

    add_index :orders, :customer_id
    add_index :orders, :restaurant_id
    add_index :orders, :status
  end

  def down
    drop_table :orders
  end
end