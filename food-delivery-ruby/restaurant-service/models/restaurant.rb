require 'activerecord'

class Restaurant < ActiveRecord::Base
  has_many :menu_items, dependent: :destroy
  validates :name, presence: true
  validates :address, presence: true

  def as_json(options = {})
    {
      id: id,
      name: name,
      address: address,
      phone: phone,
      cuisine_type: cuisine_type,
      rating: rating,
      created_at: created_at,
      updated_at: updated_at,
      menu_items: options[:include_menu] ? menu_items.map(&:as_json) : nil
    }.compact
  end
end