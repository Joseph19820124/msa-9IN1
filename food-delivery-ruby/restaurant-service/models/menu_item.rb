require 'activerecord'

class MenuItem < ActiveRecord::Base
  belongs_to :restaurant
  validates :name, presence: true
  validates :price, presence: true
  validates :restaurant_id, presence: true

  def as_json(options = {})
    {
      id: id,
      restaurant_id: restaurant_id,
      name: name,
      description: description,
      price: price,
      category: category,
      available: available,
      created_at: created_at,
      updated_at: updated_at
    }
  end
end