require 'activerecord'

class Order < ActiveRecord::Base
  validates :customer_id, presence: true
  validates :restaurant_id, presence: true
  validates :total_amount, presence: true
  validates :status, presence: true

  def as_json(options = {})
    {
      id: id,
      customer_id: customer_id,
      restaurant_id: restaurant_id,
      items: items,
      total_amount: total_amount,
      status: status,
      created_at: created_at,
      updated_at: updated_at
    }
  end
end