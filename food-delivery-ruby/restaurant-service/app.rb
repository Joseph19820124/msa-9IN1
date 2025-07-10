require 'sinatra'
require 'sinatra/json'
require 'sinatra/activerecord'
require './models/restaurant'
require './models/menu_item'

# Configuration
set :port, ENV['PORT'] || 3002
set :bind, '0.0.0.0'
set :database_url, ENV['DATABASE_URL'] || 'postgresql://localhost/food_delivery_restaurants'

# Health check
get '/health' do
  json({ status: 'healthy', service: 'restaurant-service' })
end

# Get all restaurants
get '/restaurants' do
  restaurants = Restaurant.all
  json(restaurants.map(&:as_json))
end

# Get restaurant by ID
get '/restaurants/:id' do
  restaurant = Restaurant.find_by(id: params[:id])
  
  if restaurant
    json(restaurant.as_json)
  else
    status 404
    json({ error: 'Restaurant not found' })
  end
end

# Create new restaurant
post '/restaurants' do
  request.body.rewind
  data = JSON.parse(request.body.read)
  
  restaurant = Restaurant.new(data.select { |k, v| Restaurant.column_names.include?(k) })
  
  if restaurant.save
    status 201
    json(restaurant.as_json)
  else
    status 400
    json({ error: restaurant.errors.full_messages })
  end
end

# Update restaurant
put '/restaurants/:id' do
  restaurant = Restaurant.find_by(id: params[:id])
  
  unless restaurant
    status 404
    json({ error: 'Restaurant not found' })
    return
  end
  
  request.body.rewind
  data = JSON.parse(request.body.read)
  
  if restaurant.update(data.select { |k, v| Restaurant.column_names.include?(k) })
    json(restaurant.as_json)
  else
    status 400
    json({ error: restaurant.errors.full_messages })
  end
end

# Get restaurant menu
get '/restaurants/:id/menu' do
  restaurant = Restaurant.find_by(id: params[:id])
  
  unless restaurant
    status 404
    json({ error: 'Restaurant not found' })
    return
  end
  
  menu_items = restaurant.menu_items
  json(menu_items.map(&:as_json))
end

# Add menu item
post '/restaurants/:id/menu' do
  restaurant = Restaurant.find_by(id: params[:id])
  
  unless restaurant
    status 404
    json({ error: 'Restaurant not found' })
    return
  end
  
  request.body.rewind
  data = JSON.parse(request.body.read)
  data['restaurant_id'] = params[:id]
  
  menu_item = MenuItem.new(data.select { |k, v| MenuItem.column_names.include?(k) })
  
  if menu_item.save
    status 201
    json(menu_item.as_json)
  else
    status 400
    json({ error: menu_item.errors.full_messages })
  end
end

# Update menu item
put '/restaurants/:restaurant_id/menu/:id' do
  menu_item = MenuItem.find_by(id: params[:id], restaurant_id: params[:restaurant_id])
  
  unless menu_item
    status 404
    json({ error: 'Menu item not found' })
    return
  end
  
  request.body.rewind
  data = JSON.parse(request.body.read)
  
  if menu_item.update(data.select { |k, v| MenuItem.column_names.include?(k) })
    json(menu_item.as_json)
  else
    status 400
    json({ error: menu_item.errors.full_messages })
  end
end